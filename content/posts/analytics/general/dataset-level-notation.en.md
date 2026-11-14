+++
date = '2026-11-14T00:00:00+08:00'
draft = false
title = 'Dataset-Level Notation (matrix input)'
description = 'Express dataset-level responses, covariates, coefficients, and errors in matrix form, with compacted design-matrix notation and a numerical illustration.'
tags = ['Analytics']
translationKey = 'dataset-level-notation'
math = true
+++

## The Full Form

$$\mathbf{Y} = \mathbf{1}_n \mu + \mathbf{X} \boldsymbol{\beta} + \sigma \boldsymbol{\epsilon}$$

With $k$ covariates / features and $n$ instances.

- Response vector (per instance):

  $$\mathbf{Y} = \log(\mathbf{T}) = \begin{pmatrix} \log(T_1)  \\ \vdots \\ \log(T_n) \end{pmatrix} \in \mathbb{R}^{n \times 1}$$

- Baseline level vector (per instance):

  > we isolate $\mathbf{1}_n$ for later _compacted notation_

  $$\mathbf{1}_n \mu \in \mathbb{R}^{n \times 1}$$

$$\mathbf{1}_n = \begin{pmatrix} 1  \\ \vdots \\ 1 \end{pmatrix} \in \mathbb{R}^{n \times 1}  \quad \mu \in \mathbb{R}$$

- Predicator vector (per instance):

  $$\mathbf{X} \boldsymbol{\beta} \in \mathbb{R}^{n \times 1}$$
  - Covariate-only **Design Matrix**:

    $$\mathbf{X} = \begin{pmatrix} \mathbf{x}_1^T \\ \vdots \\ \mathbf{x}_n^T \end{pmatrix} = \begin{pmatrix} x_{11} & x_{12} & \dots & x_{1k} \\ x_{21} & x_{22} & \dots & x_{2k} \\ \vdots & \vdots & \ddots & \vdots \\ x_{n1} & x_{n2} & \dots & x_{nk} \end{pmatrix} \in \mathbb{R}^{n \times k}$$

  - Coefficient vector (per covariate)

    $$\boldsymbol{\beta} = \begin{pmatrix} \beta_1  \\ \vdots \\ \beta_k \end{pmatrix} \in \mathbb{R}^{k \times 1}$$

- $\sigma \boldsymbol{\epsilon} \in \mathbb{R}^{n \times 1}$: error per instance

$$\sigma \in \mathbb{R}^+ \quad \boldsymbol{\epsilon} = \begin{pmatrix} \epsilon_1  \\ \vdots \\ \epsilon_n \end{pmatrix} \in \mathbb{R}^{n \times 1}$$

## Compacted Matrix Product Notation

The **Design Matrix** ($\tilde{\mathbf{X}}$) is made of the **baseline-level
placeholder vector** ($\mathbf{1}_n$) and the **covariates-only matrix**
($\mathbf{X}$).

The **compacted coefficient vector** ($\tilde{\boldsymbol{\beta}}$) is made of a
**baseline-level scalar** ($\mu$) and the **covariate coefficient vector**
($\boldsymbol{\beta}$).

> Essentially, we treat the baseline as a new covariate with a measure of 1
> (denoting the existence) to all observations.

$$\tilde{\mathbf{X}} = [\mathbf{1}_n \quad \mathbf{X}] \in \mathbb{R}^{n \times (k+1)}, \quad \tilde{\boldsymbol{\beta}} = \begin{pmatrix} \mu \\ \boldsymbol{\beta} \end{pmatrix} \in \mathbb{R}^{(k+1) \times 1}$$

> In statistical notation, the tilde diacritic (音标/变音符) ($\tilde{\cdot}$,
> as in $\tilde{\mathbf{X}}$ or $\tilde{x}$) indicates a transformed version of
> a base object.

The system compacts to:

$$\mathbf{Y} = \tilde{\mathbf{X}} \tilde{\boldsymbol{\beta}} + \sigma \boldsymbol{\epsilon}$$

### Numerical Illustration

Consider a small sample of $n = 3$ observations with $k = 2$ covariates (e.g.,
$x_1 = \text{Age}$ in years, $x_2 = \text{Dose}$ in mg):

| Observation | Age ($x_1$, years) | Dose ($x_2$, mg) |
| ----------- | ------------------ | ---------------- |
| 1           | 50                 | 10               |
| 2           | 60                 | 20               |
| 3           | 45                 | 15               |

Let the baseline parameters be:

- Intercept: $\mu = 3$
- Regression coefficients: $\beta_1 = 0.05$, $\beta_2 = -0.02$

**Covariate-only Design Matrix ($\mathbf{X} \in \mathbb{R}^{3 \times 2}$):**

$$\mathbf{X} = \begin{pmatrix} 50 & 10 \\ 60 & 20 \\ 45 & 15 \end{pmatrix}$$

**Intercept term ($\mathbf{1}_3 \mu \in \mathbb{R}^{3 \times 1}$):**

$$\mathbf{1}_3 \mu  = \begin{pmatrix} 3 \\ 3 \\ 3 \end{pmatrix}$$

**Compacted Design Matrix
($\tilde{\mathbf{X}} \in \mathbf{R}^{3 \times (2+1)}$)**

$$\tilde{\mathbf{X}} = [\mathbf{1}_3 \quad \mathbf{X}] = \begin{pmatrix} 1 & 50 & 10 \\ 1 & 60 & 20 \\ 1 & 45 & 15 \end{pmatrix}$$

**Coefficient vector ($\boldsymbol{\beta} \in \mathbb{R}^{2 \times 1}$):**

$$\boldsymbol{\beta} = \begin{pmatrix} 0.05 \\ -0.02 \end{pmatrix}$$

**The Compacted Parameter Vector
($\tilde{\boldsymbol{\beta}}\in \mathbb{R}^{(2+1) \times 1}$):**

$$\tilde{\boldsymbol{\beta}} = \begin{pmatrix} \mu \\ \boldsymbol{\beta} \end{pmatrix} =\begin{pmatrix} \beta_0 \\ \beta_1 \\ \beta_2 \end{pmatrix} = \begin{pmatrix} 3.0 \\ 0.05 \\ -0.02 \end{pmatrix}$$

The result is the predicator per instance
($\tilde{\mathbf{X}} \tilde{\boldsymbol{\beta}} \in \mathbf{R}^{3 \times 1}$):

$$
\begin{aligned}
\tilde{\mathbf{X}} \tilde{\boldsymbol{\beta}}
&=  [\mathbf{1}_3 \quad \mathbf{X}] \begin{pmatrix} \mu \\ \boldsymbol{\beta} \end{pmatrix} \\[1em]

&= \begin{pmatrix} 1 & 50 & 10 \\ 1 & 60 & 20 \\ 1 & 45 & 15 \end{pmatrix} \begin{pmatrix} 3.0 \\ 0.05 \\ -0.02 \end{pmatrix}\\[1.2em]

&= \begin{pmatrix} 5.30 \\ 5.60 \\ 4.95 \end{pmatrix} \end{aligned}
$$
