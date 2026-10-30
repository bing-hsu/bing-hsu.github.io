+++
title = '为什么使用 4B 本地模型的 Agent 第一轮就退出了？'
date = '2026-10-30T9:00:00+08:00'
draft = false
translationKey = 'why-your-4b-agent-quits-on-turn-1'
tags = ['AI Agents']
description = '为什么 4B 本地模型会在 Agent 循环的第一轮就退出？从提供方强制执行的 Schema、工具调用与终止条件，到小模型的上下文负担，拆解两种失败现象及应对思路。'
math = true
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

你给 Agent 配上了搜索工具、推理预算，以及严格的 Pydantic 响应格式。为什么它却在第一步就停了下来，把“收集完数据后，我需要进行计算”这样一句话包装成合法的结构化输出，直接交了差？

这篇文章记录一次排查过程：当小型本地模型驱动 Agent 工作流时，一种不容易察觉的失败模式是如何出现的。

## 观察到的失败现象

### 第一次尝试

你像下面这样组装了一个 Agent：

```py
agent = create_agent(
    model=llm,
    tools=[search_web],
    system_prompt=system_prompt,
    response_format=ResponseT,
)
```

使用的是一个 4B 本地模型：

```py
model_name = "gemma4:e4b"
llm = ChatOllama(model=model_name, reasoning=True)
```

接着指定输出 Schema 和系统提示词，**还专门加了一句，要求模型提交结构化输出，而不是继续用自然语言解释**。

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

然后发起一次运行：

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

结果，意外出现了：

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

### 第二次尝试

“难道是我对结构化输出的要求还不够强？”你想。

于是，你在 LangChain 文档中找到了
[`ProviderStrategy`](https://docs.langchain.com/oss/python/langchain/structured-output#provider-strategy)。

> 文档将提供方原生支持的结构化输出描述为可用时最可靠的方式:
>
> Some model providers support structured output natively through their APIs
> (e.g. OpenAI, xAI (Grok), Gemini, Anthropic (Claude)). This is the most
> reliable method when available. To use this strategy, configure a
> `ProviderStrategy`

“就是它了！用这个最可靠的方式试试。” 于是，你稍微调整了代码：

```py
agent = create_agent(
    model=llm,
    tools=[_calc],
    system_prompt=system_prompt,
    response_format=ProviderStrategy(ResponseT), # <-- change this
)
```

然而，它又让你失望了：

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

## 检查实际对话

先把实际对话打印出来，看看究竟发生了什么。

```py
for m in rtn['messages']:
    m.pretty_print()

print(rtn["messages"][-1].usage_metadata)
```

**使用 `response_format=ResponseT` 时的对话**

用量元数据(`usage_metadata`)：

```json
{ "input_tokens": 3990, "output_tokens": 612, "total_tokens": 4602 }
```

```text
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

---

**使用 `response_format=ProviderStrategy(ResponseT)` 时的对话**

用量元数据(`usage_metadata`)：

```json
{ "input_tokens": 40, "output_tokens": 45, "total_tokens": 85 }
```

```text
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

---

显然，使用 `response_format=ResponseT` 时，对话比使用
`ProviderStrategy(ResponseT)` 的时候要长得多。后一种情况下，模型明明说“I need to
search for Kipchoge's pace and the Earth-Moon distance first”，却完全没有调用
`search_web`。

有几种因素交织在一起，造成了这个结果，下面我们逐一拆解。

## 因素一：模型API侧执行输出语法的实际作用

> 向 Ollama 传入 `format`
> 时，运行时会在推理引擎层面约束生成结果，使输出符合指定 Schema。这种约束与工具调用输出之间的关系，是本次排查的关键。

> 直接经验：在Agent多轮调用的工作情境下，不要在 Ollama 的推理模型上使用
> `ProviderStrategy`。

当你通过 `langchain-ollama` 指定 `response_format=ProviderStrategy(ResponseT)`
时，LangChain 会利用 Ollama 原生的 `format`
参数，将 Schema 约束交给 Ollama 运行时处理。

Ollama 的原生结构化输出，会在逐 Token 生成时依据 JSON Schema 限制可选输出。

而要调用 `search_web`，模型需要发出工具调用指令，通常表现为包含 `tool_calls`
消息，或模型专用的调用标记。如果整个生成过程都被限制在 `ResponseT`
内，模型可以输出的结构就受到了约束。

原文据此提出的解释是：在这一配置下，模型无法在不违反后端语法约束的前提下发出
`search_web` 调用，只能填写 `ResponseT` 的字段。 而一旦模型生成符合
`response_format`
的输出，LangChain 的 Agent 运行时就会将其视为最终结果并结束循环。

接下来，我们来看看这个终止机制。

## 因素二：Agent 循环的终止机制

> 循环会在模型提交了**满足指定终止格式的响应**后结束，不代表底层任务已经真正完成。

Agent 循环会交替进行决定行动(Decision-Making)和执行行动(Take
Action)，直到满足**终止条件**。

**终止条件：**
当模型输出合法的最终响应格式，或调用指定的输出 Schema 时，运行时就可能判定本次执行已经完成，并停止循环。

在这次实验中，`ResponseT` 一生成，Agent Loop就退出了。

这个机制与 Ollama 的原生 Schema 约束结合起来就解释了为什么
`ProviderStrategy(ResponseT)` 那次对话如此短：**模型在第一轮就提交了终止格式
`ResponseT`**，工具调用还没发生，Agent Loop便已经结束。

接下来还剩另一个问题：为什么第一次尝试中，使用默认的
`response_format=ResponseT`，最终却也没有拿到结构化输出？这就和“小”模型有关。

## 因素三：有效上下文长度与信噪比

### 训练偏好

去掉
`ProviderStrategy`，可以避开上述 Token 级语法限制，却也暴露了另一种失败模式：**小模型习惯用自然语言作答的倾向，压过了调用结构化输出 Schema 的指令。**

- 模型把最后一步理解成了“向人解释答案”，而不是“为 API 构造一个对象”。
- 在 Fine Tuning 和 RLHF 中，模型通常会被鼓励使用清晰的 Markdown、标题和列表。

另一个尤其值得关注的因素，是上下文的有效长度，以及其中的信噪比。

### 上下文长度与能力退化

注意最后一条 `AIMessage` 的元数据：

```python
{ "input_tokens": 3990, "output_tokens": 612, "total_tokens": 4602 }
```

原文将这次格式要求失效的现象，与小模型的注意力容量和搜索结果带来的噪声联系起来：当上下文中出现数千个 Token 的工具信息时，位于最前面的系统指令 (_"submit
ResponseT instead of continuing to explain your answer in
prose"_) 可能不再被稳定遵循。

模型保住了语义目标，也就是解答"基普乔格跑到月球需要多久"，却忘记了操作约束："必须通过
`ResponseT` 交付结果"。

## 小结

这两次尝试呈现出使用小型开放权重模型搭建 Agent 时的两种失败现象：

- **`ProviderStrategy(ResponseT)`**
  - **约束方式：** 在提供方侧，通过 Token 级语法约束限制输出。
  - **优势：** 能更强地约束 JSON 结构。
  - **本次失败现象：**
    尚未完成搜索，便生成合法的最终响应并提前退出。原文将其解释为工具调用与最终输出语法之间的冲突。

- **默认的 `ResponseT` 策略**
  - **约束方式：**
    通过工具或提示词等方式向模型提供输出 Schema，具体取决于框架选择的策略。
  - **优势：** 在本次运行中，模型能够进行多轮工具调用和推理。
  - **本次失败现象：**
    完成多步处理后，最终仍返回 Markdown 自然语言回答，没有提交预期的结构化结果。

### 上下文长度与模型规模

模型卡可能标注 32k、128k，甚至 1M
Token 的上下文窗口，但**在 Agent 任务中能够稳定发挥作用的有效上下文长度**，可能小得多。

多步 Agent 工作流需要同时处理推理、工具调用和系统指令。每一轮既要追踪新增信息，又要保留先前约束，这会进一步增加上下文管理的负担。可参考
[“Active Context”](https://langwatch.ai/research/finding-the-optimal-context-window)。

对于需要**严格遵循 Schema、路由工具调用，并在噪声中进行多步推理**的任务，原文给出了以下上下文预算建议：

- **超小型模型（1B–3B）**
  - 建议范围：1,500–2,500 Token。
  - 需要关注：输出格式崩溃、虚构工具名称，或直接输出内部状态。

- **小型模型（4B–9B）**
  - 建议范围：3,000–6,000 Token。
  - 需要关注：指令漂移。模型仍记得数学或事实层面的目标，却丢失禁止性指令和格式要求。

- **中型模型（12B–35B）**
  - 建议范围：12,000–24,000 Token。
  - 需要关注：多跳推理退化、工具参数颠倒，或遗漏细微前提。

- **大型及前沿模型（70B+）**
  - 建议范围：32,000–64,000 Token。
  - 需要关注：相关信息夹在大量工具输出中间时，出现“中间信息丢失”（lost-in-the-middle）一类的检索问题。

**这些区间只是原文提出的经验性建议，不是经过本文实验验证的通用上限。**
具体表现仍取决于模型、任务、上下文内容与调用配置。本次 `gemma4:e4b`
的实验中，数千 Token 的输入伴随杂乱搜索结果，已经出现了指令遵循不稳定的现象。

### Agent 循环的额外记忆负担

与一次简单的 LLM 请求—响应相比，Agent 循环有更高的操作负担。输入上下文需要同时承载多种信息：

1. 评估工具输出，理解其语义。
2. 整合中间计算与推理过程。
3. 追踪对话整体状态。
4. **遵守禁止性约束**，例如“不要用自然语言直接作答”。

在本次失败现象中，模型继续完成了语义层面的任务，却没有保持结构化交付的要求。这提醒我们，应分别验证“是否答对问题”和“是否遵守运行协议”。

### 小模型的应对思路

在 Agent 系统中部署 4B–8B 模型时，可以尝试以下架构与上下文管理方式，减少对单次提示词遵循能力的依赖：

- **上下文压缩与清理，提高信噪比：**
  预先解析搜索摘要和工具返回值，仅将相关内容加入对话历史，减少无关 HTML 或杂乱文本。
- **在上下文末尾重申关键要求：** 利用近期信息更容易被关注的特点(recency
  bias)，在后续调用中再次提醒输出要求。
- **预定义工作流，减少自主编排负担：**
  将多步处理封装成确定性的流程，避免小模型同时承担设计、规划和协调整个工作流的任务，从而控制上下文膨胀。
- **两阶段架构：Agent + 提取器：**
  先让 Agent 自然地推理并完成任务，再把结果交给一个轻量、单轮的结构化提取步骤，生成最终的
  `ResponseT`。
