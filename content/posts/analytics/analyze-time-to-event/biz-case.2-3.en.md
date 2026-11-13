+++
date = '2026-11-13T18:10:37+08:00'
draft = false
title = "Retention Resources Allocation"
description = "Frame retention prioritization around near-term churn risk, value at stake, intervention effectiveness, and limited operational capacity."
tags = ['Analytics']
translationKey = 'allocating-retention-resources'
math = true
seriesID = 'analyze-time-to-event'
seriesTitle = 'Analyze Time-to-Event'
seriesRole = 'section'
seriesChapter = 2
seriesSection = 3
seriesOrder = 203
+++

Business Question: Given **limited intervention resources** over an upcoming
period, which users should be targeted for retention intervention?

## Analysis Output

We want to estimate the short-term churn probability of a subscriber over an
upcoming window $\Delta t$:

> $P_{\text{churn}}$ is a byproduct of modeling the
> {{< series-link "posts/analytics/analyze-time-to-event/data-math.1.en.md" "latent event time $T^*$" "#latent-event-time" >}}

$$P_{\text{churn}} = P[t \le T < t + \Delta t \mid T \ge t]$$

$P_{\text{churn}}$ comes from hazard rate estimation:

$$P_{\text{churn}} = h(t) \times \Delta t$$

where $h(t)$:

$$h(t) = \lim_{\Delta t \to 0} \frac{P(t \le T < t + \Delta t \mid T \ge t)}{\Delta t}$$

## Business Considerations

**Value-at-Risk**

Combine a subscriber's **churn probability** with the **revenue potential**, we
can formulate a risk metric: **_Value-at-Risk (VaR)_**.

The subscriber's revenue potential is represented by: **MRR** (Monthly recurring
revenue) (or **ARR**, Annually recurring revenue)

Therefore, the risk metric for subscriber $i$ is:

$$\text{VaR}_i = P^i_{\text{churn}} \times \text{MRR}_i$$

**Expected Revenue Saved**

Expected revenue saved is expressed as:

$$
\mathbb{E} \left[ \text{revenue saved} \right] = \text{VaR} \times  P_{\text{success}}
$$

where $P_{\text{success}}$ is the probability of successful intervention.

**Intervention Cost**

Intervention operation consume resources, represented as $C$.

## Decision Rule

Intervention is triggered if the **expected revenue saved** exceeds the
**operational cost of the intervention**.

Therefore this decision rule is:

$$
\text{Intervene: } \; \text{if } \;
\mathbb{E} \left[ \text{revenue saved} \right] = \text{VaR} \times
P_{\text{success}} > C
$$

We can screen for the list of customers to take intervention action by this
rule.
