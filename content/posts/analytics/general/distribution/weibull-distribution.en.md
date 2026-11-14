+++
date = '2026-11-14T00:00:00+08:00'
draft = true
title = 'Weibull Distribution'
description = 'The history, weakest-link motivation, applications, and practical engineering properties of the Weibull distribution.'
tags = ['Analytics', 'Distribution']
translationKey = 'weibull-distribution'
math = true
+++

## Distribution Profile

**Parameters:**

- Shape parameter: $k \in (0, \infty)$
- Scale parameter: $\lambda \in (0, \infty)$

**Support:**

- $x \in [0, \infty)$ (or $x \ge 0$, with $F(x) = 0$ for $x < 0$)

**Probability Density Function (PDF):**

$$f(x; k, \lambda) = \begin{cases} \frac{k}{\lambda} \left(\frac{x}{\lambda}\right)^{k-1} e^{-(x/\lambda)^k}, & x \ge 0 \\ 0, & x < 0 \end{cases}$$

**Cumulative Distribution Function (CDF):**

$$F(x; k, \lambda) = \begin{cases} 1 - e^{-(x/\lambda)^k}, & x \ge 0 \\ 0, & x < 0 \end{cases}$$

**First Moment (Expected Value / Mean):**

$$E[X] = \lambda \, \Gamma\left(1 + \frac{1}{k}\right)$$

**Second Moments:**

- **Raw Second Moment ($E[X^2]$):**

$$E[X^2] = \lambda^2 \, \Gamma\left(1 + \frac{2}{k}\right)$$

- **Central Second Moment (Variance, $\operatorname{Var}(X)$):**

$$\operatorname{Var}(X) = E[X^2] - (E[X])^2 = \lambda^2 \left[ \Gamma\left(1 + \frac{2}{k}\right) - \left(\Gamma\left(1 + \frac{1}{k}\right)\right)^2 \right]$$

> $\Gamma(z)$ denotes the Gamma function

**Fixed scale $\lambda = 1$, varying shape $k \in \{0.5, 1, 1.5, 5\}$:**

<figure style="display: flex; align-items: flex-start; gap: 2%; width: 100%; max-width: 1000px; margin: 0;">
<img src="/img/analytics/weibull-aft/weibull-varying-shape-cdf.png" alt="Weibull CDFs with scale fixed at 1 and varying shape" style="width: 49%; height: auto;" />
<img src="/img/analytics/weibull-aft/weibull-varying-shape-pdf.png" alt="Weibull PDFs with scale fixed at 1 and varying shape" style="width: 49%; height: auto;" />
</figure>

**Fixed shape $k = 1$, varying scale $\lambda \in \{0.5, 1, 1.5, 5\}$:**

<figure style="display: flex; align-items: flex-start; gap: 2%; width: 100%; max-width: 1000px; margin: 0;">
<img src="/img/analytics/weibull-aft/weibull-varying-scale-cdf.png" alt="Weibull CDFs with shape fixed at 1 and varying scale" style="width: 49%; height: auto;" />
<img src="/img/analytics/weibull-aft/weibull-varying-scale-pdf.png" alt="Weibull PDFs with shape fixed at 1 and varying scale" style="width: 49%; height: auto;" />
</figure>

## The ASME Rejection and the "7 Beans" Paper

The Weibull distribution is named after Swedish engineer, scientist, and naval
officer Ernst Hjalmar Waloddi Weibull (1887–1979). While components of the
distribution had appeared earlier—mathematician Maurice Fréchet explored related
extreme value limits in 1927, and German engineers Paul Rosin and Erich Rammler
used it in 1933 to describe the particle size of ground coal—Weibull recognized
its universal mathematical properties in 1939.

When Weibull submitted his landmark paper, _"A Statistical Distribution Function
of Wide Applicability,"_ to the American Society of Mechanical Engineers (ASME)
in 1951, the reviewers initially rejected it with skepticism.

**The Critique:** Reviewers argued that the formula was an empirical
curve-fitting trick that lacked physical foundation, claiming that no single
mathematical function could be "of wide applicability."

**The Demonstration:** To prove the reviewers wrong, Weibull fitted the exact
same two-parameter equation across radically disparate physical phenomena in
that single paper, including:

- The yield strength of Bofors steel
- The size distribution of fly ash particles
- The fiber strength of Indian cotton
- The fatigue life of St 37 steel specimens
- The stature of 1,216 adult British males
- The length of 999 broad beans (_Phaseolus vulgaris_)

Faced with this empirical demonstration across metallurgy, botany, and
anthropometry, ASME accepted the paper, and the distribution quickly became
standard engineering practice.

## The Underlying Physical Principle: The Weakest Link

The theoretical motivation for the Weibull distribution comes from **Extreme
Value Theory** and the **"weakest link" principle**.

> **EVT and CLT**
>
> Statisticians study behavior as sample size $n \to \infty$
> (["asymptotic theory"](<https://en.wikipedia.org/wiki/Asymptotic_theory_(statistics)>)).
> Within that framework, EVT and the CLT represent two sides of asymptotic
> limiting distributions:
>
> **The Central Limit Theorem (The Center / Average):** Examines the sample mean
> (the "focal portion" / the "bulk" of probability mass) of independent and
> identically distributed (i.i.d.) random variables**.**
>
> **Extreme Value Theory (The Boundary / Tails):** Examines the extrema
> ("marginal portion" / the "tail" of probability mass) of i.i.d. random
> variables**.**

**The Chain Analogy:** If a chain consists of $n$ individual links, the chain
fails the moment its weakest link breaks. The total lifetime or failure strength
of the system is the minimum of $n$ independent components:

$$T_{\text{system}} = \min(X_1, X_2, \dots, X_n)$$

**The Limiting Theorem (Fisher–Tippett–Gnedenko):** Just as the Central Limit
Theorem dictates that the _sum_ or _average_ of independent random variables
converges to a Normal distribution, Extreme Value Theory dictates that the
_minimum_ of independent non-negative random variables bounded below converges
to a Weibull distribution as $n$ grows large.

## Real-World Processes Modeled by Weibull

**The Three Stages of the Engineering "Bathtub Curve":**

- _Infant mortality / Burn-in ($k < 1$):_ Captures manufacturing defects in
  newly deployed semiconductor chips or immediate surgical complications, where
  failure rates decline as defective units are weeded out.
- _Random stress ($k = 1$):_ Reduces to the memoryless Exponential distribution,
  capturing failures caused by unpredictable external shocks rather than aging
  (e.g., electronic circuit boards damaged by voltage spikes or lightning).
- _Mechanical wear-out ($k > 1$):_ Models cumulative material fatigue, such as
  ball bearings pitting, light bulb filaments evaporating, or gear teeth
  eroding.

**Wind Speed and Renewable Energy:** The Weibull distribution is the worldwide
industry standard for modeling local wind speed frequencies at wind turbine hub
heights.

**Comminution (Crushing and Grinding):** Known in chemical engineering and
mineral processing as the **Rosin-Rammler distribution**, it predicts particle
size distributions when solid rocks, ores, or cement clinkers are pulverized in
industrial ball mills.

**Hydrology and Extreme Meteorology:** Used to model maximum annual rainfall
amounts, flood crest recurrence intervals, and earthquake inter-arrival times.

## Practical Engineering Quirks

**The 63.2% Rule (Characteristic Life):** Regardless **of what value** the shape
parameter $k$ takes, when time reaches the scale parameter ($t = \lambda$), the
cumulative failure probability is always identical:

$$F(\lambda) = 1 - e^{-(\lambda / \lambda)^k} = 1 - e^{-1} \approx 0.63212$$

In reliability engineering, $\lambda$ is called the **characteristic life**.
Exactly $63.2\%$ of units fail by $t = \lambda$, providing an intuitive
benchmark that does not require **calculating** the mean.

**Efficacy in Small-Sample Testing:** In aerospace and automotive manufacturing,
running 200 prototype jet engine turbines or rocket nozzles to failure is
cost-prohibitive. The Weibull distribution provides stable, usable parameter
estimates with sample sizes as small as 5 to 15 failure events, making it the
standard choice for destructive testing protocols.
