+++
date = '2026-11-13T15:59:26+08:00'
draft = true
title = 'Data Characteristics and Math Toolset'
description = 'Understand time-to-event data, censoring, and latent event times, then connect survival and hazard functions to the modeling approaches behind Cox and AFT models.'
tags = ['Analytics']
translationKey='analyze-time-to-event-1'
math = true
seriesID = 'analyze-time-to-event'
seriesTitle = 'Analyze Time-to-Event'
seriesRole = 'chapter'
seriesChapter = 1
seriesSection = 0
seriesOrder = 100
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

## Time-to-Event Data

**Time-to-event data** measures the time elapsed and state of a subject over an
observation window.

<figure style="text-align: center; width: 100%; max-width: 600px; margin: 30px auto;">
<img src="/img/analytics/time-to-event.png" alt="time-to-event" />
</figure>

- **Observation Window $\tau$ or $T_\text{max}$**: from "start of study" to
  "analysis point"
- **Recruited $t_\text{entry}$**: the starting point of observation for a
  subject
- **Event $t_\text{event}$**, indicating an event of interest happens to a
  subject within the observation window.
- **Censored $t_\text{censored}$**, indicating no event of interest happens to a
  subject within the observation window.

Each subject $i$ is represented as a structure:

$$(T_i, \delta_i, X_i)$$

- **Duration ($T_i$):** The duration a subject exists within the observation
  window ($T_i \le \tau$).
- **Status Indicator ($\delta_i$):**
  - $\delta_i = 1$: Event occurred at time $T_i$.
  - $\delta_i = 0$: Event did not occur in the observation window.
- **Covariates $X_i = (X_{i1}, X_{i2}, \dots, X_{ip})$:** $p$ independent
  factors characterizing $i$.

## Calendar Time vs. Duration

Be aware of two distinct notions about time: **calendar time $t$** and
**duration $T$**

For example, subject 10 has an observation duration of around 15
($t_{\text{event}} - t_{\text{entry}} = 65 - 50 \approx 15$), but the event
occurs at 65 ($t_{\text{event}} \approx 65$).

- **Calendar Time ($t$):** The **universal** chronological timeline. $t = 0$
  marks the day the observation starts, and $t = 100$ marks the day the
  observation stops.

- **Duration ($T$):** The **individual** clock of each subject, representing the
  elapsed time for a subject within **the** current study.

For Subject 10:

$$
\begin{aligned}
&t_{\text{entry}} \approx 50 \quad t_{\text{event}} \approx 65 \\[1em]
&T = t_{\text{event}} - t_{\text{entry}} \approx 15
\end{aligned}
$$

For Subject 7:

$$
\begin{aligned}
&t_{\text{entry}} \approx 20 \quad t_{\text{censored}} \approx 70 \\[1em]
&T = t_{\text{censored}} - t_{\text{entry}} \approx 50
\end{aligned}
$$

We can rearrange the graph using **Duration** axis:

<figure style="text-align: center; width: 100%; max-width: 500px; margin: 30px auto;">
<img src="/img/analytics/time-to-event-aligned.png" alt="alt text" />
</figure>

By this understanding, we can represent a duration $T$ using calendar time $t$:

$$
T = \begin{cases} t_{\text{event}} - t_{\text{entry}}, & \text{if } \delta = 1 \text{ (event occurred)} \\ t_{\text{censored}} - t_{\text{entry}}, & \text{if } \delta = 0 \text{ (censored)} \end{cases}
$$

Expressed algebraically via indicator notation, this is:

$$T = \delta \, (t_{\text{event}} - t_{\text{entry}}) + (1 - \delta) \, (t_{\text{censored}} - t_{\text{entry}})$$

## Premature Exit / Censoring

Subjects reaching the analysis point $t = 100$ experience **administrative
censoring** because the observation window closed, whereas Subject 7 stopped
being observed while the study was still actively running, illustrating
**right-censoring**.

## Latent Event Time $T^*$

In time-to-event analysis, what is modeled is **the conditional distribution of
the _latent event time $T^*$_ given covariant $X$**.

$${P}(T^* \mid X)$$

You do not know all of the subjects' event time $T^*$ in a study; they are
"censored" because observation cannot last forever. However, each subject has a
point in time when the event would happen. So, in a sense, this duration exists
but has just not revealed itself in the study; hence—"latent."

For some, you confirm their $T^*$ within the observation window; these are the
**"Event Subjects"**, while another group does not encounter the event within
the observation window; these are **"Censored Subjects"**.

What analysts are doing is essentially making an educated guess about when an
event will occur for these "censored subjects" ($T^*$), using the evidence from
both the "event subjects" and the "censored subjects" collected within the
observation window.

- Then "event subjects" reveal what kind of characteristics tend to cause an
  event to occur.
- The "censored subjects" reveal what kind of characteristics tend to prevent an
  event from occurring.

The predictive capability about new subjects comes from the fact that we can
**conceptualize newcomers as censored subjects who are censored at the
beginning**.

The question becomes: _can we estimate **when** the event would occur $T^*$ for
those "censored" subjects_ using the facts $(T, \delta, X)$ we have right now?

**Task A: A Censored Subject**

> Because they were censored at $T$, you know with certainty that $T^* > T$.

- **Goal:** Estimate a **residual (remaining) survival distribution** _after_
  $T$:

For Subject 7, $(T, X) = (50, X)$, we model his $T^*$:

$$
{P}(T^* > t \mid T^* > 50, X)  \quad \text{for } t > 50
$$

> _"Given that this patient stayed healthy for 50 days before observation
> terminated, when would they likely have had 'their event'?"_

**Task B: A New Subject**

We can conceptualize a new subject as a "censored" one with $T=0$: _"someone who
escapes observation at the beginning $(T, \delta) = (0,0)$"_

Because they were censored at day $0$, there is nothing you know about $T^*$ in
advance; in other words, $T^*$ is "unconstrained" / "unconditioned" on $T$.

- **Goal:** Estimate the distribution of $T^*$:

For a new subject with $X$, we model $T^*$:

$${P}(T^* > t \mid X) \quad \text{for } t \ge 0$$

### A Taxonomy about ${P}(T^* \mid X)$

The probability measure ${P}(T^* \mid X)$ is an abstract math entity. To make it
operable, we use four interrelated functions to represent it. These four
functions are related, specifying any one also procures the other three:

> Due to historical usage, these functions assume a naming convention that
> inherits from mortality studies in medical treatment—the event means "death";
> therefore, the event occurring is bad and not occurring is good.
>
> In practice, Time-to-Event is not only limited to cases where the event is
> undesirable. The preference is reversible—the event occurring is good, while
> not occurring is not preferable.

**Failure Probability $F(t)$**

> The Cumulative Density Function (CDF)

The probability of a subject does not survive beyond $t$ (experiences an event
before $t$).

$$F(t \mid X) = {P}(T^* \le t \mid X)$$

**Survival Probability $S(t)$:**

> The Complementary Cumulative Distribution Function (CCDF)

The probability that a subject survives beyond $t$ (does not experience an event
before $t$).

$$S(t \mid X) = {P}(T^* > t \mid X) = 1 - F(t \mid X)$$

**Hazard Rate $h$**

> The depletion rate of tail probability.
>
> In probability theory, the tail probability is the chance that a random
> variable exceeds a high threshold $P(X > x)$. The depletion rate (or decay
> rate) describes how fast that probability drops toward zero as the threshold
> $x$ grows large.
>
> $h$ represents what **proportion** of the remaining survival "cushion" $S(t)$
> is burned through at $t$.
>
> In a sense,
> $$h = \frac{\text{Current Speed towards Event}}{\text{Remaining Cushion till Event}}$$

$$
h(t \mid X) = \lim_{\Delta t \to 0} \frac{{P}(t \le T^* < t + \Delta t \mid T^* \ge t, X)}{\Delta t} = \frac{f(t \mid X)}{S(t \mid X)}
$$

$h$ means an instantaneous change in probability, so a rate or speed of
probability. It can exceeds 1, in fact, $h(t \mid X)$ can take any non-negative
value **in** $[0, \infty)$, so long as the instantaneous change in probability
$\Delta {P} = h(t \mid X) \cdot \Delta t \in [0,1]$**.**

> $f(t)$ is the probability density function (PDF), as the derivative of the
> failure function $f(t) = F'(t)$, it represents the speed towards failure
> (Current Speed towards Event).

**Cumulative Hazard $H(t \mid X)$:**

> Represents the expected number of events you would experience by time $t$ if
> the event were repeatable and did not "kill" you.

$$H(t \mid X) = \int_0^t h(u \mid X) \, du = -\log S(t \mid X)$$

Inverts to:

$$S(t \mid X) = \exp\big(-H(t \mid X)\big) = 1 - F(t \mid X)$$

Imagine a machine component that breaks at hazard rate $h(t)$. Every time it
breaks, you instantly replace it, changing nothing else about the environment.
Over a long duration $t$, the machine might break 3 or 4 times. That expected
count is $H(t)$ (e.g., $H(t) = 3.5$).

> Derive $H(t)$
>
> Under a Poisson process with expected count $H(t)$, the probability of
> experiencing zero events (survived until $t$, aka $S(t)$) is:
>
> $$
> S(t) = {P}(\text{Count} = 0) = \frac{H(t)^0 e^{-H(t)}}{0!} = \exp(-H(t))
> $$
>
> The probability of experiencing at least one event (failure probability,
> $F(t)$) is:
>
> $$F(t) = 1 - \exp(-H(t))$$

> You may also see $\lambda(t)$ and $\Lambda(t)$ used to denote the hazard rate
> and cumulative hazard, respectively; this article uses $h(t)$ and $H(t)$.

## Formalize $X \to T^*$

> In mathematics, to **formalize** means translating an idea into an
> **unambiguous symbolic system** governed by explicit axioms and rules of
> logical deduction.

The central problem is to <span class="orange">**estimate a
distribution**</span> about the lifetime (latent event time) $T^*$ using
covariates $X$.

$$X \longmapsto \hat{\mathcal{P}}_{T^* \mid X}$$

This expression tells the the high-level idea of the modeling activity, though
less operable, but help you make sense of what exactly does "modeling" mean.

The modeling activity attempt to build the mapping from
<span class="orange">**covariate space $X$**</span> to
<span class="orange">**the family of estimated, conditional probability
measures** $\hat{\mathcal{P}}_{T^* \mid X}$.

> A probability measure instance is when both _structure (algebraic form)_ and
> _parameters_ are fixed. With either part variable, you have a **"family"** of
> probability measures.
>
> $$\mathcal{P} = \{P_\theta : \theta \in \Theta\}$$
>
> A progression of specification:
>
> - Instance: When the form is determined and all parameters $\theta$ are fixed
>   to specific values, $P_{\theta_0}$ is a concrete probability measure.
> - Parametric family: When the functional form is fixed but parameters $\theta$
>   are allowed to vary across parameter space $\Theta$.
> - Non-parametric family: When even the form varies over a broad class, you
>   have a non-parametric family.

With this mapping, we can obtain a probability measure $P_{T^* \mid X}$ given
observations $X$, and use $P_{T^* \mid X}$ to read probability over each
candidate $T^*$ (how probable someone's lifetime is 1, 2, 5, 10, etc).

### The Method Landscape

In practice, the activity is about formulating and estimating specific
<span class="orange">**representations**</span> of the theoretical probability
measures $\mathcal{P}_{T^* \mid X}$.

> see [A Taxonomy about ${P}(T^* \mid X)$](#a-taxonomy-about)

The choice of representation leads to different schools of thoughts and methods.

**$\hat{S}(t \mid x)$, Conditional CCDF (Survival Function)**

$$x \longmapsto \hat{S}(t \mid x) = \hat{P}(T^* > t \mid x)$$

> [Accelerated Failure Time (AFT) Models](#accelerated-failure-time-aft),
> Bennett’s Proportional Odds model, Logistic-hazard models, Random Survival
> Forests (RSF)

**$\hat{F}(t \mid x)$ Conditional CDF (Failure Function)**

$$x \longmapsto \hat{F}(t \mid x) = \hat{P}(T^* \le t \mid x)$$

> Fine-Gray Subdistribution Model (Competing Risks),
> [DeepHit](https://github.com/chl8856/DeepHit), Neural Multi-Task Logistic
> Regression ([N-MTLR](https://arxiv.org/abs/1801.05512))

**$\hat{h}(t \mid x)$, Hazard**

$$x \longmapsto \hat{h}(t \mid x) = \lim_{\Delta t \to 0} \frac{\hat{P}(t \le T^* < t + \Delta t \mid T^* \ge t, X = x)}{\Delta t}$$

> [Cox PH](#cox-proportional-hazard), Aalen's Additive Model, DeepSurv.

**Honorable Mentions**

- Quantile function $x \longmapsto Q(\tau \mid x)$: Censored Quantile Regression
  (Portnoy, Peng-Huang).
- Latent time expectation $x \longmapsto  {E}[\ln T^* \mid x]$: Buckley-James
  Least Squares.

### Cox Proportional Hazard

Assumes covariates $X$ shift the baseline hazard **multiplicatively**:

> The existence of $X$ adjusts a baseline hazard rate $h_0(t)$ at $t$.

$$h(t \mid X) = h_0(t) \cdot \exp(\beta^\top X)$$

_Coefficient / Estimand:_ $\exp(\beta_k)$ is the **Hazard Ratio (HR)**. An HR of
$1.5$ means a one-unit increase in $X_k$ increases the instantaneous risk by 50%
at any point in time.

**What does an _"unspecified"_ baseline hazard $h_0(t)$ mean?**

"Unspecified" means you make **no assumption about the probability
distribution** of how the baseline risk changes over time.

**Partial Likelihood: Estimate $\beta$ Without Specifying $h_0(t)$**

Unspecified unknowns prevent you from using standard MLE (maximum likelihood
function estimation). David Cox solved this by constructing the **partial
likelihood**. Long story short, the baseline hazard $h_0(t)$ cancels out, so you
can maximize this partial likelihood to estimate $\beta$ without considering
$h_0(t)$.

**Trade-Offs**

- **Advantage:** You avoid the risk of misspecifying the baseline distribution.
- **Limitation:** Because $h_0(t)$ is bypassed, <span class="orange">the Cox
  model only tells you **relative comparisons** between groups</span> (e.g.,
  "Treatment B reduces risk by 40% compared to Treatment A"). It cannot reveal
  the **survival journey** that an individual.

### Accelerated Failure Time (AFT)

Assumes covariates act directly on the **time** of the latent event time $T^*$
rather than on the hazard rate:

> Instead of multiplying risk at a fixed time $t$, covariates speed up or slow
> down the passage of a subject's internal "event clock."

$$\log T^* = \beta^\top X + \sigma \epsilon$$

where $\sigma > 0$ is a scale parameter and $\epsilon$ is a random error term
following a specified probability distribution (such as standard normal,
logistic, or extreme-value).

Exponentiating both sides expresses $T^*$ multiplicatively relative to a
baseline latent time $T_0^* = \exp(\sigma \epsilon)$:

$$T^* = \exp(\beta^\top X) \cdot T_0^*$$

**How AFT is related to Survival Function $\hat{S}(t \mid X)$**

Because $T^* = \exp(\beta^\top X) T_0^*$, surviving past time $t$ with
covariates $X$ is equivalent to the baseline subject surviving past rescaled
time $t \cdot \exp(-\beta^\top X)$:

$$S(t \mid X) = {P}(T^* > t \mid X) = S_0\big(t \cdot \exp(-\beta^\top X)\big)$$

**Coefficient / Estimand: Time Ratio & Acceleration Factor**

- **Time Ratio ($\text{TR} = \exp(\beta_k)$):** Measures how a one-unit increase
  in $X_k$ scales expected survival duration.
  - A $\text{TR}$ of $2.0$ ($\beta_k > 0$) means exposure to that covariate
    **doubles** expected survival time (stretching the survival curve
    horizontally).
- **Acceleration Factor ($\text{AF} = \exp(-\beta_k)$):** Measures how fast a
  subject moves along the baseline survival curve $S_0(\cdot)$.
  - An $\text{AF}$ of $2.0$ ($\beta_k < 0$) means the subject's event clock runs
    **twice as fast**, **halving** expected survival time.

**Parametric Estimation via Full Likelihood**

Unlike Cox PH, AFT is a **parametric** model: choosing a distribution for
$\epsilon$ specifies a concrete parametric family for $T^*$ (and thus for
$S_0(t)$ and $f(t \mid X)$):

- **Weibull AFT:** $\epsilon$ follows a standard extreme-value distribution (the
  unique family that simultaneously satisfies both AFT and Proportional Hazards
  assumptions).
- **Log-Normal AFT:** $\epsilon \sim \mathcal{N}(0, 1)$, so $T^*$ follows a
  Log-Normal distribution.
- **Log-Logistic AFT:** $\epsilon$ follows a standard logistic distribution,
  allowing non-monotonic (hump-shaped) hazard rates that rise and then fall.

With a specified density $f(t \mid X)$ and survival function $S(t \mid X)$,
parameters $(\beta, \sigma)$ are estimated directly by maximizing the full
likelihood.

**Trade-Offs**

- **Limitation:** Requires specifying a parametric error distribution for
  $\epsilon$; if the chosen distribution does not match the true data-generating
  process, parameter estimates and extrapolated tail predictions can be biased.
- **Advantage:** Directly models event duration $T^*$ and produces
  <span class="orange">**full, individual survival curves** $\hat{S}(t \mid X)$
  and time-to-event predictions</span> without needing a separate baseline
  estimator.
