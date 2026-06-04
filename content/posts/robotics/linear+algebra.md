+++
date = '2026-06-04T21:53:20+08:00'
title = 'Linear Algebra, a Primer'
tags = ['robotics']
math = true
description = """An exploration of linear algebra fundamentals for robotics: vectors as geometric shapes in space, coordinate systems and basis vectors, linear combinations, and matrices as transformations. Covers coordinate frame transformations between different reference systems using homogeneous transformation matrices."""
+++

In Physics, vector represents a shape in space, more specifically a "direction &
distance".

When you mean **direction** and **distance** using vectors, you open the door
for mathematical operations upon these 2 concepts. **Making the space
_computable_**.

> This is a common phenomenon in mathematics: translate an abstract concept into
> numbers to make it computable. Think computational linguistics and LLM. In
> this case, we are turning **spatial / geometric** concepts into numbers.
>
> Fun fact: the word "geometry" comes from the ancient Greek γεωμετρία, which
> literally translates to "earth measurement"

## Vector vs Vector Representation

There is conceptual difference between a "vector" and a "vector
representation" - <span style="color: #c94a4a;"><b>how it is
_numbered_</b></span>.

Like the names to a person. The person exists objectively; whereas the name is
_invented_ under certain condition to refer to the person. A person can have
different names from PoV of different observers.

Likewise, a vector can have different sets of numbers describe it depending on
the coordinate system where you look at the vector.

> A "Coordinate System" is the translator between a vector and a set of numbers.
>
> Given 2 proper coordinate systems, one cay say $\vec{v}_1 = [2,3]$ in system 1
> and $\vec{v}_2 = [\frac{2}{3}, 4.1]$ in system 2 refer to the same vector.

Most of the time though, we simply assume an world frame to remove gutters in
discussion. But the **reference or frame issue** is not negligible when vector
is numbered in different frames:

$[1,1,1]$ in frame $X$ may or may not be the same shape as $[1,1,1]$ in frame
$Y$.

> Think money: $1 is not the same thing as ¥1, even though the number is equal.

<snap style="color: #c94a4a;"><b>Vector - the geometry in space - is absolute,
but Vector Representation, the numbers, needs a Frame to make sense.</b></snap>

## Linear Combination

The **linear combination** of vectors is an expression where the only operations
are **addition** and **scaling**.

<figure >
<div style="display: flex; justify-content: space-evenly;">
	<img src="/img/vector+addition.png" alt="vector-addition" width=300 />
	<img src="/img/vector+scaling.png" alt="vector-scaling" width=200 />
</div>
	<figcaption>Vector addition & Scaling</figcaption>
</figure>

<figure>
	<img src="/img/linear-combination.png" alt="linear-combination" width=400 />
	<figcaption>Linear combination of vectors</figcaption>
</figure>

### Basis

With Addition and Scaling, we can express any arbitrary vector as an expression
of several "special" vectors.

For example, for a 2D-vector:

$$
\begin{bmatrix}
3 \\ 4
\end{bmatrix} =
3 \cdot \begin{bmatrix} 1 \\ 0 \end{bmatrix} +
4 \cdot \begin{bmatrix} 0 \\ 1 \end{bmatrix}
$$

Here, the $ \begin{bmatrix} 1 \\ 0 \end{bmatrix} $ and $ \begin{bmatrix} 0 \\ 1
\end{bmatrix} $ are the "special" vectors that can be used to build all
2D-vectors.

We name these "special" vectors as **Basis Vectors** or just
<span style="color: #c94a4a;"><b>Basis</b></span>.

**Basis** is a function of **dimensionality**: for a N-D vector, there are N
basis vectors to express all the vectors in that N-D space.

The numbers to the N-D vector are actually the "scalers" of each basis.

$$
\begin{bmatrix} w_1 \\ w_2 \\ ... \\ w_n \end{bmatrix}
= w_1 \cdot
\vec{b_1} + w_2 \cdot \vec{b_2} + ... + w_n \cdot \vec{b_n}
$$

where

$$
\vec{b_1} = \begin{bmatrix} 1 \\ 0 \\ ... \\ 0 \end{bmatrix}, \quad \vec{b_2} =
\begin{bmatrix} 0 \\ 1 \\ ... \\ 0 \end{bmatrix}, \quad ..., \quad \vec{b_n} =
\begin{bmatrix} 0 \\ 0 \\ ... \\ 1 \end{bmatrix}
$$

<span style="color: #c94a4a;"><b>Any vector is a linear combination of the
basis</b></span>

This conclusion has another revelation: you should be aware that when you speak
about a vector using numbers - $\begin{bmatrix}x \\ y\end{bmatrix}$ - the choice
of the numbers implicitly depends on the <span style="color: #c94a4a;"><b>
choice of basis.</b></span>

In fact, <span style="color: #c94a4a;"><b> it is not a law that basis must be
like $\begin{bmatrix} 1 \\ 0\end{bmatrix}$ and
$\begin{bmatrix} 0 \\ 1\end{bmatrix}$. </b></span>

The technical definition of "basis" is:

> The **basis** of a _vector space_ is a set of _linearly independent_ vectors
> that _span_ the full space

This is crucial when you realize $\begin{bmatrix}1.232 \\ 1.866\end{bmatrix}$
based on
$(\begin{bmatrix} 1 \\ 0\end{bmatrix} , \begin{bmatrix} 0 \\ 1\end{bmatrix})$ is
the same vector as $\begin{bmatrix}2 \\ 1\end{bmatrix}$ based on
$(\begin{bmatrix} 0.866 \\ 0.5 \end{bmatrix},\begin{bmatrix} -0.5 \\ 0.866 \end{bmatrix})$

---

**When Robotics Talks About "Coordinate Frame"**

A Coordinate Frame is a choice of **Basis** (or **Rotation**) plus a choice of
**Origin Point**.

Robotics uses **Homogeneous Transformation Matrices / 齐次变换矩阵**
($4 \times 4$ matrices) to denote a coordinate frame.

$$
T = \begin{bmatrix} \vec{b}_x & \vec{b}_y & \vec{b}_z & \vec{p} \\ 0 & 0 &
0 & 1 \end{bmatrix}
$$

- $\vec{b}_x, \vec{b}_y, \vec{b}_z$ are the three basis vectors.
- $\vec{p}$ is a vector pointing to the origin of the frame.

**The World Frame**

$$
T = \begin{bmatrix} \vec{e}_x & \vec{e}_y & \vec{e}_z & \vec{p_0} \\ 0 & 0
& 0 & 1 \end{bmatrix}
$$

where

$$
\vec{e}_x = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \vec{e}_y =
\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \vec{e}_z = \begin{bmatrix} 0
\\ 0 \\ 1 \end{bmatrix}, \quad \vec{p_0} = \begin{bmatrix} 0 \\ 0 \\ 0
\end{bmatrix}.
$$

---

## Matrix

When vectors refer to shapes in space, a matrix can mean 3 things:

1. A Reference Frame, measured in a "base" frame.
2. A Representation Converter between two frames.
3. A Spatial Transformation that move shapes in space.

By itself, a Matrix <span style="color: #c94a4a;"><b> tells where the basis
go</b></span>.

> You read a Matrix as a stack of vectors, column by column.

See

$$M = \begin{bmatrix} a & c \\ b & d \end{bmatrix}$$

This matrix holds two vectors side-by-side:
$\begin{bmatrix} a \\ b \end{bmatrix}$ and
$\begin{bmatrix} c \\ d \end{bmatrix}$.

If we take the standard basis vectors
$\vec{i} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$ and
$\vec{j} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$ and multiply them by $M$, watch
what happens:

$$M \cdot \vec{i} = \begin{bmatrix} a & c \\ b & d \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} a \\ b \end{bmatrix} \quad (\text{The 1st column!})$$

$$M \cdot \vec{j} = \begin{bmatrix} a & c \\ b & d \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} c \\ d \end{bmatrix} \quad (\text{The 2nd column!})$$

Let's use an example to showcase what I mean by "matrix as a Representation
Converter between two frames"

> We will see the other 2 meanings of matrix in other posts [insert-link](#).

**Problem**: Which vector does Marry's $[1,-2]$ refer to in my coordinate
system?

Think **the numbers given to a vector** as **scalars** to the basis of a
coordinate system, therefore $[1,-2]$ is:

$$1*{}^{\text{marry}}\vec{b}_x + (-2)*{}^{\text{marry}}\vec{b}_y$$

In Marry's system, she believes ${}^{\text{marry}}\vec{b}_x$ and
${}^{\text{marry}}\vec{b}_y$ are the **standard**, therefore she gives them
numbers as $[1,0]$ and $[0,1]$ respectively.

However, her standard basis are not my "standard". Say, in my system, her
${}^{\text{marry}}\vec{b}_x$ is _numbered_ $[0.8, 0.5]$ and her
${}^{\text{marry}}\vec{b}_y$ is _numbered_ $[-0.5, 0.8]$.

Therefore, the vector Marry calls $[1,-2]$ is actually what I call $[1.8, -1.1]$
in my system:

$$1 \begin{bmatrix} 0.8 \\ 0.5 \end{bmatrix} + (-2) \begin{bmatrix} -0.5 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 1.8 \\ -1.1 \end{bmatrix}$$

Mathematically, we design a matrix that converts the vector recreation (the
numbers) from Marry's system to my system.

$$\begin{align*} {}^{\text{me}}P_{\text{marry}} &= \begin{bmatrix} 0.8 & -0.5 \\ 0.5 & 0.8 \end{bmatrix} \\[3ex] {}^{\text{me}}\vec{v} &= {}^{\text{me}}P_{\text{marry}} \cdot {}^{\text{marry}}\vec{v} \end{align*}$$

The symbolism ${}^{\text{me}}P_{\text{marry}}$ means a matrix, whose numbers are
measure in $\text{my}$ system, that represents $\text{marry}$'s basis. Vectors
${}^{\text{marry}}\vec{v}, {}^{\text{me}}\vec{v}$ means the representations to
the same vector $\vec{v}$ in Marry's system and my system respectively.

```py
import numpy as np

M = np.array([
    [0.8, -0.5],
    [0.5, 0.8],
])
# what marry's [1,-2] is numbered in my system
v = np.array([1,-2])
# dot product of matrix and vector
M @ v # [1.8, -1.1]
```

Similarly, the vector I call $[1, -2]$ is also numbered differently in Marry's
system.

First I need to find out what my basis look like from Marry's perspective - the
${}^\text{marry}P_{\text{me}}$.

With the help of linear algebra, we formulate the question as to find the
**inverse** of $P$, written as $P^{-1}$.

$${}^\text{marry}P_{\text{me}} = {}^{\text{me}}P_{\text{marry}}^{-1} \approx \begin{bmatrix} 0.899 & 0.562 \\ -0.562 & 0.899 \end{bmatrix} \\[3ex]$$

Therefore ${}^{\text{me}}\vec{v} = [1, -2]$ in Marry's system is:

$${}^\text{marry}P_{\text{me}} \cdot {}^{\text{me}}\vec{v} = 1 \begin{bmatrix} 0.899 \\ -0.562 \end{bmatrix} + (-2) \begin{bmatrix} 0.562 \\ 0.899 \end{bmatrix} = \begin{bmatrix} -0.225 \\ -2.360 \end{bmatrix}$$

```py
# Inverse of Matrix
M_inv = np.linalg.inv(M)
# what my [1,-2] is numbered in Marry's system
M_inv @ v # [-0.2247191 , -2.35955056]
```

So far, we see a Matrix ${}^aM_b$ establishes a relationship between 2
coordinate systems $a,b$. This concept will be echoed multiple times in
[later posts](#) about rigid body motion.

---

**Be Aware of the Implicit Information about a Matrix**

At least in spatial computing, a matrix implies a reference coordinate in which
its columns are numbered. Matrix-Matrix multiplication and Matrix-Vector
multiplication are only meaningful when the numbers are measured in the same
reference coordinate.

You can make it explicit by giving the formula more sub/supscripts:

$$
\begin{align*} {}^aM_b \cdot {}^b\vec{v} &= {}^a\vec{v} \quad &\text{OK} \\
{}^aM_b \cdot {}^c\vec{v} &= ? \quad &\text{Not OK} \\[3ex] {}^aP_b \cdot
{}^bP_c &= {}^aP_c \quad &\text{OK} \\ {}^aP_b \cdot {}^cP_d &= ? \quad
&\text{Not OK} \end{align*}
$$

> This syntactic convention is called Craig's Notation in Robotics.
