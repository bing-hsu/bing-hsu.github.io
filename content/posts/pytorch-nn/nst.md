+++
date = '2026-06-25T21:46:24+08:00'
draft = false
math=true
tags=['pytorch', 'Deep Learning']
title = 'NST: Neural Style Transfer'
description="""
Neural Style Transfer in PyTorch, covering content and style loss, Gram matrices, and how CNN features blend one image's content with another's artistic style.
"""
+++

> Original Paper:
> [A Neural Algorithm of Artistic Style](https://arxiv.org/abs/1508.06576)

This task involves three images:

1. Content Image $C$: the image whose content we want to preserve.
2. Style Image $S$: the image whose artistic style we want to apply.
3. Output Image $O$: the image we will create that combines the content of $C$
   with the style of $S$.

We need a CNN model that has been trained on image classification datasets that
have recognized features saved as kernel weights in its layers - at least being
able to detect features in $C$.

The loss function measures a combined loss $L$ measuring both

1. $L_\text{content}$ content-likeness between $C$ and $O$, and
2. $L_\text{style}$ style-likeness between $S$ and $O$.

$$
L = \alpha L_\text{content}(C, O) + \beta L_\text{style}(S, O)
$$

- $\alpha$ and $\beta$ are hyperparameters that control the trade-off between
  content and style.

**Content Loss**

$L_\text{content}$ measures the element-wise difference between the **feature
maps** of $C$ and $O$:

$$
L_\text{content}(C, O) = \sum_{l} \|F_l(C) - F_l(O)\|^2
$$

- $F_l(X)$ refers to the feature map of input $X$ at layer $l$

---

**Style Loss**

Style loss has a trickier job: it needs to capture the essence of an artistic
style—textures, color palettes, and brushstrokes—while discarding the actual
arrangement (line, angle, etc.).

The mathematical tool that makes this possible is the **Gram Matrix**.

## Gram Matrix

**Context**

Gram Matrix is fundamentally a tool for measuring how a set of vectors relate to
one another.

The matrix is named after the Danish mathematician Jørgen Pedersen Gram
(1850–1916). Gram developed these concepts while working on numerical
approximations and least-squares problems in the late 19th century. He needed
**a way to formalize how "overlapping" or redundant a set of functions or
vectors were**.

**Definition & Computation**

Given a set of vectors $\{v_1, v_2, \dots, v_n\}$ in an inner product space. The
Gram Matrix $G$ is a square ($n \times n$) matrix where every entry is the inner
product (or dot product) of two vectors:

$$G_{ij} = \langle v_i, v_j \rangle$$

If you store your vectors as the columns of a matrix $X$, the Gram Matrix is
simply calculated as:

$$G = X^T X$$

For example, with 2 vectors in $\mathbb{R}^2$: and arrange them in matrix $X$:

$$
v_1 = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}, \quad
v_2 = \begin{bmatrix} 4 \\ 5\\ 6 \end{bmatrix}, \quad
v_3 = \begin{bmatrix} 7 \\ 8 \\ 9 \end{bmatrix}, \quad
X = \begin{bmatrix} 1 & 4 & 7 \\ 2 & 5 & 8 \\ 3 & 6 & 9 \end{bmatrix}
$$

The Gram Matrix $G$ is:

$$
G = X^T X = \begin{bmatrix} 14 & 32 & 50 \\ 32 & 77 & 122 \\ 50 & 122 & 194 \end{bmatrix}
$$

```py
import numpy as np

# in numpy, column vector is in shape (n, 1)
# use slicing [:, np.newaxis] to turn a (n,) into (n, 1)
v1 = np.array([1, 2, 3])[:, np.newaxis]
v2 = np.array([4, 5, 6])[:, np.newaxis]
v3 = np.array([7, 8, 9])[:, np.newaxis]

# arrange vectors into a matrix
X = np.block([v1, v2, v3])

# Gram Matrix
G = X.T @ X
G
"""
[[ 14,  32,  50],
 [ 32,  77, 122],
 [ 50, 122, 194]]
"""
```

**Meaning**

As $\langle v_i, v_j \rangle = \|v_i\| \|v_j\| \cos(\theta)$

- Diagonal Entries ($G_{ii}$) represent the squared length of each vector
  ($\|v_i\|^2$).
- Off-Diagonal Entries ($G_{ij}$): Reveal the angle between vector $i$ and
  vector $j$.
  - If $G_{ij} = 0$, the vectors are orthogonal.
  - If $G_{ij}$ is positive or negative, the vectors point in similar or
    opposite directions.

If Normalized: If you scale all vectors to a length of 1, the Gram Matrix
becomes a matrix of **cosine similarities**.

$\hat{v}$ is a normalized vector of $v$ where $\|\hat{v}\| = 1$:

> Retain direction, discard magnitude

$$
\hat{v} = \frac{v}{\|v\|}
$$

```py
# normalize vector to norm =1
v1n = v1 / np.linalg.norm(v1)
v2n = v2 / np.linalg.norm(v2)
v3n = v3 / np.linalg.norm(v3)

# arrange into matrix
Xn = np.block([v1n, v2n, v3n])

# Gram Matrix (Cosine Similarity)
Gn = Xn.T @ Xn
Gn
"""
A measurement of direction similarity
closer to 1: aligned
closer to 0: orthogonal
closer to -1: opposite

array([[1.        , 0.97463185, 0.95941195],
       [0.97463185, 1.        , 0.99819089],
       [0.95941195, 0.99819089, 1.        ]])
"""
```

---

⏰ **Inner Product Space** ⏰

An **inner product space** is a vector space equipped with an additional
structure called an **inner product**. This extra feature introduces **geometric
concepts**—like length, distance, and angles—into the abstract world of vectors.

**Definition**

An inner product space is a vector space $V$ over a field (usually the real
numbers $\mathbb{R}$ or complex numbers $\mathbb{C}$). The **inner product**
operation, written as $\langle u, v \rangle$, takes two vectors and gives a
scalar.

- **Norm (Length):** The norm of a vector, written as $\|v\|$, is defined
  directly by the inner product:

$$\|v\| = \sqrt{\langle v, v \rangle}$$

- **Angle:** The angle $\theta$ between two vectors $u$ and $v$ can be defined
  using the inner product:

$$\cos(\theta) = \frac{\langle u, v \rangle}{\|u\| \|v\|}$$

- **Distance:** The distance between two vectors $u$ and $v$ is the norm of
  their difference:

$$d(u, v) = \|u - v\|$$

- **Orthogonality:** two vectors $v_1$ and $v_2$ are orthogonal (perpendicular)
  if their inner product is zero:

$$\langle v_1, v_2 \rangle = 0$$

**Computation**

In General $n$-Dimensional Space ($\mathbb{R}^n$). For vectors with $n$
components:

- $u = (u_1, u_2, \dots, u_n)$
- $v = (v_1, v_2, \dots, v_n)$

The computation is written using summation
notation:$$\langle u, v \rangle = \sum_{i=1}^{n} u_i v_i = u_1 v_1 + u_2 v_2 + \dots + u_n v_n$$

Example:If $u = (1, 0, -2)$ and $v = (3, 4, 5)$, then:

$$\langle u, v \rangle = (1 \times 3) + (0 \times 4) + (-2 \times 5) = 3 + 0 - 10 = -7$$

A dot product is a special type of inner product used between vectors. Inner
product is a broader concept that can apply to many types of spaces, including
functions and matrices.

## Style Loss

Lets see how style loss is represented in NST.

**Gram Matrix of a Feature Map**

1. The convolutional layer $l$ produces a tensor in shape $(C, H, W)$.
2. Flatten spatial dimension to get a tensor $F^l$ in shape $(C, Z)$ where
   $Z=H*W$
3. Compute the gram matrix $G^l = F^l (F^l)^T$ in shape $(C,C)$.

**Why the Gram Matrix Represents Style?**

The Gram matrix creates a summary of which visual features tend to appear
together.

Each entry $G_{ij}^l$ in the Gram Matrix is the inner product of channel $i$ and
channel $j$ - the geometric realtionship between 2 positions
$\langle i, j \rangle$ in the manifold learned by the layer.

If entry $G_{ij}^l$ is highly positive, it means channel $i$ and channel $j$
tend to activate together at the same positions across the image. For example,
if channel $i$ detects "swirling patterns" and channel $j$ detects "yellow
paint", a high correlation value tells us that the style of this image heavily
features yellow swirling patterns.

As we summed up the values across the entire height and width during the matrix
multiplication, the spatial layout is lost. The gram matrix tells yellow swirls
are present, but it does not knows whether they formed a star, a house, or a
tree.

**Define Style Loss**

We compute the Gram Matrix for both our style image ($A^l$) and our generated
image ($G^l$) at a specific layer $l$.

The style loss for a single layer is the Mean Squared Error (MSE) between these
two matrices:

$$
L_\text{style}^l = \frac{1}{4 C^2 Z^2} \sum_{i,j} (G_{ij}^l - A_{ij}^l)^2
$$

- $C$ is the channel count at layer $l$, and $Z$ is condensed spatial dimension
  (height $\times$ width).

**Why $\frac{1}{4 C^2 Z^2}$**

$\sum_{i,j} (G_{ij}^l - A_{ij}^l)^2$ sums up the _squared difference_ of all
pixels of all channels, so it has a unit

$$
\begin{align*}
(\underbrace{C}_{\text{all channel}} \times \underbrace{(H \times W)}_{\text{all pixels}})^2 &= (CZ)^2 \\
&= C^2 Z^2
\end{align*}
$$

The magic number $4$ is used to cancel out the coefficients generated by the
power rule and the chain rule during differentiation.

**Multi-Layer Aggregation**

Style is multi-scale. Fine brushstrokes are captured in early layers, while
sweeping artistic structures are captured in deeper layers. To get a convincing
representation, the total style loss is calculated across a collection of
multiple layers, each assigned a specific weight $w_l$:

$$L_{style\_total} = \sum_{l} w_l L_{style}^l$$

---

⏰ **Adaptation to mini-batch** ⏰

With a feature volume $(N, C, H, W)$, the Gram Matrix is computed on each
instance, lead to a $G^l$ in shape $(N, C, C)$

$F^l$ in shape $(N, C, Z)$, then $G^l = F^l (F^l)^T$ is
$(N, C, Z) \times (N, Z, C) \to (N, C, C)$

```py
N = 3
C = 64
H = W = 32
Z = H * W # 1024

F = torch.randn(N, C, Z)

assert F.view(N,C,Z).shape == (3, 64, 1024)
assert F.view(N,Z,C).shape == (3, 1024, 64)

# method 1: manual batch matrix multiplication
G = F.view(N, C, Z) @ F.view(N, Z, C)
assert G.shape == (3, 64, 64)

# method 2: use torch.bmm (batch matrix multiplication)
G_bmm = torch.bmm(F, F.transpose(1,2))
assert G_bmm.shape == (3, 64, 64)

# how tensor.transpose works on R>2 tensor
X = torch.randn(1,2,3)
assert X.shape == (1,2,3)
# switch dim at index 1 and 2
assert X.transpose(1,2).shape == (1,3,2)
assert X.transpose(0,2).shape == (3,2,1)

# how torch.bmm works
# expect 2 R=3 tensors
# - N,M must be the same
# (N, H, M) x (M, W, P) = (N, H, P)
N=10
M=4
H=3
P=6
A = torch.randn(N, H, M)
B = torch.randn(N, M, P)

C = torch.bmm(A, B)
assert C.shape == (N, H, P)
```

## Code

See Lab [NST.ipynb](/notebooks/NST.ipynb)

![sample](/img/nsf-sample.png)

![sample](/img/nsf-sample-2.png)

## 2026 Retrospective

Looking back at Leon Gatys’ 2015 Neural Style Transfer paper from 2026, we can
see that NST was far more than a tool for making photos look like Vincent van
Gogh paintings.

It was the first practical demonstration of <span style="color: #c94a4a;"><b>
disentangled representations </b></span> — a way of encoding data so that
individual, independent factors of variation are isolated.

While the paper's method is now largely outdated, its core philosophy has deeply
influenced the architecture of modern foundation models.

Before NST, the common consensus was that classification networks were a one-way
street: you feed in pixels, and you get a label (e.g., "Cat"). NST flipped the
arrow. <span style="color: #c94a4a;"><b> It showed that if a network is good at
classification, **its internal states** contain the information needed to
**synthesize the world**. </b></span>

Modern foundation models are built on this inversion. LLM are technically
massive text-prediction engines. But because they have to understand the
structure of human language to predict the next word, we can invert that
predictive power to make it "write" (synthesize) essays, code, or reason through
logic puzzles.
