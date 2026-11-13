+++
date = '2026-11-13T18:10:37+08:00'
draft = false
title = "Lifetime Phase Characterization"
description = "Use hazard trajectories to understand customer risk windows, renewal cliffs, and the lead time needed for lifecycle actions."
tags = ['Analytics']
translationKey = 'hazard-trajectories-lifecycle-planning'
math = true
seriesID = 'analyze-time-to-event'
seriesTitle = 'Analyze Time-to-Event'
seriesRole = 'section'
seriesChapter = 2
seriesSection = 2
seriesOrder = 202
+++

Business question: **When do subscribers enter higher-risk stages, and how far
in advance should the team prepare?**

This installment takes the structural view, partitioning the customer lifecycle
into risk windows that inform the timing of those actions.

## Analysis Output

We want to estimate the hazard trajectory $\hat{h}(t)$, defined as the
instantaneous failure rate at tenure $t$ given survival up to $t$:

$$h(t) = \lim_{\Delta t \to 0} \frac{P(t \le T < t + \Delta t \mid T \ge t)}{\Delta t}$$

**Making sense of "hazard"**

By definition, hazard means the probability of encountering an event in _the
next immediate future moment_.

Let's contextualize it a bit to make understanding easier. Let's say A has
$h_A = 0.4$ and B has $h_B = 2.4$ (yes, hazard can be greater than 1; it is not
a probability).

Assume the time unit is measured in months in our study. For the next day
($\Delta t = 0.033$ months):

> Average days in a month = $\frac{365}{12} \approx 30.417$ days, so 1 day is
> $\frac{1}{30.417} \approx 0.033$ months

- A has a probability of $h_A \times \Delta t = 0.013$ of encountering an event
- B has a probability of $h_B \times \Delta t = 0.079$ of encountering an event

B is **_$6.1$x more likely_** to encounter an event.

What if we want to know the chance of an event for the next _2 weeks_
($\Delta t = 0.033 \times 14 = 0.462$)? Something awkward happens:

- B has a probability of $h_B \times \Delta t = 1.11$ of encountering an event.

How can one have a probability greater than $1$? B could very well not encounter
an event in the next 2 weeks, so it's not a sure thing; and a probability
greater than 1 (more certain than certainty) also does not make sense.

This is why we highlight the part: **"the next immediate future moment"**. This
probability interpretation only makes sense if you use a small enough projection
time horizon. Then how do we\*interpret that $1.11$?

Notice the dimension of $h(t)$: $\text{time}^{-1}$, the signature of a
"frequency (count per unit time)" measure. So we can understand $h$ from this
perspective: reading $h(t)$ as a "rate" or a "frequency"—"experiencing how many
events per unit time".

Then B's $1.11$ can be read as "B is expected to experience 1.11 events in the
next 2 weeks". In contrast, "A is expected to experience $0.18$ events in the
next 2 weeks".

Even though we change our perspective, the central idea does not change: B is
still **_$6.1$x more susceptible_** to the event than A.

> **The "Video Game Respawn" Framing**
>
> For a terminal event like "death", saying one can experience $2.4$ deaths
> is... weird. We can use the video game respawn framing.
>
> Imagine two players playing an arcade game where their hero respawns
> immediately every time they 'die'.
>
> - Player A having a hazard of $0.5$ per 10 minutes means A is either
>   navigating an easy level or has better gaming skills.
> - In contrast, Player B having a hazard of $9.5$ per 10 minutes means B has
>   just entered a super difficult level or simply sucks at the game.
>
> Nonetheless, the hazard numbers $0.5$ and $9.5$ give you an idea of each
> player's susceptibility to failing the game.

## Business Considerations

When we parameterized the hazard with a tenure time-$h(t)$, we have **a
description about the "susceptibility to event" at different stage of a
subscriber's lifetime**.

**Partitioning Stages**

From $\hat{h}(t)$, we identify critical risk cliffs (cut-off points) via local
maxima:

$$
\mathcal{T}_{\text{spike}} = \left\{ t_m^* \in \mathbb{R}_{>0} \mid \; h^{'}(t^*_m) = 0  \quad \text{and} \quad h^{''}(t^*_m)  < 0 \right\}
$$

> What the above express tells is essentially the definition of local maxima:
>
> - 1st level derivative $h^{'}(t^*_m) = 0$, locate a maxima or a minima
> - 2nd level derivative $h^{''}(t^*_m) < 0$, ensure a maxima

Each $t_m^*$ marks a critical risk cliff in the customer journey—a local peak
where instantaneous churn reaches its highest.

**Early-Warning Trigger Horizon**

Proactive intervention requires an operational lead time $k_m > 0$ such that
actions occur before churn intent becomes irreversible.

For each spike $t_m^*$, the intervention window opens at:

$$\tau_m = t_m^* - k_m$$

**Lifetime Partition**

The continuous tenure timeline $\mathbb{R}_{\ge 0}$ is partitioned into $M+1$
mutually exclusive, exhaustive operational regimes
$\mathcal{S}_0, \mathcal{S}_1, \dots, \mathcal{S}_M$:

- $\mathcal{S}_1 = [0, t_1^*]$: Onboarding & Adoption Regime
- $\mathcal{S}_2 = [t_2^* - k_2, t_2^*]$: Pre-Renewal Risk Regime
- ...

**Typical Hazard Trajectory in a Subscription-based Business**

> See [interactive hazard trajectory](/html/Continuous-Hazard-Trajectory.html)

In a subscription business, an empirical hazard trajectory $h(t)$ combines two
concurrent forces:

- a **declining baseline risk** caused by cohort maturation
- punctuated by **sharp periodic spikes** caused by periodic billing triggers

A typical curve across the first year exhibits five distinct stages:

<figure style="text-align: center;">
<img src="/img/analytics/hazard-trajectory.png" alt="Hazard trajectory over the first year" />
</figure>

**1. The Onboarding Friction Window ($t = 0 \text{ to } 14\text{ days}$)**

> Marks the end of **Trial & Activation Stage** Time-to-value, product setup,
> and feature adoption before the first commitment gate.

- Customers who fail to find initial value or experience friction during setup
  make a definitive "abandon or convert" choice.
- Curve starts moderately high, dips slightly as active onboarding begins, and
  shoots up into the first major spike at the trial expiration - the "abandon or
  convert" moment.

**2. The First Renewal Shock ($t = 30\text{ days}$)**

> Marks the end of **Early Retention / Fragile Stage**: Proving recurring
> utility and mitigating buyer's remorse before the first recurring charge.

- The first real payment charge. Buyers who experienced buyer's remorse or
  forgot they signed up face their first explicit invoice.
- Curve shows a sharp, narrow peak ($t_1^* \approx 30\text{ days}$),
  representing the highest single monthly churn spike in the customer
  relationship.

**3. The Dampening Cadence ($t = 60, 90, 120\text{ days}$)**

> Marks the **Habituation Stage**: Deepening workflow integration so the service
> becomes standard practice.

- With every billing cycle, the marginal propensity to churn shrinks because the
  remaining pool contains a progressively higher concentration of committed
  power users.
- Curve shows periodic spikes occur every 30 days, but each subsequent crest is
  lower than the previous one ($h(t_2^*) > h(t_3^*) > h(t_4^*)$).

**4. The Quiescent Inter-Cycle Valleys**

> Marks the **Mature Adoption Stage** Account expansion, team seat additions,
> and customer advocacy during low-hazard baseline months.

- Once a renewal charge clears, users rarely initiate active cancellations
  mid-cycle. Their instantaneous risk remains suppressed until the next billing
  trigger approaches.
- Between peaks (e.g., days 40–50 or days 70–80), the curve drops, approaching
  baseline ($h(t) \approx \text{near zero}$).

**5. The Annual Renewal Cliff ($t = 365\text{ days}$)**

> Marks the **Contract Renewal Stage** Demonstrating annual ROI, executive
> review prep, and commercial negotiation prior to the 365-day cliff.

- A major contract renewal milestone. Annual subscribers face budget reviews,
  procurement re-evaluations, and executive sign-offs.
- A standalone spike that towers well above the surrounding months
  ($t_{\text{annual}}^* \approx 365\text{ days}$).
