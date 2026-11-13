+++
date = '2026-11-13T23:25:39+08:00'
draft = false
title = 'Maximum Likelihood Estimation'
description = 'Working backward from observed data to find the parameters that most likely produced that data.'
tags = ['Analytics']
translationKey = 'maximum-likelihood-estimation'
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

# Maximum Likelihood Estimation

**Maximum Likelihood Estimation (MLE)** is a technique for
<span class="orange">**working backward from observed data to find the
parameters that most likely produced that data**</span>.

> _"I already have the data—what system settings make this specific data
> <span class="green">**least surprising**</span>?"_

**The Mystery Coin Analogy**

Imagine a friend hands you an unfamiliar coin, and you suspect it might be
weighted.

You flip it 10 times and record the results: **7 heads** and **3 tails**.

You want to estimate $p$, the true probability of this coin landing on heads on
any given throw. You test a few candidates:

- **Candidate A ($p = 0.1$):** If the coin has only a 10% chance of landing on
  heads, getting 7 / 10 heads is rare. This explanation is unlikely.
- **Candidate B ($p = 0.5$):** If the coin is balanced, getting 7 heads can
  happen, but getting 5 heads is much more typical.
- **Candidate C ($p = 0.7$):** If the coin has a 70% chance of landing heads,
  getting 7 heads out of 10 flips is the most probable outcome.

Because $p = 0.7$ gives the highest probability to the reality you saw, MLE
tells you **0.7** as the estimate.

## Likelihood

While people use these two words interchangeably in everyday speech, statistics
treats them as opposites:

**Probability** looks forward: The system setting is fixed, what the data can
be.

> _"Assuming the coin is fair ($p = 0.5$), what is the probability of getting 7
> heads?"_

**Likelihood** looks backward: The data is fixed, and the system setting can be.

> _"I got 7 heads, what is the likelihood that the true parameter is $p = 0.5$
> versus $p = 0.7$?"_

### Meaningful in Comparison

> Notice the Phrasing "Likelihood of A versus B"

<span class="orange">**Likelihood is meaningful only in comparison**</span>. A
standalone likelihood number has no intrinsic interpretation on its own.

If you flip a coin 100 times and observe 60 heads, the likelihood of a fair coin
($p = 0.5$) is approximately:

$$0.0108$$

Is $0.0108$ "good" or "bad"?

> This is drastically different from probability which is bounded in $[0,1]$
> with direction, $0$ means impossible and $1$ means deterministic. Higher
> proba. meas more likely to occur in repeated trials.

By itself, you cannot tell. If you flip that coin 1,000 times, the likelihood of
_any_ $p$ setting drops to something like $0.000000000000000003$.

That number only gains meaning when you evaluate another setting:

- Setting A ($p = 0.5$) yields $0.000000000000000003$
- Setting B ($p = 0.6$) yields $0.000000000000000030$

Now you have useful information: Setting B explains the data **10 times better**
than Setting A.

### A Salt Solution Analogy

> [Q] This "likelihood being meaningful only in comparison" idea feels like
> adding water to two salt solutions: continuously adding water lowers the
> measured density of both samples, but that dilution does not alter their
> relative standing—the sample with more salt still contains more salt.

**Critic**

Your salt solution analogy captures the intuition behind likelihood scaling,
though with one important mathematical twist: as you add more data, the
comparative difference widens.

> If still using the salt solution analogy, adding water magically makes the
> solution with more salt having even more salt, and the solution with less salt
> having even less salt. The comparative difference between them is widen.

**What Dictates the Scale of the Likelihood Score?**

> Probability multipliers on each evidence (observation)

Likelihood is calculated by **multiplying individual probabilities together**,
several factors drive the raw number down:

> Likelihood is an aggregation of "evidence", quantified as probability
> multiplication. By pure arithmetic, the more "evidence" you "mixed-in", the
> smaller number you get as the likelihood score.

- **Sample Size ($N$):** Each new observation introduces another multiplier less
  than 1. As $N$ grows, the product shrinks exponentially toward zero.

- **Dimensionality (Number of Features):** Evaluating data with 50 attributes
  per row multiplies 50 probability terms per individual observation, causing
  the scale to drop much faster than analyzing a single feature.

- **Process Noise (Variance):** If an outcome is highly predictable, probability
  concentrates heavily on a few values (larger multipliers). If a system has
  high randomness, probability spreads thinly across many possibilities,
  yielding smaller multipliers per trial.

**The Comparative Difference Widens**

> The Matthew effect: evidence effect "compounds"

In a physical salt solution, if Sample A has 10g of salt and Sample B has 5g,
adding 10,000 liters of water reduces both densities toward zero, while the
ratio of salt remains fixed at $2:1$.

In likelihood, however, each new evidence widen the relative advantage of the
better setting:

**Trial 1:**

- Setting A probability: $0.6$
- Setting B probability: $0.5$
- Ratio ($A / B$): $1.2$ (Setting A is 20% better)

**Trial 10:**

- Setting A likelihood: $0.6^{10} \approx 0.0060$
- Setting B likelihood: $0.5^{10} \approx 0.00098$
- Ratio ($A / B$): $(1.2)^{10} \approx 6.19$ (Setting A is 6 times better)

**Trial 100:**

- Setting A likelihood: $\approx 6.5 \times 10^{-23}$
- Setting B likelihood: $\approx 7.9 \times 10^{-31}$
- Ratio ($A / B$): $(1.2)^{100} \approx 82,817,974$

While both raw likelihood scores plunge toward zero, the better explanation
pulls away exponentially. This is why having more data makes statistical tests
decisive: even small per-trial advantages compound into massive likelihood
ratios.

### Log Evidence Accumulation: $\ln(L)$

As you may guess, raw likelihood score of a moderate sized dataset can diminish
fast close to 0, causing computers to underflow (round to zero).

Taking the natural logarithm converts product into linear addition, making
computation possible:

$$L = \prod_{i}{p_i}$$

taking logarithm:

$$\ln(L) = \ln(\prod_{i}{p_i}) = \sum_{i}{\ln{p_i}}$$

Now, instead of comparing likelihood score $L_A = 10^{-23}$ against
$L_B = 10^{-31}$, you compare <span class="orange">**"log evidence
accumulation"**</span> $\ln(L_A) =-51.1$ and $\ln(L_B) = -69.3$.

One more perk besides make computation easier, the difference between log
likelihood gets a better quantitative interpretation:

$$\ln(L_A) - \ln(L_B ) = \ln{\frac{L_A}{L_B}} = 18.2$$

representing the comparative edge between two
<span class="orange">**log-evidence accumulated $\ln(L)$**</span>: data favors
$A$ 18.2 times more $B$ on _logarithmic-unit scale_

> 18.2 in logarithmic scale
>
> $$e^{18.2} \approx 79,996,000$$
>
> The data favors model $A$ ~80 million times more than model $B$ on the raw
> probability scale.

> Term _"log evidence accumulation"_ is conceptually aligned with how
> information theory and Alan Turing framed it: each independent observation
> adds a fixed number of nats or bans to the ledger until one explanation wins.

## MLE Process

Imagine in a $n$-dim space, where $n$ is the number of parameters we can change
for a distribution assumption.

For every possible parameter values $\theta$, we can find a evidence support
based on a dataset $\mathbf{x}$ - likelihood score $L(\theta \mid \mathbf{x})$
or log evidence $\ln(L(\theta \mid \mathbf{x}))$.

The mission is to find that special parameter values $\hat{\theta}_{MLE}$, that
gives max evidence support:

$$
\hat{\theta}_{\text{MLE}} = \arg \max L(\theta \mid \mathbf{x}) = \arg \max \ln(L(\theta \mid \mathbf{x}))
$$

At this summit, the slope equals zero, meaning moving in either direction makes
the observed data less plausible. This peak is your Maximum Likelihood
Estimator.

> Do not forget $\hat{\theta}_{\text{MLE}}$ depends on a sample $\mathbf{x}$,
> that is why it has a hat. $\hat{\theta}_{\text{MLE}}$ is not the
> hypothetically true parameter $\theta$, but your best guess of it using
> $\mathbf{x}$.

### Step 1. Construct the Likelihood Function

> Likelihood = Join PDF

The general form of the likelihood function for a dataset
$\mathbf{x} = (x_1, x_2, \dots, x_n)$ and an unknown parameter (or vector of
parameters) $\theta$ is:

$$L(\theta \mid \mathbf{x}) = f(\mathbf{x} \mid \theta)$$

- $f(\mathbf{x} \mid \theta)$ - the probability returned by the PDF of a
  distribution assumed with parameter $\theta$ and dataset $\mathbf{x}$

> Important: $f(\mathbf{x} \mid \theta)$ means the **probability of the _whole
> dataset_**.
>
> The official term is called <span class="orange">**Joint Probability Density
> Function** (or **Joint PDF** / **Joint Distribution**)</span>. "Joint" in the
> sense that a dataset is a "joint" phenomena made of individual observations.

> Notice the symbolic difference: <span class="green">"$x$", an
> observation</span> vs <span class="blue">"$\mathbf{x}$", a collection of
> observations</span>
>
> Do not confuse this with the appearance _"Likelihood = PDF"_

**Joint PDF**

How do you build an $n$-dimensional joint PDF? You rely on the **i.i.d.
assumption** (Independent and Identically Distributed):

- **Identically Distributed:** Every point $x_i$ is drawn from the same
  underlying distribution rule $f(x_i \mid \theta)$.
- **Independent:** One observation does not affect any other observation.

In probability theory, the **Multiplication Rule for Independent Events** states
that the joint probability of independent outcomes is the product of their
individual probabilities:

$$P(A \cap B) = P(A) \times P(B)$$

Extending this to probability densities across an entire dataset yields:

$$f(\mathbf{x} \mid \theta) = f(x_1 \mid \theta) \times f(x_2 \mid \theta) \times \dots \times f(x_n \mid \theta) = \prod_{i=1}^{n} f(x_i \mid \theta)$$

### Step 2. The Log-Likelihood Form $\ell$

Because products of small numbers are computationally unstable, the likelihood
function is almost always written in its equivalent logarithmic form ($\ell$):

$$\ell(\theta) = \ln L(\theta \mid \mathbf{x}) = \sum_{i=1}^{n} \ln f(x_i \mid \theta)$$

### Step 3. Search for the Peak

Depending on whether the mathematical formula can be solved directly on paper,
this peak is found through either **analytical calculus** or **numerical
optimization**.

#### The Analytical Solution

When the likelihood equation is clean, you can solve for the peak using basic
calculus principles.

**1. Calculate the Slope (The Score Function):** Take the first derivative of
the log-likelihood $\ell$ with respect to the parameter $\theta$. In statistics,
this derivative has a formal name: the **Score Function**, denoted $S(\theta)$:

$$S(\theta) = \frac{d}{d\theta} \ell(\theta)$$

If $\theta$ contains multiple parameters (e.g., mean $\mu$ and variance
$\sigma^2$ in a bell curve), the score is a vector of partial derivatives called
the **gradient** ($\nabla \ell(\theta)$), pointing in the direction of steepest
ascent.

**2. Solve when setting slope to 0:**

> Find all the positions with a 0 slop.

$$S(\theta) = 0 \quad \text{or} \quad \nabla \ell(\theta) = \mathbf{0}$$

Solving this equation isolates $\theta$ algebraically, producing the formula for
$\hat{\theta}_{\text{MLE}}$.

**3. Verify It Is a Maximum (The Curvature Test):** A slope of zero can occur at
a peak (maximum), a valley (minimum), or a plateau (saddle point). To confirm it
is a peak, check the second derivative:

$$\frac{d^2}{d\theta^2} \ell(\theta) < 0$$

A negative second derivative means the curve is concave downward (like an
upside-down bowl), guaranteeing the point is a local peak.

**A Concrete Example: Solving the Mystery Coin**

For $k$ heads out of $n$ coin flips with unknown probability $p$.

The likelihood function (joint pdf):

$$
L(p) = kp \cdot (n-k)(1-p)
$$

The log-likelihood:

$$\ell(p) = k \ln(p) + (n - k) \ln(1 - p)$$

Take the derivative with respect to $p$:

$$\frac{d}{dp} \ell(p) = \frac{k}{p} - \frac{n - k}{1 - p}$$

Solve for the derivative to zero:

$$\frac{k}{p} - \frac{n - k}{1 - p} = 0 \implies \frac{k}{p} = \frac{n - k}{1 - p}$$

simplify:

$$
\begin{aligned}
k(1 - p) = p(n - k) \\[1em]
k - kp = np - kp \\[1em]
k = np \implies \hat{p}_{\text{MLE}} = \frac{k}{n}
\end{aligned}
$$

The calculus confirms common sense: the most likely parameter is simply the
sample proportion. For 7 heads in 10 flips, $\hat{p} = \frac{7}{10} = 0.7$.

> Notice in this simple case you do not even need data to deduct a guessing
> rule.

#### The Numerical Solution

In many real-world problems, solving for setting the derivative to zero produces
an complex equation where $\theta$ cannot be isolated analytically.

In those cases, software uses iterative search algorithms to climb the
likelihood surface:

**1. Gradient Ascent:** Starts at an arbitrary initial guess $\theta_0$.

1. Calculates the slope/gradient $\nabla\ell(\theta)$ at that point.
2. Takes a step uphill in the direction of positive slope:

$$\theta_{\text{new}} = \theta_{\text{old}} + \alpha \cdot \nabla\ell(\theta)$$

> This term $\nabla\ell(\theta)$ is where data matters, see
> [where data comes in play](#where-actual-data-comes-in).

where $\alpha$ is the learning rate or step size. Repeats until the slope
becomes negligible ($S(\theta) \approx 0$).

**2. Newton-Raphson Method:** Uses both the slope (first derivative) and the
curvature (second derivative) to estimate how far away the peak is. Takes
larger, curved jumps directly toward the summit, converging faster than gradient
ascent on smooth surfaces.

**3. Fisher Scoring:** A variation of Newton-Raphson tailored specifically for
statistics that replaces the observed curvature with the expected curvature
across all potential samples.

#### The Hessian Matrix, MLE Certainty

> Remember, MLE is still sample-produced estimator, it has "error", some comes
> from innate randomness of the system, some comes from the self-contradiction
> of the sample.

In higher dimensions, the collection of all second derivatives forms a matrix
called the **Hessian matrix** ($H$).

The Hessian measures how sharply the likelihood landscape bends around the peak:

- **A Steep, Sharp Peak:** If the curve drops off sharply around
  $\hat{\theta}_{\text{MLE}}$, moving even slightly away from the peak severely
  degrades how well the model explains the data. This indicates _high certainty_
  and low standard error.

- **A Broad, Flat Peak:** If the summit is wide and flat, several different
  values of $\theta$ yield nearly identical log-likelihood scores. This
  indicates _high uncertainty_, often caused by noisy data.

## Where data comes in play

You have your current parameter guess $\theta_0$ and your dataset
$\mathbf{x} = (x_1, x_2, \dots, x_n)$.

Data matters when calculating the log-likelihood gradient $\nabla \ell$.

> The likelihood score is the joint probability density over the whole dataset.
>
> $$L(\theta \mid \mathbf{x}) = f(\mathbf{x} \mid \theta) $$
>
> its derivative hence is the derivative to the joint pdf.
>
> $$\nabla L(\theta | \mathbf{x}) = \nabla  f(\mathbf{x} \mid \theta)$$
>
> Expressed in logarithmic format:

$$\nabla \ell(\theta) = \nabla \ln f(\mathbf{x} \mid \theta) = \sum_{i=1}^{n} \nabla \ln f(x_i \mid \theta)$$

On each new candidate $\theta_i$, we compute a gradient $\nabla \ell (\theta_i)$
using the dataset.

We then use the gradient $\nabla \ell (\theta_i)$ to derive a new guess
$\theta_j$ using a updating rule, something like:

$$\theta_{j} = \theta_{i} + \alpha \cdot \nabla\ell(\theta_i)$$

And <span class="orange">**a chain reaction**</span> is formed:

1. with a guess: $\theta_i$
2. compute gradient using data:
   $\nabla\ell(\theta_i) = \nabla \ln f(\mathbf{x} \mid \theta_i)$
3. apply updating rule to get a new $\theta_j$
4. Evaluate $\nabla\ell(\theta_j) = \nabla \ln f(\mathbf{x} \mid \theta_j)$:
   - if $\nabla\ell(\theta_j) \approx 0$, and we can verify it is a maximum, we
     get $\hat{\theta}_\text{MLE} = \theta_j$
   - Otherwise, go back to (1) with $\theta_j$ and re-run the procedure

### Ideal vs. Implementation

**The Ideal:**

- The dataset $\mathbf{x}$ is treated as a single entity with a joint PDF
  $f(\mathbf{x} \mid \theta)$.
- The log-likelihood $\ell(\theta) = \ln f(\mathbf{x} \mid \theta)$ defines one
  static multi-dimensional landscape.
- Optimization has a clear goal: compute the unified slope $\nabla \ell(\theta)$
  and walk uphill until it equals zero.

**The Reality:**

- **Analytic / Closed-Form:** Simpler joint PDF form can analytically solve
  $\theta$ that gets $\nabla \ell(\theta) = 0$ , bypassing optimization
  entirely.
- **Full-Batch Gradient Ascent:** For models without a closed form, solve
  $\theta$ for $\nabla \ell(\theta) = 0$ analytically is impossible. We
  iteratively update guess $\theta$. <span class="orange">**Every updating
  requires touching all $n$ data points _in one go_**</span>, which becomes
  impractical as $n$ exceeds memory capacity.
- **Stochastic Approximation (SGD / Mini-Batch):** When whole-dataset passes
  become a hardware bottleneck, algorithms sacrifice the exact landscape slope,
  estimating the ascent direction using random subsets of data at each update
  step.
