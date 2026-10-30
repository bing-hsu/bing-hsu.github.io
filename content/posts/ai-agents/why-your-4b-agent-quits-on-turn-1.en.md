+++
title = 'Why Your Agent on a 4B Local Model Quits on Turn 1'
date = '2026-10-30T9:00:00+08:00'
draft = false
translationKey = 'why-your-4b-agent-quits-on-turn-1'
tags = ['AI Agents']
description = 'Why a 4B local model quits an agent loop on turn 1: provider-enforced schemas lock out tool calls, while unconstrained runs drift back into prose. The context-length mechanics behind it, plus practical mitigations for small models.'
math= true
+++

<!-- span color classes (inserted by :SpanStyles) -->
<style>
  .red       { color: #e74c3c; }
  .orange    { color: #e67e22; }
  .yellow    { color: #b58900; }
  .green     { color: #27ae60; }
  .blue      { color: #3498db; }
  .purple    { color: #8e44ad; }
  .dim       { color: #888888; }
  .highlight { background-color: #fff3b0; color: #7a5c00; }
</style>

You gave your agent a search tool, a reasoning budget, and a strict Pydantic
response format. Why did it stop on Step 1 with a nonsense like "I need to
perform the calculation after gathering data" wrapped in a valid structured
output?

This post investigates an insidious failure pattern in agentic workflows powered
by small size local models.

## Failure Observation

### Attempt #1

You assemble an agent like this,

```py
agent = create_agent(
    model=llm,
    tools=[search_web],
    system_prompt=system_prompt,
    response_format=ResponseT,
)
```

using a local 4B model,

```py
model_name = "gemma4:e4b"
llm = ChatOllama(model=model_name, reasoning=True)
```

with the output schema and system prompt specified, **with a dedicated line
instructing the model to use structured output, instead of prose**.

```py
class ResponseT(BaseModel):
    ok: bool
    error: str | None
    answer: str | None

system_prompt = """
You are a direct, concise assistant. 

Use search_web when you do not have necessary information

Arguments for ResponseT:
- ok: true when the question was answered successfully; otherwise false.
- answer: a concise answer when ok is true; otherwise null.
- error: null when ok is true; otherwise a brief explanation of the failure.

After gathering enough information, submit ResponseT instead of continuing
to explain your answer in prose.
"""
```

Triggers a run,

```py
input_state: InputAgentState = {
    "messages": [
        HumanMessage(
            "If marathon runner Eliud Kipchoge could maintain his"
            "world record pace indefinitely, how long would it take "
            "him to reach the Moon?"
        )
    ]
}

rtn = agent.invoke(input_state)
```

And surprise surprise,

```py
# No structured response
print(rtn['structured_response']) # None

# The last response is an AI message with a prose content
type(rtn['messages'][-1]) # langchain_core.messages.ai.AIMessage
print(rtn['messages'][-1].content)
"""
Based on the provided data, here is the calculated time:

**1. Determine Kipchoge's Pace (Speed):**
*   World Record Distance: 42.195 km (42,195 meters)

...

**Answer:**
It would take approximately **2.12 years** (or 775 days) to reach the Moon at his marathon world record pace.
"""
```

### Attempt #2

"I must not press on the 'structured output' part hard enough!" you think.

From LangChain's doc, you see
[`ProviderStrategy`](https://docs.langchain.com/oss/python/langchain/structured-output#provider-strategy).

> Some model providers support structured output natively through their APIs
> (e.g. OpenAI, xAI (Grok), Gemini, Anthropic (Claude)). This is the most
> reliable method when available. To use this strategy, configure a
> `ProviderStrategy`

"Ah Ha! This must be it. I will use this 'most reliable method'". So a little
tweak to code,

```py
agent = create_agent(
    model=llm,
    tools=[_calc],
    system_prompt=system_prompt,
    response_format=ProviderStrategy(ResponseT), # <-- change this
)
```

It lets you down again,

```py
# now it returns a structured output,
# but it is not what you expect
print(rtn['structured_response'])
"""
ResponseT(
  ok=True,
  error=None,
  answer="I need to search for Kipchoge's pace
        and the Earth-Moon distance first.")
"""

# The last response is an AI message with a "JSON content"
type(rtn['messages'][-1]) # langchain_core.messages.ai.AIMessage
print(rtn['messages'][-1].content)
"""
{
  "ok": true,
  "error": null,
  "answer": "I need to search for Kipchoge's pace
        and the Earth-Moon distance first."
}
"""
```

## Investigate Conversation

Let's see the actual conversations to make sense what is going on.

```py
for m in rtn['messages']:
    m.pretty_print()

print(rtn["messages"][-1].usage_metadata)
```

**Conversation when `response_format=ResponseT`**

Usage Metadata:

```json
{ "input_tokens": 3990, "output_tokens": 612, "total_tokens": 4602 }
```

```
================================ Human Message =================================

If marathon runner Eliud Kipchoge could maintain hisworld record pace
indefinitely, how long would it take him to reach the Moon?
================================== Ai Message ==================================
Tool Calls:
  search_web (97108cb0-7ab4-48af-b3ac-f531da111c38)
 Call ID: 97108cb0-7ab4-48af-b3ac-f531da111c3
  Args:
    query: Eliud Kipchoge world record pace speed
================================= Tool Message =================================
Name: search_web

[{"url": "https://www.youtube.com/watch?v=SRYtn0j5ccA", "title": "Runners
Attempt Eliud Kipchoge’s World Record Marathon Pace", "content": "###
Description ... now I cannot stop smiling 500 meters to go he has the help
tally to himself he's the Pacemakers I've let him go as ed", "score": 0.2488585,
 "raw_content": null, "id": "a02059-04"}]
================================== Ai Message ==================================
Tool Calls:
  search_web (7d4f42b6-6057-4d8a-a59a-13a51af231fc)
 Call ID: 7d4f42b6-6057-4d8a-a59a-13a51af231fc
  Args:
    query: average distance to the moon in kilometers
================================= Tool Message =================================
Name: search_web

[{"url": "https://en.wikipedia.org/wiki/Lunar_distance", "title": "Lunar
distance ... hello to eachother.", "score": 0.8655088, "raw_content": null,
"id": "942b1b-01"}]
================================== Ai Message ==================================

The calculation requires the average speed of Eliud Kipchoge during his record
attempt and the average distance to the Moon.

1.  **Kipchoge's Average Speed:** His sub-two-hour run (1:59:40.2) maintained
    an average speed of approximately $21.2 \text{ km/h}$.
2.  **Distance to the Moon:** The average distance from the Earth to the Moon
    is approximately $385,000 \text{ km}$.
3.  **Time Calculation:**
    $$\text{Time} = \frac{\text{Distance}}{\text{Speed}} = \frac{385,000
    \text{ km}}{21.2 \text{ km/h}} \approx 18,170 \text{ hours}$$

This equates to:
*   $757 \text{ days}$
*   Approximately $2.1 \text{ years}$

It would take him approximately **2.1 years** to reach the Moon at that pace.

```

**Conversation with `response_format=ProviderStrategy(ResponseT)`**

Usage Metadata:

```json
{ "input_tokens": 40, "output_tokens": 45, "total_tokens": 85 }
```

```
================================ Human Message =================================

If marathon runner Eliud Kipchoge could maintain hisworld record pace indefinitely,
how long would it take him to reach the Moon?
================================== Ai Message ==================================

{
  "ok": true,
  "error": null,
  "answer": "I need to search for Kipchoge's pace and the Earth-Moon distance
            first."
}
```

Clearly, conversion with `response_format=ResponseT` is much longer than
`response_format=ProviderStrategy(ResponseT)`, where you may be surprised to see
that the web search tool `search_web` is not used at all, even though model
explicitly express the intention to search for information
`I need to search for Kipchoge's pace and the Earth-Moon distance first`.

This result is due to multiple factors tangled together, let's unwrap them, one
by one.

## Factor 1: Provider-Enforced Grammar's Behavior

> When format is supplied to Ollama, the runtime enforces the schema at the
> inference engine level, ensuring that every token generated strictly adheres
> to the schema, including tool call generation.

> Short answer: **Do not use `ProviderStrategy` with a reasoning model served by
> Ollama**

When you specify `response_format=ProviderStrategy(ResponseT)` with
`langchain-ollama`, LangChain delegates schema enforcement to the Ollama runtime
via its native `format` parameter.

Ollama’s native structured output works by enforcing a JSON schema on the
model's logits at every token generation step.

For the model to call `search_web`, it must emit a tool call payload (typically
structured as an assistant message with a `tool_calls` block or model-specific
function markers). However, when the provider is instructed to force the entire
generation into `ResponseT`'s schema, the model's output space is restricted.

The model cannot emit a tool call to `search_web` without violating the grammar
enforced by the backend. It has no structural path forward other than filling
the fields of `ResponseT`.

And if a model output satisfies a `response_format`, LangChain's agent loop
runtime regards this as the final output, hence terminates the loop. See next.

## Factor 2: Agent Loop Stopping Mechanics

> The loop terminates when the model emits a response that **satisfies a
> designated terminal format**, regardless of whether the underlying task was
> actually completed.

The agent loop alternates between **deciding an action** and **executing an
action** until a termination condition is met.

**Termination Condition:** The moment the model outputs a valid terminal format
(or invokes the designated output schema), the agent loop evaluates the
condition as "complete" and halts execution.

As soon as a `ResponseT` was generated, the orchestrator exited the loop.

This mechanic plus Ollama's strict native schema enforcement explains why with
`response_format=ProviderStrategy(ResponseT)` leads to such a short conversation
and by pass tool calling entirely: Model is forced to produce a `ResponseT` and
the agent loop exists on turn 1.

Then the left question is why we do not get a structured output with
`response_format=ProviderStrategy(ResponseT)`, and it is related to the fact of
using a small model.

## Factor 3: Effective Context Size and Signal-to-Noise Ratio

**Prior Preference**

By removing `ProviderStrategy`, you resolved the token-level grammar lock.
However, you exposed the opposite failure mode of small models: **the model's
pre-training prior to answer conversationally overrides its instructions to
invoke a structured schema**.

- The model internally framed the final step as _explaining an answer to a
  human_, not _formatting an object for an API_.

- During instruction tuning and RLHF, models are heavily reinforced to output
  clear markdown text, headers, and bullet points when explaining math.

Another factor which is more prominent, especially when it comes to small model,
is the effective context size and signal-to-noise ratio in context.

**Context Size and Degradation**

Notice the metadata of the last `AIMessage`:

```python
{ "input_tokens": 3990, "output_tokens": 612, "total_tokens": 4602 }
```

A 4B parameter model has limited attention heads. Over a 4,500+ token context
filled with **noisy web search HTML**, the system prompt at the very beginning
(_"submit ResponseT instead of continuing to explain your answer in prose"_)
experiences severe **attention dilution** (the "lost-in-the-middle" effect).

The model retained the semantic goal (solve the Eliud Kipchoge math problem) but
lost the rigid operational constraint (deliver via `ResponseT`).

## Takeaway

These two experiments illustrate the an architectural dilemma when deploying
small open-weights models in agentic task:

| Configuration                     | Mechanism                                             | Pros                                                  | Failure Mode                                                                                                |
| --------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `ProviderStrategy(ResponseT)`     | Token-level logit masking                             | 100% guarantee of valid JSON structure.               | **Tool Lockout (Premature Exit):** Token mask blocks function calling, forcing the agent to exit on Turn 1. |
| Default `ResponseT` (Tool/Prompt) | Schema exposed as a tool or system prompt instruction | Allows agentic multi-turn tool calling and reasoning. | **Instruction Drift:** After multi-hop reasoning, the model forgets the schema and outputs markdown prose.  |

### Context Length and Model Size

While model cards often advertise context windows of 32k, 128k, or even 1M
tokens, **effective agentic context length** is significantly smaller than the
advertised limit.

For multi-step agentic workflow with reasoning, tool calling and system
instructions, the effective context is even smaller for each turn to keep track
of the new incremental information if not sacrificing old ones. See
["Active Context"](https://langwatch.ai/research/finding-the-optimal-context-window)

For tasks requiring **strict schema adherence, tool routing, and multi-step
reasoning under noise**, the practical upper bounds are:

| Model Scale                 | Reliable Agentic Context (Strict Schema / Tool Calls) | Dominant Failure Mode Beyond Limit                                                                                            |
| --------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Ultra-Small (1B – 3B)**   | **1,500 – 2,500 tokens**                              | format collapse; hallucinates tool names or outputs raw internal states.                                                      |
| **Small (4B – 9B)**         | **3,000 – 6,000 tokens**                              | **Instruction drift:** Retains high-level math/factual goal, but drops negative and formatting constraints (your exact case). |
| **Medium (12B – 35B)**      | **12,000 – 24,000 tokens**                            | Multi-hop reasoning degradation; tool argument inversion or subtle premise omission.                                          |
| **Large / Frontier (70B+)** | **32,000 – 64,000 tokens**                            | "Lost-in-the-middle" recall misses when relevant needles sit between large tool dumps.                                        |

Above is only a theoretic recommendation. In current case, ~4,500 tokens,
combined by messy web search result are already enough to cause instruction
drift for our `gemma:e4b` model.

### Agentic Loop Memory Tax

In contrast to a simple LLM Request-Response cycle, an agent loop imposes an
higher **operational cognitive load**, the input context (working memory) is
used to keep track of multiple information at the same time:

1. Evaluate tool output (semantic parsing).
2. Synthesize intermediate calculations (reasoning trace).
3. Track overall conversation status (state evaluation).
4. **Comply with negative constraints** (e.g., _"Do not output prose"_).

Negative and structural constraints are the most fragile representations in a
model's working memory. Once token counts cross the model's threshold, semantic
task completion always takes precedence over structural formatting.

### Mitigations for Small Models

When deploying models in the 4B–8B range within agent systems, relying solely on
prompt adherence will consistently fail. Common architectural patterns to
circumvent this include:

- **Context Compaction & Hygiene (Raise Signal-to-Noise Ratio):** Never pass raw
  search results or unformatted tool returns to the agent. Pre-parse search
  snippets and include only the relevant parts to the conversation history.
- **Instruction "Sandwiching":** Because of recency bias, **re-inject critical
  requirements** into the latest human/tool message.
- **Predefined Workflows ("Do not make me think"):** Instead of letting the
  small model autonomously design, plan and coordinate a multi-step
  workflow—which quickly inflates the context window and causes **instruction
  drift**—encapsulate that multi-step logic into a deterministic workflow.
- **Two-Step Architecture (Agent + Extractor):** Allow the small model to think
  and answer naturally in prose, then route that output through a lightweight,
  single-turn extraction step using structured output to produce the final
  `ResponseT`.
