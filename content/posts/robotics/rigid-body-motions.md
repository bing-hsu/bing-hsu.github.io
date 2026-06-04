+++
date = '2026-06-04T23:30:02+08:00'
title = 'Rigid Body Motions'
tags = ['robotics']
math = true
description = """
Explore the systematic representation of rigid body position and orientation in 3D space using reference frames. Learn how to describe vectors, frames, and rigid-body motions using rotation matrices and position vectors in both 2D and 3D spaces.
"""
+++

We saw that a minimum of 6 numbers
$(x_A, y_A, z_A, \phi^{B}_{lat}, \phi^{B}_{lon}, \theta^C)$ is needed to specify
the position and orientation of a rigid body in three-dimensional physical
space.

In this chapter we develop a systematic way to describe a rigid body’s position
and orientation which relies on attaching a **reference frame** to the body.

**Vector $\mathrm{v}$** and **Vector Representation $v$**

> Vector $\mathrm{v}$ is a physical quantity in a space, and it does not care
> how we represent it. However, vector numbers $v$ is a representation of
> $\mathrm{v}$ that depends on the choice of coordinate frame.

A <span style="color: #c94a4a;"><b>free vector</b></span> is a geometric
quantity with a length and a direction. Think of it as an arrow in N-D space
($\mathbb{R}^n$). It is called “free” because it is not rooted anywhere
(unspecified "**origin**"); only its length and direction matter. A free vector
is denoted by an upright text symbol, e.g., $\mathrm{v}$.

> To make a vector - a physical concept - computable, we impose **reference
> frame** and **length scale** to set numbers on it.

Given a **reference frame** and **length scale**, this free vector can be moved
to a position such that the base of the arrow is at the origin. The free vector
$\mathrm{v}$ then is represented by the coordinates in this reference frame,
$v \in \mathbb{R}^n$. The representation $v$ will change using a different frame
and scale but the underlying free vector $\mathrm{v}$ is unchanged.

**Read Vector Representation as Point in Space**

Given a reference frame and length scale for the space, the point p is
represented as a vector from the reference frame origin to p -
$p \in \mathbb{R}^n$. As before, a different choice of reference frame and
length scale leads to a different representation $p \in \mathbb{R}^n$ for the
same point p in physical space.

<figure>
	<img src="/img/represent-point-as-vector.png" alt="represent-point-as-vector" />
	<figcaption> Represent Point using Vector Numbers </figcaption>
</figure>

The point p exists in physical space, and it does not care how we represent it.
If we fix a reference frame $\{a\}$, with unit coordinate axes $\hat{x}_a$ and
$\hat{y}_a$, we can represent p as $(1,2)$. If we fix a reference frame $\{b\}$
at a different location, a different orientation, and a different length scale,
we can represent p as $(4,-2)$.

**Space Frame and Body Frame**

We assume that there is one stationary fixed frame, or **space frame**, denoted
$\{s\}$, has been defined. Similarly, we often assume that at least one frame
has been attached to a rigid body. This **body frame**, denoted $\{b\}$, is the
stationary frame relative to the body.

You always start with a **World Frame**. <span style="color: #c94a4a;"><b>
"Position and orientation only exist in relativity". </b></span> Without **a
baseline point of comparison**, describing where an object is or how it is
turned is meaningless. It is an arbitrary, unchanging coordinate system that we
choose to act as our universal "ground truth."

> **Why frame symbol uses brackets $\{...\}$?**
>
> Using curly brackets like **$\{s\}$** means **"the whole package."** A
> coordinate frame is a bundle of four things:
>
> 1. An origin point
> 2. An $X$-axis
> 3. A $Y$-axis
> 4. A $Z$-axis
>
> It is a visual cue so you don't confuse a single piece of data with the entire
> coordinate system.

While it is common to attach the origin of the $\{b\}$ frame to some important
point on the body, such as its center of mass, this is not necessary. The origin
of the $\{b\}$ frame does not even need to be on the physical body itself, as
long as its configuration, relative to the body, is constant.

All reference frames are right-handed.

<figure>
	<img src="/img/right-hand-rule.png" alt="right-hand-rule" />
	<figcaption>right-hand-rule</figcaption>
</figure>

## Describe Rigid-body Motions in 2D Space

Consider the planar body:

<figure>
    <img src="/img/rigid-body-motions-plane.png" alt="rigid-body-motions-plane" />
    <figcaption> Rigid-body Motions in Plane </figcaption>
</figure>

Express the body frame $\{b\}$ in terms of fixed-frame coordinates $\{s\}$ with
basis $\hat{x}_s$ and $\hat{y}_s$:

**Origin Point: $\mathrm{p}$**

$$
\begin{align*}
p &= p_x\hat{x}_s + p_y\hat{y}_s
\end{align*}
$$

You may be more accustomed to writing $p$ as $(p_x, p_y)$; but writing
$\mathrm{p}$ as a **linear combination of basis $p_x\hat{x}_s+p_y\hat{y}_s$**
clearly indicates the reference frame where $(p_x, p_y)$ is defined.

**Orientation Angle: $\theta$**

In principle, we should use the angle $\theta$ to quantify the orientation of
the body frame $\{b\}$ relative to the fixed frame $\{s\}$, hence complete the 3
DOFs used to describe the pose of the body in 2D space: $(p_x, p_y, \theta)$.

Another way to describe the orientation uses frame axis:

$$
\begin{align*}
\hat{x}_b &= \cos{\theta}\hat{x}_s + \sin{\theta}\hat{y}_s \\[1.5ex]
\hat{y}_b &= -\sin{\theta}\hat{x}_s + \cos{\theta}\hat{y}_s
\end{align*}
$$

> Represent axes of $\{b\}$ as vectors in $\{s\}$ - linear combination of basis
> $\hat{x}_s$ and $\hat{y}_s$.

<figure>
	<img src="/img/derive-xb-yb.png" alt="derive-xb-yb" />
	<figcaption>Derive (xb,yb)</figcaption>
</figure>

### $(R, p)$: Represent a Frame

In this way, the original 3 ODF $(p_x, p_y, \theta)$ becomes 3 linear
combinations using basis in $\{s\}$:

$$
\begin{align*}
p &= p_x\hat{x}_s + p_y\hat{y}_s \\[1.5ex]
\hat{x}_b &= \cos{\theta}\hat{x}_s + \sin{\theta}\hat{y}_s \\[1.5ex]
\hat{y}_b &= -\sin{\theta}\hat{x}_s + \cos{\theta}\hat{y}_s
\end{align*}
$$

Point $\mathrm{p}$ is then represented as a vector $p \in \mathbb{R}^2$:

$$
\begin{align*}
p &= \begin{bmatrix} p_x \\ p_y \end{bmatrix}
\end{align*}
$$

The basis in body frame $\{b\}$ $\hat{x}_b$ and $\hat{y}_b$ are packed in matrix
$\mathrm{P}$:

$$
\begin{align*}
\mathrm{P} &= \begin{bmatrix} \hat{x}_b & \hat{y}_b \end{bmatrix} \\[1.5ex]
&= \begin{bmatrix} \cos{\theta} & -\sin{\theta} \\ \sin{\theta} & \cos{\theta} \end{bmatrix}
\end{align*}
$$

Together, the **origin vector and rotation matrix pair
$(\mathrm{P},\mathrm{p})$** gives a complete description of body frame $\{b\}$
in terms of $\{s\}$.

### $(R, p)$: Convert Representations

Now refer to the three frames in Figure 3.4. Expressing $\{c\}$ in $\{s\}$ as
the pair $(R,r)$:

$$
\begin{align*}
R &= \begin{bmatrix} \cos{\phi} & -\sin{\phi} \\ \sin{\phi} & \cos{\phi} \end{bmatrix} \\[1.5ex]
r &= \begin{bmatrix} r_x \\ r_y \end{bmatrix}
\end{align*}
$$

<figure>
    <img src="/img/fig-3-4.png" alt="fig-3-4" width=400/>
    <figcaption>Figure 3.4</figcaption>
</figure>

We describe the frame $\{c\}$ relative to $\{b\}$ (body relative to body). We
write $\{c\}$ relative to $\{b\}$ as the pair $(Q,q)$:

$$
\begin{align*}
Q &= \begin{bmatrix} \cos{\psi} & -\sin{\psi} \\ \sin{\psi} & \cos{\psi} \end{bmatrix} \\[1.5ex]
q &= \begin{bmatrix} q_x \\ q_y \end{bmatrix}
\end{align*}
$$

- $q$, the vector from the origin of $\{b\}$ to the origin of $\{c\}$ expressed
  in $\{b\}$ coordinates,
- $Q$, the orientation of $\{c\}$ relative to $\{b\}$,

Given

- $(Q,q)$ ($\{c\}$ relative to $\{b\}$)
- $(P,p)$ ($\{b\}$ relative to $\{s\}$)

$$
\begin{align*}
P &= \begin{bmatrix} \cos{\theta} & -\sin{\theta} \\ \sin{\theta} & \cos{\theta} \end{bmatrix} \\[1.5ex]
p &= \begin{bmatrix} p_x \\ p_y \end{bmatrix}
\end{align*}
$$

we $(R, r)$, $\{c\}$ relative to $\{s\}$:

$$
\begin{align*}
R &= PQ \\[1.5ex]
r &= Pq + p
\end{align*}
$$

By [Craig's Notation](#extra-craigs-notation-on-vector-and-matrix)

$$
 \begin{align*}
 {}^s R_c &= {}^s P_b \cdot {}^b Q_c \\[1.5ex]
 {}^s \vec{r} &= {}^s P_b {}^b \vec{q} + {}^s \vec{p}
 \end{align*}
$$

### $(R, p)$: Move Vector/Frame

Now consider a rigid body with two frames attached to it, $\{d\}$ and $\{c\}$.
The frame $\{d\}$ is initially coincident with $\{s\}$, and $\{c\}$ is initially
described by $(R,r)$ in $\{s\}$ (Figure 3.5(a)).

<figure>
  <img src="/img/fig-3-5.png" alt="fig-3-5">
  <figcaption>Figure 3.5</figcaption>
</figure>

Then the body is moved in such a way that $\{d\}$ moves to $\{d^\prime\}$,
becoming coincident with a frame $\{b\}$ described by $(P,p)$ in $\{s\}$.

Where does $\{c\}$ end up after this motion?

Denoting the configuration of the new frame $\{c^\prime\}$ as
$(R^\prime,r^\prime)$, you can verify that

$$
\begin{align*}
R^\prime &= P R \\[1.5ex]
r^\prime &= P r + p
\end{align*}
$$

**Condense the Information**

Frames $\{d\}$ and $\{c\}$ are 2 frames attached to the same rigid body, with a
Space frame: $\{s\}$

At Beginning:

1.  $\{d\} : ({}^s{P}_d, {}^s\vec{p})$ (**coincident with**
    $\{s\} : ({}^sI_s, {}^s\vec{0})$)
2.  $\{c\} : ({}^sR_c, {}^s\vec{r})$

After body movement:

$\{d\}$ moves to $({}^sP_d, {}^s\vec{p})$

Question, what is $\{c\} : (R^\prime, r^\prime)$?

**Reasoning:**

"$\{d\}$ is coincident at $\{s\}$" is the **vital precondition**, because of
this:

$$
({}^sR_c, {}^s\vec{r}) = ({}^dR_c, {}^d\vec{r})
$$

> The global spec for $\{c\}$, is the same as the local spec for $\{c\}$
> relative to $\{d\}$, because $\{d\}$ is coincident with $\{s\}$.

We then have the relativity chain (Read "$\to$" as "relative-to"):

$$
\{c\} \underbrace{\to}_{({}^dR_c, {}^d\vec{r}) = ({}^sR_c, {}^s\vec{r})} \{d\} \underbrace{\to}_{({}^sP_b, {}^s\vec{p}) } \{s\}
$$

Therefore, we have

$$
\begin{align*}
{}^sR^\prime_{c} = {}^sP_d {}^sR_c = {}^sP_d {}^dR_c \\[1.5ex]
{}^s\vec{r}^\prime = {}^sP_d {}^s\vec{r} + {}^s\vec{p} = {}^sP_d {}^d\vec{r} + {}^s\vec{p}
\end{align*}
$$

This is similar to Equations we see before where 3 frames are not necessary
belong to any bodies. The difference is that $(P,p)$ is expressed in the same
frame as $(R,r)$, so the equations are not viewed as a change of coordinates
(same vector, different numbers), but instead as a rigid-body
displacement/motion (same frame, change the vector shape!).

### Summary: $(P,p)$

A rotation matrix–vector pair such as $(P,p)$ can be used for three purposes:

1. **Describe a Pose**: represent a configuration of a rigid body relative to
   $\{s\}$

$$
\{b\} : ({}^sP_b, {}^s\vec{p})
$$

2. **Translate Vector Numbers between Frames**: to change the reference frame in
   which a vector or frame is represented

$$
\begin{align*}
{}^s\vec{v} &= {{}^sP_b {}^b\vec{v}} + {}^s\vec{p} &\text{find coord in s} \leftarrow \text{given  coord in b} \\[1.5ex]
{}^sP_b^{-1} ({}^s\vec{v} - {}^s\vec{p}) &= {}^b\vec{v} &\text{given coord in s} \rightarrow \text{find coord in b}
\end{align*}
$$

> Changing the numbers do not change the vector itself, so we have the same
> letter $\vec{v}$.
>
> To highlight the context that gives the vector the "reading" / numbers, we
> attach the frame as a subscript, so ${}^s\vec{v}$ is the same vector as
> ${}^b\vec{v}$, but with different numbers due to "reading context".

3. **Move a Vector**: to displace a vector or a frame

$$
\begin{align*}
{}^s\vec{w} &= {}^sP {}^s\vec{v} + {}^s\vec{p} &\text{where the vector goes} \leftarrow \text{a vector in s} \\[1.5ex]
{}^sP^{-1} ({}^s\vec{w} - {}^s\vec{p}) &= {}^s\vec{v}  &\text{a vector} \rightarrow \text{where the vector comes from}
\end{align*}
$$

> As $(P, p)$ does not necessary refer to a frame, but only a matrix and a
> vector defined in $\{s\}$, so we strip-off the subscript $b$ and write
> $({}^sP, {}^s\vec{p})$.
>
> Moving the vector $\vec{v}$ fundamentally changes the vector itself, so we
> have to use a different letter $\vec{w}$.
>
> Read it as Two distinct actions:
>
> 1. a rotation $P$
> 2. a translation $\vec{p}$

---

🧠 **Mental Model for Case 1, 2 and 3**

In Case 1, the minimum information required to fixate a rigid body in space
given a space frame $\{s\}$ is $({}^sP_b, {}^s\vec{p}_b)$.

This pair can be visualized as a coordinate frame $\{b\}$ on the body:

- ${}^s\vec{p}_b$: the origin (point represented by a vector).
- ${}^sP_b$: the basis of $\{b\}$ (basis vectors packed in a matrix).

In Case 2, for **a shape** in space, each observer has its own way to describe
it. $({}^sP_b, {}^s\vec{p}_b)$ provides a tool to translate the description to
the shape between observer $s$ and $b$.

In Case 3, you are standing completely still at the origin of frame $\{s\}$. You
control a drone, and you are about to command the drone to fly to a new
location.

- **The Launchpad $({}^s\vec{v})$**: This is where the drone is currently
  sitting on the floor, measured from your shoes.
- **The Flight Command $({}^sP,{}^s\vec{p})$**: This is the flight instruction
  you give to the controller: **first** a "rotation" **then** a "translation".
  - $P$ tells the "rotation" it makes relative to you
  - $p$ tells the "translation" relative to you.
- **The Landing Pad $({}^s\vec{w})$**: This is where the drone lands after
  executing the flight. You still measure its final position from your shoes.

## Describe Rigid Body Motions in 3D Space

Consider a rigid body occupying three-dimensional physical space, as shown in
Figure 3.6

<figure>
  <img src="/img/fig-3-6.png" alt="fig-3-6" width=500>
  <figcaption>Figure 3.6. Mathematical description of position and orientation</figcaption>
</figure>

- Assume a length scale, the fixed frame $\{s\}$ and a body frame $\{b\}$ have
  been chosen.
- Denote the basis (axes) of the fixed frame by
  $\{\hat{x}_s, \hat{y}_s, \hat{z}_s\}$ and the basis (axes) of the body frame
  by $\{\hat{x}_b, \hat{y}_b, \hat{z}_b\}$.
- All reference frames are right-handed: the **unit axes**
  ${\hat{x}, \hat{y}, \hat{z}}$ always satisfy
  $\hat{x} \times \hat{y} = \hat{z}$.

### Rotation Matrix - $R$

Let $\vec{p}$ denote the vector from the fixed-frame origin to the body-frame
origin. In terms of the fixed-frame coordinates,
${}^s\vec{p} = \begin{bmatrix} p_1 & p_2 & p_3 \end{bmatrix}^T$ can be expressed
as

$$
{}^s\vec{p} = p_1\hat{x}_s + p_2\hat{y}_s + p_3\hat{z}_s
$$

The axes of the body frame can also be expressed as:

$$
\begin{align*}
\hat{x}_b &= r_{11}\hat{x}_s + r_{21}\hat{y}_s + r_{31}\hat{z}_s \\[1.5ex]
\hat{y}_b &= r_{12}\hat{x}_s + r_{22}\hat{y}_s + r_{32}\hat{z}_s \\[1.5ex]
\hat{z}_b &= r_{13}\hat{x}_s + r_{23}\hat{y}_s + r_{33}\hat{z}_s
\end{align*}
$$

Defining ${}^s\vec{p} \in \mathbb{R}^3$ and ${}^sR_b \in \mathbb{R}^{3\times 3}$
as

$$
{}^s\vec{p} = \begin{bmatrix} p_1 \\ p_2 \\ p_3 \end{bmatrix} \quad , \quad
{}^sR_b = \begin{bmatrix} \hat{x}_b & \hat{y}_b & \hat{z}_b \end{bmatrix} =
 \begin{bmatrix} r_{11} & r_{12} & r_{13} \\ r_{21} & r_{22} & r_{23} \\ r_{31} & r_{32} & r_{33} \end{bmatrix}
$$

the 12 parameters given by (${}^sR_b$, ${}^s\vec{p}$) provide a description of
the position and orientation of the rigid body relative to the fixed frame.

> **Cross Product** of Vector $\vec{c} = \vec{a} \times \vec{b}$ takes two
> vectors and return a third vector that is perpendicular to both. (Not a **Dot
> Product** that returns a scalar).
>
> Why does $\hat{x} \times \hat{y} = \hat{z}$ mean right-hand rule? See
> [Vector Cross Product](#extra-vector-cross-product)

Rotation Matrix $R$:

$$
{}^sR_b = \begin{bmatrix} \hat{x}_b & \hat{y}_b & \hat{z}_b \end{bmatrix} =
 \begin{bmatrix} r_{11} & r_{12} & r_{13} \\ r_{21} & r_{22} & r_{23} \\ r_{31} & r_{32} & r_{33} \end{bmatrix}
$$

Recall that the three columns of $R$ correspond to the body-frame unit axes
$\hat{x}_b$, $\hat{y}_b$, and $\hat{z}_b$. The following conditions must
therefore be satisfied.

1. The unit norm condition: $\hat{x}_b, \hat{y}_b, \hat{z}_b$ are all unit
   vectors, so each column of ${}^sR_b$ must have a norm of 1.

   $$
   \begin{align*}
    r^2_{11} + r^2_{21} + r^2_{31} &= 1 \\[1.5ex]
    r^2_{12} + r^2_{22} + r^2_{32} &= 1 \\[1.5ex]
    r^2_{13} + r^2_{23} + r^2_{33} &= 1
   \end{align*}
   $$

2. The orthogonality condition: $\hat{x}_b, \hat{y}_b, \hat{z}_b$ are mutually
   perpendicular, so each pair of columns of ${}^sR_b$ must be orthogonal.

   $$
    \begin{align*}
    r_{11}r_{12} + r_{21}r_{22} + r_{31}r_{32} &= 0 \\[1.5ex]
    r_{11}r_{13} + r_{21}r_{23} + r_{31}r_{33} &= 0 \\[1.5ex]
    r_{12}r_{13} + r_{22}r_{23} + r_{32}r_{33} &= 0
    \end{align*}
   $$

The above 6 constraints can be succinctly expressed as:

> <span style="color: #c94a4a;"><b> Condition #1: Columns in a Rotation Matrix
> must form the "mutually-orthogonal" basis of a coordinate frame. </b></span>

$$
R^T R = I
$$

There is still the matter of accounting for the fact that the frame is right-
handed (i.e., $\hat{x}_b \times \hat{y}_b = \hat{z}_b$) rather than left-handed
(i.e., $\hat{x}_b \times \hat{y}_b = -\hat{z}_b$); $R^T R = I$ does not
distinguish between right- and left-handed frames.

To force the frame to be right-handed, we add the condition:

> <span style="color: #c94a4a;"><b> Condition #2: Columns in a Rotation Matrix
> must satisfy the right-hand rule. </b></span>
>
> <span style="color: gray">More like a convention / protocol than a law.
> Consistency matter, use either right-hand or left-hand rule, but not
> both.</span>
>
> Had the frame been left-handed, we would have $\det(R)=−1$

$$
\det(R) = 1
$$

**Definition 3.1**. The special orthogonal group $SO(3)$, also known as the
group of rotation matrices, is the set of all 3×3 real matrices $R$ that satisfy
(i) $R^T R = I$ and (ii) $\det(R) = 1$.

**Definition 3.2**. The special orthogonal group $SO(2)$ is the set of all 2×2
real matrices R that satisfy (i) $R^T R = I$ and (ii) $\det(R) = 1$.

Every $R \in SO(2)$ can be written:

$$
R = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
$$

where $\theta \in [0,2\pi)$, the angle formed from body frame x-axis to the
space frame x-axis.

The elements of $SO(2)$ represent **planar orientations** and the elements of
$SO(3)$ represent **spatial orientations**.

> There is some complexity to write element from $SO(3)$ in a form as clear as
> $SO(2)$ does for rotation in 3D space has 3 degrees of freedom, there is no
> one single matrix form that can express an arbitrary spatial rotation at once
> (Maybe a "Stack-of-Matrices").
>
> One primitive way to represent a spatial rotation is to use 3 matrices, with
> each representing a rotation about an axes (Euler angles representation, and
> order matters: X-Y-Z, Z-Y-X, etc). This generally is bad for algorithms &
> computation, despite conceptual easiness.
>
> We later see a way to represent a spatial rotation in one go: the Axis-Angle
> representation.

---

🫨 **What is going on?**

I have a rough idea of what is being discussed here: The text is formally
characterizing "what is to be a Rotation Matrix".

The thing called "rotation matrix" is a 3x3 that must respect 2 conditions:

1. Be able to form the basis of a coordinate frame, $R^T R = I$
2. Use the right-hand rule. $\det(R) = 1$

Here is the refined context give by Gemini:

Your intuition is spot on. The text is doing exactly what you suspected: it is
establishing a rigorous functional definition for what a rotation matrix must
be.

**What is "Group"?**

A mathematical **Group** is an upgraded "Set": a pair of a set $G$ and an
operator $*$

$$(G, *)$$

To be considered a group, this pair must satisfy four axioms:

- **Closure**: If you pick any two elements in the group and combine them using
  the operation, the result must also be in the group.
  $$\text{For all } a, b \in G, \quad a * b \in G$$
- **Associativity**: When combining three or more elements, the grouping doesn't
  change the final outcome.
  $$\text{For all } a, b, c \in G, \quad (a * b) * c = a * (b * c)$$
- **Identity Element**: There must be a specific "do nothing" element (usually
  called $e$) in the set. Combining any element with $e$ leaves that element
  unchanged. $$\text{For all } a \in G, \quad a * e = e * a = a$$
- **Inverse Element**: Every single element in the group must have a "undo"
  partner. If you combine an element with its inverse, you are reset back to the
  identity element.
  $$\text{For every } a \in G, \text{ there exists an } a^{-1} \in G \text{ such that } a*a^{-1} = e$$

For example "**Integers under Addition**" forms a group.

**Decipher the name $SO(3)$**

The $(3)$ part simply means the matrices operate on 3D vectors ($\mathbb{R}^3$).
They are $3 \times 3$ grids of numbers.

The Orthogonal Group - "$O(3)$" - is the set of all matrices that satisfy your
Condition #1: $$R^T R = I$$

An orthogonal matrix as a transformation only does rotation and never touches
lengths and angles. If you apply an orthogonal matrix to a 3D model of a robot
link, the link only rotate in space, but never stretch, shrink, or warp.

However, $O(3)$ has a missing point: it does not distinguish rotations and
reflections (mirroring, a special rotation case). Mathematically, it cannot tell
apart matrices with a determinant of $+1$ and matrices with a determinant of
$-1$.

In abstract algebra—particularly in the study of group theory and linear
algebraic groups—the adjective "**special**" has a very precise meaning. When
attached to a group of matrices, "special" indicates that all the matrices in
that group have a determinant equal to 1.

So, with the "special" modifier, "$SO(3)$", we filter out the reflection
matrices ($\det = -1$) and keep only the simple rotations.

---

The sets of rotation matrices $SO(2)$ and $SO(3)$ are called "groups" because
they satisfy the properties required of a mathematical group. Specifically, a
group consists of a **set** of elements and an **binary operation** on two
elements (matrix multiplication $\cdot$) such that, for all $A$, $B$ in the
group, the following properties are satisfied:

- Closure: $A \cdot B$ is also in the group - combine 2 rotations is still a
  rotation.
- Associativity: $(A \cdot B) \cdot C = A \cdot (B \cdot C)$ - you can compose
  rotations.
- identity element existence: There exists an element $I$ in the group such that
  $A \cdot I = I \cdot A = A$ - there is a "do nothing" rotation.
- inverse element existence: There exists an element $A^{−1}$ in the group such
  that $A \cdot A^{−1} = A^{−1} \cdot A = I$ - every rotation has an "undo"
  rotation.

> Associativity is not Commutativity.
>
> - Commutativity: $A \cdot B = B \cdot A$
> - Associativity: $(A \cdot B) \cdot C = A \cdot (B \cdot C)$
>
> Think A, B and C as functions,
>
> ```py
> #  test for commutativity:
> assert_equal(A(B(x)), B(A(x)))
>
> # test for associativity:
> def AB(x): lambda x: A(B(x))
> def BC(x): lambda x: B(C(x))
> assert_equal(AB(C(x)), A(BC(x)))
> ```

**Proposition 3.3**. The inverse of a rotation matrix $R \in SO(3)$ is also a
rotation matrix, and it is equal to the transpose of $R$:

$$
R^{−1} = R^T \quad \text{for all } R \in SO(3)
$$

**Proposition 3.4**. The product of two rotation matrices is a rotation matrix.

> You can compose multiple rotations into one single rotation.

**Proposition 3.5**. Multiplication of rotation matrices is associative,
$(R1R2)R3 = R1(R2R3)$, but generally not commutative, $R1R2 \ne R2R1$. For the
special case of rotation matrices in SO(2), rotations commute.

> Rotation order matters, except for 2D planar rotations.

**Proposition 3.6**. For any vector $\vec{x} \in \mathbb{R}^3$ and
$R \in SO(3)$, the vector $\vec{y} = R\vec{x}$ has the same length as $\vec{x}$.

> Rotation matrix should only "rotate", not stretch or shrink.

#### Introduce an Explicit Notation

A Rotation Matrix $R$ can be used for 3 purposes:

1. Represent an **Orientation**
2. Change **Vector Representation** between Frames
3. Rotate a Vector

<figure>
  <img src="/img/fig-3-7.png" alt="fig-3-7">
  <figcaption>Figure 3.7: The same space and the same point p represented in three different
frames with different orientations.
  </figcaption>
</figure>

To illustrate these uses, refer to Figure 3.7, which shows three different
coordinate frames – $\{a\}$, $\{b\}$, and $\{c\}$ – representing the same space.
These frames are chosen to have the same origin, since we are only representing
orientations. Not shown is a **fixed space frame** $\{s\}$, which is aligned
with $\{a\}$.

The orientations of the three frames relative to $\{s\}$ can be written:

$$
\begin{align*}
{}^sR_a &= \begin{bmatrix} \hat{x}_a & \hat{y}_a & \hat{z}_a \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = I \\[1.5ex]
{}^sR_b &= \begin{bmatrix} \hat{x}_b & \hat{y}_b & \hat{z}_b \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \\[1.5ex]
{}^sR_c &= \begin{bmatrix} \hat{x}_c & \hat{y}_c & \hat{z}_c \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 \\ 0 & 0 & -1 \\ 1 & 0 & 0 \end{bmatrix}
\end{align*}
$$

When we write $R_c$, we are referring to the orientation of frame $\{c\}$
relative to the fixed frame $\{s\}$. We can be more explicit about this by
writing it as $R_{sc}$: the frame $\{c\}$ of relative to the frame $\{s\}$.

**Represent a Frame**

Inspecting Figure 3.7, we express the relativity between 2 frames:

Represent frame $\{c\}$, relative to $\{a\}$:

> $\{c\}$ is numbered based on $\{a\}$, where
> $\hat{x}_a = [1,0,0], \hat{y}_a = [0,1,0], \hat{z}_a = [0,0,1]$.

$$
R_{ac} = \begin{array}{cc}
  & \begin{array}{ccc} \hat{x}_c & \hat{y}_c & \hat{z}_c \end{array} \\
  \begin{array}{c} \\ \\ \end{array} &
  \left[ \begin{array}{ccc}
  0 & -1 & 0 \\
  0 & 0 & -1 \\
  1 & 0 & 0
  \end{array} \right]
\end{array}
$$

- $\hat{x}_c$: shift $\hat{x}_a$ to where $\hat{z}_a$ is
- $\hat{y}_c$: shift $\hat{y}_a$ to where _opposite_ $\hat{x}_a$ is
- $\hat{z}_c$: shift $\hat{z}_a$ to where _opposite_ $\hat{y}_a$ is

Represent frame $\{a\}$, relative to $\{c\}$:

$$
% R_{ca} = \begin{bmatrix} 0 & 0 & 1 \\ -1 & 0 & 0 \\ 0 & -1 & 0 \end{bmatrix}
R_{ca} = \begin{array}{cc}
  & \begin{array}{ccc} \hat{x}_a & \hat{y}_a & \hat{z}_a \end{array} \\
  \begin{array}{c} \\ \\ \end{array} &
  \left[ \begin{array}{ccc}
  0 & 0 & 1 \\
  -1 & 0 & 0 \\
  0 & -1 & 0
  \end{array} \right]
\end{array}
$$

- $\hat{x}_a$: shift $\hat{x}_c$ to where _opposite_ $\hat{y}_c$ is
- $\hat{y}_a$: shift $\hat{y}_c$ to where _opposite_ $\hat{z}_c$ is
- $\hat{z}_a$: shift $\hat{z}_c$ to where $\hat{x}_c$ is

$R_{ac}$ and $R_{ca}$ are a pair of inverse rotation matrices, meaning

$$R_{ac} = R_{ca}^{-1}, \quad R_{ac} R_{ca} = I$$

From Proposition 3.3, the inverse of a rotation matrix is equal to its
transpose, so

$$R_{ac} = R_{ca}^T, \quad R_{ca} = R_{ac}^T$$

In fact, for any two frames $\{d\}$ $\{e\}$:

$$
R_{de} = R_{ed}^T = R_{ed}^{-1}
$$

**Convert Representation**

> Change the representation (numbers) of Vector / Frame from one Frame to
> Another Frame, the Geometric Identity is the same (Same Shape)

Given $R_{ab}$, $R_{bc}$:

$$
R_{ac} = R_{ab} R_{bc}
$$

Here, we can read $R_{bc}$ as a representation of $\{c\}$, and $R_{ab}$ as an
operator that changes the reference frame from $\{b\}$ to $\{a\}$

Apply a rotation matrix to a vector can also be express using the subscript
cancellation rule:

$$
R_{ab} \vec{v}_b = \vec{v}_a
$$

See also [Craig's Notation](#extra-craigs-notation-on-vector-and-matrix)

The above equations are written as

$$
{}^aR_b {}^bR_c = {}^aR_c \quad , \quad {}^aR_b {}^b\vec{v} = {}^a\vec{v}
$$

**Rotate A Vector/Frame**

<figure>
  <img src="/img/fig-3-8.png" alt="fig-3-8" width=200>
  <figcaption>Figure 3.8</figcaption>
</figure>

Figure 3.8 shows a frame $\{c\}$ with axes $\hat{x}, \hat{y}, \hat{z}$.

If $\{c\}$ is rotated by $\theta$ about a unit axis $\hat{\omega}$. The
orientation of the final frame $\{c^\prime\}$ with axes
$\hat{x}^\prime, \hat{y}^\prime, \hat{z}^\prime$, is written as $R_{sc^\prime}$
.

The rotation matrix $R_{sc^\prime}$ also represents the rotation operation that
takes $\{s\}$ to $\{c^\prime\}$. To Emphasizing the view of $R$ as a rotation
operator, we can write:

$$
R = \text{Rot}(\hat{\omega}, \theta)
$$

Examples of rotation operations about a coordinate frame axis:

$$
\begin{align*}
\text{Rot}(\hat{x}, \theta) &= \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta \\ 0 & \sin\theta & \cos\theta \end{bmatrix} \\[1.5ex]
\text{Rot}(\hat{y}, \theta) &= \begin{bmatrix} \cos\theta & 0 & \sin\theta \\ 0 & 1 & 0 \\ -\sin\theta & 0 & \cos\theta \end{bmatrix} \\[1.5ex]
\text{Rot}(\hat{z}, \theta) &= \begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix}
\end{align*}
$$

More generally, for
$\hat{\omega} = (\hat{\omega}_1, \hat{\omega}_2, \hat{\omega}_3)$:

> An arbitrary rotation axis

$$
\text{Rot}(\hat{\omega}, \theta) = \begin{bmatrix}
\hat{\omega}_1^2(1-c_{\theta}) + c_{\theta} & \hat{\omega}_1\hat{\omega}_2(1-c_{\theta}) - \hat{\omega}_3s_{\theta} & \hat{\omega}_1\hat{\omega}_3(1-c_{\theta}) + \hat{\omega}_2s_{\theta} \\
\hat{\omega}_2\hat{\omega}_1(1-c_{\theta}) + \hat{\omega}_3s_{\theta} & \hat{\omega}_2^2(1-c_{\theta}) + c_{\theta} & \hat{\omega}_2\hat{\omega}_3(1-c_{\theta}) - \hat{\omega}_1s_{\theta} \\
\hat{\omega}_3\hat{\omega}_1(1-c_{\theta}) - \hat{\omega}_2s_{\theta} & \hat{\omega}_3\hat{\omega}_2(1-c_{\theta}) + \hat{\omega}_1s_{\theta} & \hat{\omega}_3^2(1-c_{\theta}) + c_{\theta}
\end{bmatrix}
$$

- $c_{\theta} = \cos\theta$
- $s_{\theta} = \sin\theta$

Any $R \in SO(3)$ can be obtained by rotating from the identity matrix by some
$\theta$ about some $\hat{\omega}$. Also:

$$\text{Rot}(\hat{\omega}, \theta) = \text{Rot}(-\hat{\omega}, -\theta)$$

<figure>
  <img src="/img/rotation-direction-signage.png" alt="rotation-direction-signage" width=200>
  <figcaption>Determine Rotation Angle Signage: Right-hand Rule</figcaption>
</figure>

**Global Rotation vs Local Rotation**

Now, say that $R_{sb}$ represents $\{b\}$ relative to $\{s\}$ and that we want
to rotate $\{b\}$ by $\theta$ about a unit axis $\hat{\omega}$ by a rotation
$R=Rot(\hat{\omega}, \theta)$.

To be clear about what we mean, we have to specify whether the axis of rotation
$\hat{\omega}$ is expressed in $\{s\}$ or $\{b\}$.

Let $\{b^\prime\}$ be the new frame after a rotation ($R_{\hat{\omega}_s }$) by
$\theta$ about $\hat{\omega}_s$ (the rotation axis expressed in $\{s\}$), its
orientation is $R_{sb^\prime}$.

Let $\{b^{\prime\prime}\}$ be the new frame after a rotation
($R_{\hat{\omega}_b}$) by $\theta$ about $\hat{\omega}_b$ (the rotation axis
expressed in $\{b\}$), its orientation is $R_{sb^{\prime\prime}}$.

$$
\begin{align*}
R_{sb^\prime} &= R \cdot R_{sb} \quad \text{when} \quad R_{\hat{\omega}_s } \\[1.5ex]
R_{sb^{\prime\prime}} &= R_{sb} \cdot R \quad \text{when} \quad R_{\hat{\omega}_b}
\end{align*}
$$

> **Motion Instruction expressed in World Frame vs Local Frame**
>
> Given a frame $\{m\}$ whose current orientation is $R_m$, and a rotation
> instruction $R = \text{Rot}(\hat{\omega}, \theta)$, with
> $\hat{\omega} = [1,0,0]$ and $\theta = 90^\circ$, tells $\{m\}$ to "rotate by
> 90 degrees around the x-axis."
>
> One question: "By **world frame** x-axis, or by **local frame** x-axis?"
>
> <figure>
>   <img src="/img/motion-world-vs-local.png" alt="motion-world-vs-local" width=400>
> <figcaption>Motion  expressed in World Frame vs Local Frame</figcaption>
> </figure>
>
> If the intent is to do an "world frame rotation", then frame $\{m\}$
> orientation becomes $R \cdot R_m$.
>
> If the intent is to do a "local frame rotation", then frame $\{m\}$
> orientation becomes $R_m \cdot R$.

To rotate a vector $v$ by $R=Rot(\hat{\omega}, \theta)$, the $\hat{\omega}$ must
be expressed in the same frame as $v$. The rotated vector $v^\prime$, in that
same frame, is

$$v^\prime = R \cdot v$$

## Homogeneous Transformation Matrix - $T$

We now consider representations for the combined orientation and position of a
rigid body. A natural choice would be to use a rotation matrix $R \in SO(3)$ to
represent the orientation of the body frame $\{b\}$ in the fixed frame $\{s\}$
and a vector $p \in \mathbb{R}^3$ to represent the origin of $\{b\}$ in $\{s\}$.

Rather than identifying $R$ and $p$ separately, we package them into a single
matrix.

**Definition 3.13**. The special Euclidean group $SE(3)$, also known as the
group of rigid-body motions or homogeneous transformation matrices in
$\mathbb{R}^3$, is the set of a4×4 real matrices $T$ of the form

$$
T = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}
  = \left[ \begin{array}{ccc|c}
  r_{11} & r_{12} & r_{13} & p_x \\
  r_{21} & r_{22} & r_{23} & p_y \\
  r_{31} & r_{32} & r_{33} & p_z \\
  \hline
  0 & 0 & 0 & 1
    \end{array} \right]
$$

An element $T \in SE(3)$ will sometimes be denoted $(R,p)$.

**Definition 3.14**. The special Euclidean group $SE(2)$ is the set of all 3×3
real matrices $T$ of the form:

$$
T = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}
  = \left[ \begin{array}{ccc}
  \cos\theta & -\sin\theta & p_x \\
  \sin\theta & \cos\theta & p_y \\
  0 & 0 & 1
    \end{array} \right]
$$

- $\theta \in [0, 2\pi)$, represents the rotation: the angle rotating
  $X_{\text{world}}$ to $X_{\text{body}}$

The first three properties confirm that $SE(3)$ is a group.

**Proposition 3.15**. The inverse of a transformation matrix $T \in SE(3)$ is
also a transformation matrix:

$$
T^{-1} = \begin{bmatrix} R^T & -R^T p \\ 0 & 1 \end{bmatrix} \quad \text{for all } T \in SE(3)
$$

> Inverse of Rotation is its transpose; but this rule does not apply to $T$ as a
> whole.

**Proposition 3.16**. The product of two transformation matrices is also a
transformation matrix.

**Proposition 3.17**. The multiplication of transformation matrices is
associative, so that $(T_1 T_2) T_3 = T_1 (T_2 T_3)$, but generally not
commutative: $T_1 T_2 \ne
T_2 T_1$.

**Vector Representation Homogeneous Coordinate**

It is often useful to calculate the quantity $R\vec{x} + p$, where
$\vec{x} \in \mathbb{R}^3$ and $(R,p)$ represents $T$.

> ${}^sR_b {}^s\vec{x} + {}^s\vec{p}$: Convert a vector representation in
> $\{b\}$ to a representation in frame $\{s\}$.
>
> Be aware, this is only a representation (numbers) conversion, the geometric
> entity is the same (same shape). "Given a body frame $\{b\}$ and a coordinate
> expressed in $\{b\}$, what its absolute coordinate?"

If we append one more dimension to $\vec{x}$, making it four-dimensional, this
computation can be performed as a single matrix multiplication:

$$
\begin{align*}
T\vec{x}
&= \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ 1 \end{bmatrix} \\
&= x\begin{bmatrix} R \\ 0 \end{bmatrix}  + 1\begin{bmatrix} p \\ 1 \end{bmatrix} \\
&= \begin{bmatrix} Rx + p \\ 1 \end{bmatrix}
\end{align*}
$$

The vector $[\vec{x}^T \quad 1]^T$ is is the representation of $\vec{x}$ in
homogeneous coordinates, and accordingly $T \in SE(3)$ is called a homogenous
transformation.

**Proposition 3.18**. Given $T = (R,p) \in SE(3)$ and $x,y \in \mathbb{R}^3$,
the following hold:

1. $\|Tx - Ty\| = \|x - y\|$, where $\|\cdot\|$ denotes the standard Euclidean
   norm in $\mathbb{R}^3$.

> **Homogeneous transformation $T$ preserves distance.**
>
> Geometrically, the norm symbol $\|\cdot\|$ represents **length** or
> **magnitude**, and when you apply it to the difference between two points,
> like $\|x - y\|$ where $ x, y \in \mathbb{R}^3 $, it represents the
> straight-line distance between those two points in space.

2. $\langle Tx-Tz, Ty-Tz \rangle = \langle x-z, y-z \rangle$ for all
   $z \in \mathbb{R}^3$, where $\langle \cdot, \cdot \rangle$ denotes the
   standard Euclidean inner product in $\mathbb{R}^3$

> **Homogeneous transformation $T$ preserves angles.**
>
> In common english, before and after $T$, vector $zx$ and $zy$ have same inner
> product:
>
> $$ |zy\|\cos\phi_1 = \|Tzx\|\|Tzy\|\cos\phi_2 $$
>
> As $T$ preserves distance, therefore $\phi_1$ = $\phi_2$.
>
> $x - z$ is a vector that starts at point $z$ and points to point $x$; $y - z$
> is a vector that starts at point $z$ and points to point $y$.
>
>   <figure>
>   <img src="/img/x-z-common-sense.png" alt="x-z-common-sense" width=200>
>  <figcaption style="color: gray;">
> Common Sense in 3D: a line segment between 2 points can be represented as 
> the difference between vectors
> </figcaption>
>   </figure>
>
> For $a, b \in \mathbb{R}^3$, $\langle a, b \rangle = a^T b$ is the inner
> product (e.g., `np.dot(a, b)`).
>
> $$\langle a, b \rangle = \|a\| \|b\| \cos\phi$$
>
> - $\|a\|$ and $\|b\|$ are the lengths of the vectors.
> - $\phi$ (phi) is the angle between them.

There are three major use cases for $T$:

1. to represent the configuration (position and orientation) of a rigid body;
2. to change the reference frame in which a vector or frame is represented;
3. to displace a vector or frame.

<figure>
  <img src="/img/fig-3-14.png" alt="fig-3-14">
  <figcaption style="color: gray;">
  Figure 3.14
  </figcaption>
</figure>

To illustrate these uses, we refer to the three reference frames
$\{a\}, \{b\}, \{c\}$ and the point $v$, in Figure 3.14.

The frames were chosen in such a way that the alignment of their axes is clear,
allowing the visual confirmation of calculations.

### $T$ - Represent a Configuration

The fixed frame $\{s\}$ is coincident with $\{a\}$ and the frames $\{a\}$,
$\{b\}$, and $\{c\}$, represented by $T_{sa} = (R_{sa}, p_{sa})$,
$T_{sb} = (R_{sb}, p_{sb})$, and $T_{sc} = (R_{sc}, p_{sc})$, respectively, can
be expressed relative to $\{s\}$ by the rotations:

$$
R_{sa} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0  \\ 0 & 0 & 1 \end{bmatrix}, \quad
R_{sb} = \begin{bmatrix} 0 & 0 & 1 \\ 0 & -1 & 0 \\ 1 & 0 & 0 \end{bmatrix}, \quad
R_{sc} = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}
$$

The origins to each frame relative to $\{s\}$:

$$
p_{sa} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}, \quad
p_{sb} = \begin{bmatrix} 0 \\ -2 \\ 0 \end{bmatrix}, \quad
p_{sc} = \begin{bmatrix} -1 \\ 1 \\ 0 \end{bmatrix}
$$

Since $\{a\}$ is collocated with $\{s\}$, the transformation matrix $T_{sa}$
constructed from $(R_{sa}, p_{sa})$ is the identity matrix:

$$
T_{sa} = \begin{bmatrix} R_{sa} & p_{sa} \\ 0 & 1 \end{bmatrix} =
\begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

> Relativity exists between any 2 frames and is mutual.

Any frame can be expressed relative to any other frame, not just to $\{s\}$; for
example, $T_{bc} = (R_{bc}, p_{bc})$ represents $\{b\}$ relative to $\{c\}$:

$$
T_{bc} = \begin{bmatrix} R_{bc} & p_{bc} \\ 0 & 1 \end{bmatrix} =
\begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & -1 & -3 \\ -1 & 0 & 0 & -1 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

and

$$
T_{bc} = T_{cb}^{-1}
$$

### $T$ - Convert Representation

> Convert the number systems of the same geometric entity.

For any three reference frames $\{a\}$, $\{b\}$, and $\{c\}$, and any vector
$\vec{v}$ expressed in $\{b\}$ as $\vec{v}_b$:

$$
T_{ab}T_{bc} = T_{ac} \quad , \quad T_{ab}\vec{v}_b = \vec{v}_a
$$

### $T$ - Displace Vector/Frame

A transformation matrix $T$, viewed as the pair
$(R,p) = (\text{Rot}(\hat{\omega},\theta),p)$, can act on a frame $T_{sb}$ by
rotating it by $\theta$ about an axis $\hat{\omega}$ and translating it by $p$.

we can extend the $3 \times 3$ rotation operator
$R = \text{Rot}(\hat{\omega},\theta)$ to a $4 \times 4$ transformation matrix
that rotates without translating,

$$\text{Rot}(\hat{\omega},\theta) = \begin{bmatrix} R & 0 \\ 0 & 1 \end{bmatrix}$$

and we can similarly define a translation operator that translates without
rotating,

$$\text{Trans}(p) = \begin{bmatrix} 1 & 0 & 0 & p_x \\ 0 & 1 & 0 & p_y \\ 0 & 0 & 1 & p_z \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

Whether we pre-multiply or post-multiply $T_{sb}$ by $T = (R,p)$ determines
whether the $\hat{\omega}$-axis and $p$ are interpreted as in the fixed frame
$\{s\}$ or in the body frame $\{b\}$:

**Global Displacement vs Local Displacement**

$$T'_{sb} = TT_{sb} \quad \text{(global displacement, by world frame)}$$
$$T''_{sb} = T_{sb}T \quad \text{(local displacement, by body frame)}$$

**Describe Displacement**

"90 deg counter-clockwise rotate about +z, then move 2 unit along +y"

$T=(\text{Rot}(\hat{\omega},\theta), p)$ with $\hat{\omega}=(0,0,1)$,
$\theta=90°$, and $p=(0,2,0)$

<figure>
  <img src="/img/global-local-displacement.png" alt="global-local-displacement" width=500>
  <figcaption> Global and local displacement.  </figcaption>
</figure>

> Pure observation, any displacement has a rotation part and a translation part.
>
> - If it is a global displacement, you 1) rotate then 2) translate
> - If it is a local displacement, you 1) translate then 2) rotate

**Example 3.19.** Figure 3.16 shows a robot arm mounted on a wheeled mobile
platform moving in a room, and a camera fixed to the ceiling. Frames $\{b\}$ and
$\{c\}$ are respectively attached to the wheeled platform and the end-effector
of the robot arm, and frame $\{d\}$ is attached to the camera. A fixed frame
$\{a\}$ has been established, and the robot must pick up an object with body
frame $\{e\}$.

<figure>
  <img src="/img/fig-3-16.png" alt="fig-3-16" width=500>
  <figcaption>Figure 3.16</figcaption>
</figure>

Suppose that the transformations $T_{db}$ and $T_{de}$ can be calculated by the
camera. The transformation $T_{bc}$ can be calculated using the arm’s
joint-angle measurements. The transformation $T_{ad}$ is assumed to be known in
advance:

> **Contextualize the information**
>
> - $T_{db}$ and $T_{de}$: From Camera's point of view, it knows where is the
>   mobile platform ($T_{db}$) and where is the target object ($T_{de}$) need to
>   be picked up.
> - $T_{bc}$: The robot is aware of where is its end-effector relative to mobile
>   platform base
> - $T_{ad}$: The absolute position of the camera is fixed and is known in
>   advance

In order to calculate how to move the robot arm so as to pick up the object, the
configuration of the object relative to the robot hand, $T_{ce}$ (the position
of the target object in end-effector's point of view), must be determined.

As the object is fixed in space, we have:

$$T_{ab}T_{bc}T_{ce} = T_{ae} = T_{ad}T_{de}$$

where the unknowns are $T_{ce}$ and $T_{ab}$ (The absolute position of the
mobile platform base of the robot).

<figure>
  <img src="/img/trace-frames.png" alt="trace-frames" width=500>
</figure>

However, we can indirectly solve $T_{ab}$ using the camera:
$T_{ab} = T_{ad}T_{db}$, the above formula is rewritten as :

$$T_{ad}T_{db}T_{bc}T_{ce} = T_{ad}T_{de}$$

Therefore:

$$
T_{ce} = (T_{ad} T_{db} T_{bc})^{-1} T_{ad} T_{de}
$$

# Extra: Craig's Notation on Vector and Matrix

> I find craig's notation soooooooooo important to make things clear. It is such
> a vital tool for learners, though professionals may find them verbose.

Popularized by John Craig in introduction to robotics textbooks, show frames
explicitly in vector and matrix notation.

The **vector** $\vec{v}$ as expressed in the coordinates of frame $\{a\}$:

$$
{}^a \vec{v}
$$

<span style="color: #c94a4a;"><b>Distinguish vector and its numbers:</b></span>
$\vec{v}$ or $\mathrm{v}$ is the physical vector, and ${}^a \vec{v}$ is the
vector numbers in frame $\{a\}$.

You think in $\vec{v}$ or $\mathrm{v}$, but you implement calculations in
${}^a \vec{v}$.

**Matrix** has 2 frame marks. Matrix $P$ that defines the frame $b$ relative to
frame $s$:

$${}^s P_b$$

When multiplying relative frames, the indices matches and cancel out:

Therefore,

$$R = PQ$$

becomes

$${}^s R_c = {}^s P_b \cdot {}^b Q_c$$

And vector and vector numbers are explicit,

$$ \vec{w} = P\vec{v} $$

> This line confuses physical vector and vector numbers. I have to use another
> letter $\vec{w}$.
>
> $\vec{v} = P\vec{v}$ is not correct, implying $P$ does nothing and is
> omissible.

becomes

$${}^s\vec{v} = {}^s P_b {}^b\vec{v}$$

This notation makes the idea explicit: "**Matrix changes numbers, not
vectors**", cause you still get $\vec{v}$.

# Extra: Philosophy Time - Computationalism

> "Convert abstract concept manipulation into arithmetics..."

At its core, the philosophy is known as **Representation Theory** in
mathematics, and it aligns heavily with
**[Computationalism](https://en.wikipedia.org/wiki/Computational_theory_of_mind)**
in the philosophy of mind.

**If you can precisely map the structure of relationships between abstract
concepts into a space made of numbers, you no longer need to understand the
concepts themselves to manipulate them—you just need to calculate.**

**Leibniz’s Dream: _Calculemus!_**

In the 17th century, the philosopher and mathematician Gottfried Wilhelm Leibniz
had a wild vision. He dreamed of a universal formal language (_Characteristica
Universalis_) that could translate any human thought, legal dispute, or
scientific concept into numbers.

He famously claimed that if we could achieve this, two philosophers in a
disagreement wouldn't need to argue endlessly. They could simply sit down with a
piece of paper, pick up their pens, and say:

> "Let us calculate (_Calculemus_), without further ado, to see who is right."

Leibniz didn't have the silicon chips to realize his dream, but he laid the
philosophical foundation: **Reasoning is a form of computation.** If you
formalize the rules, arithmetic can replace intuition.

**Structural Isomorphism**

Why does this actually work? It works because of a mathematical concept called
**isomorphism** (from the Greek for "equal shape").

Mathematics shows that if you preserve the _relationships_ between things, the
medium doesn't matter.

- **In Language:** The word "King" has a specific semantic distance from "Man"
  and "Queen." If you map those distances accurately into a 768-dimensional
  vector space, the geometry of the space _becomes_ the meaning.
- **In Robotics:** A hinge joint rotating in a 3D room has a complex spatial
  relationship to the factory floor. If you map that axis into a 6-dimensional
  Twist vector, the algebra of the vector _becomes_ the physical motion.

You build a numerical simulator of reality where the laws of arithmetic mirror
the laws of the abstract concept.

**Computation Practicality**

Computers are dumb, but they are fast. They only understand how to do two things
really well at the hardware level: **add** and **multiply** binary digits via
transistors.

The philosophy of "arithmetization" is a bridge of radical pragmatism:

```
Abstract Reality (Rotations, Word Meanings, Pixel Patterns)
          │
          ▼  [The Mapping Layer / Embedding / Lie Algebra]
Continuous Vector Spaces (Matrices, Vectors, Tensors)
          │
          ▼  [The Hardware Layer]
Silicon Arithmetic (Addition, Multiplication, GPU Multiply-Accumulate)

```

By translating geometry (robotics) or semantics (LLMs) into arithmetic, we hand
the problem over to silicon. We trade human-like conceptual processing for raw
computational scale.

# Extra: Train Your Eye to Read a Rotation Matrix $R$

**Build the Rationales**

<span style="color: #c94a4a;"><b> You read $R$ ONE COLUMN AT A TIME. </b></span>

Each column in $R$ is one basis vector representation, from left to right:
$\hat{x}, \hat{y}, \hat{z}$, for a given frame relative to $\{s\}$.

For example, as $\{a\}$ is coincident at $\{s\}$, so its $R$ is identity
$I = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$. Its
basis vectors are:

$$
\hat{x}_a = \begin{pmatrix}1 \\ 0 \\ 0 \end{pmatrix} \quad \hat{y}_a =
\begin{pmatrix}0 \\ 1 \\ 0 \end{pmatrix} \quad \hat{z}_a = \begin{pmatrix}0 \\
0 \\ 1 \end{pmatrix}
$$

<figure>
  <img src="/img/basis-vector-in-I.png" alt="basis-vector-in-I" width=300>
  <figcaption>Right-hand System: Basis Vectors in a Frame with R = I</figcaption>
</figure>

See $\{b\}$ with a
$R = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$, its
basis vectors are:

$$
\hat{x}_b = \begin{pmatrix}0 \\ 1 \\ 0 \end{pmatrix} \quad \hat{y}_b =
\begin{pmatrix}-1 \\ 0 \\ 0 \end{pmatrix} \quad \hat{z}_b = \begin{pmatrix}0 \\
0 \\ 1 \end{pmatrix}
$$

The representation to each basis vector in $\{b\}$ tells you where the basis of
the "background frame" - $\{s\}$ - goes in order to form $\{b\}$.

- $\hat{x}_b$, its representation happens to be the same as $\hat{y}_s$, the
  rotation turns $\hat{x}_s$ where the $\hat{y}_s$ was
- $\hat{y}_b$, its representation happens to be the negative of $\hat{x}_s$, the
  rotation turns $\hat{y}_s$ to the "opposite direction" of $\hat{x}_s$
- $\hat{z}_b$ is the same as $\hat{z}_b$, meaning the rotation does not change
  the $\hat{z}$ basis

<figure>
  <img src="/img/rotation-in-frame-b.png" alt="rotation-in-frame-b" width=300>
  <figcaption>What Rotation does `I` do to get Frame B</figcaption>
</figure>

**Tricks & Battle Stories**

1. **Rule 1: The "Pivot" Axis**

If you see a 1 sitting on the main diagonal (top-left to bottom-right), and the
rest of its corresponding row and column are 0, you have found **the axis of
rotation** - a transformation where one axis stays still while the other two
spin around it like a wheel on an axle.

<figure>
  <img src="/img/yaw-pitch-row.png" alt="yaw-pitch-row" width=300>
  <figcaption>Yaw/偏航, Pitch/俯仰, Row/翻滚</figcaption>
</figure>

For example, a rotation around Z-axis (Yaw/偏航(转向)):

$$
R = \begin{bmatrix} \bullet & \bullet & 0 \\ \bullet & \bullet & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

Rule 2: **The Trace Score (Total Rotation Angle)**

The Trace of a matrix (the sum of its diagonal elements) acts as a compression
metric for the total amount of rotation, independent of which axis the object
rotated around.

$$\text{Tr}(R) = R_{11} + R_{22} + R_{33} = 1 + 2\cos\theta$$

<figure>
  <img src="/img/graph-formula.png" alt="graph-formula">
</figure>

Some interesting values:

| Trace | Rotation Angle (θ deg) |
| ----- | ---------------------- |
| 3     | 0∘                     |
| 2     | 60∘                    |
| 1     | 90∘                    |
| -1    | 180∘                   |

```py
import numpy as np

# compute trace
m = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])
m.trace() # (15)

def solve_rotation_angle_deg(R):
    trace = R.trace()
    theta_rad = np.arccos((trace - 1) / 2)
    theta_deg = np.degrees(theta_rad)
    return theta_deg

r = np.array([[0, -1, 0],
              [1,  0, 0],
              [0,  0, 1]])

solve_rotation_angle_deg(r) # 90.0
# see 1 on z axis, you then can have a rough idea
# this is a rotation of 90 degrees around the z axis
# although not exactly know the direction
```

Rule 3: **The $2 \times 2$ "Signature" **(Determining Clockwise vs.
Counter-Clockwise)

Once you isolate the pivot axis using Rule 1, look at the remaining $2 \times 2$
submatrix. Standard 2D rotations follow a strict sign signature based on the
Right-Hand Rule:

$$\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$$

Find the the negative sign: for a positive (counter-clockwise) rotation, the
negative sign lives on the top-right corner.

Example A: $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \implies$ The negative
sign is on top. This is a counter-clockwise rotation ($+90^\circ$).

Example B: $\begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \implies$ The negative
sign flipped to the bottom. This is a clockwise rotation ($-90^\circ$,
equivalent to a $+270^\circ$ rotation).

**Putting It Together**

$$R = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0.5 & -0.866 \\ 0 & 0.866 & 0.5 \end{bmatrix}$$

1. Pivot Axis: The first column is $\begin{pmatrix}1 & 0 & 0\end{pmatrix}^T$ and
   the first row is $\begin{pmatrix}1 & 0 & 0\end{pmatrix}$. The $X$-axis is
   unaffected. This is a rotation around $X$.
2. Rotation Angle: Sum the diagonal (Trace), $1 + 0.5 + 0.5 = 2$. By
   $1 + 2\cos\theta = 2$, $\cos\theta = 0.5$, and $\theta = 60^\circ$.
3. Rotation Direction: See negative sign in submatrix -
   $\begin{bmatrix} 0.5 & -0.866 \\ 0.866 & 0.5 \end{bmatrix}$ The negative sign
   is on the top-right of this block, therefore it is rotating counterclockwise.

Conclusion: "**A 60deg Counter-clockwise Rotation Around X axis**."
