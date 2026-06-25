+++
date = '2026-06-25T21:55:26+08:00'
draft = false
math=true
tags=['pytorch', 'Deep Learning']
title = 'The Node-Edge Mental Model is a Misnomer'
description = """
Why CNNs are better understood as tensor transformations than node-edge diagrams, and how deep learning is fundamentally geometric representation learning.
"""
+++

The convolutional layer does not feel like what normally represents a neural
network - node and edges. This layer is simply a large function that turn an
input grid A(H,W,C) into another grid B(H', W', C') with a great deal of
internal states (parameters).

While you can technically force a convolutional layer into a "nodes and edges"
drawing—where every pixel is a node, and the shared filter weights are the edges
connecting them to the next layer of nodes—but doing so is not helping
understanding, chaotic and misses the point.

Treating a CNN layer as a geometric **tensor transformation function** is a much
more powerful and accurate mental model.

A convolutional layer is best understood as a mapping function $f$ that takes a
**input tensor** and maps it to a **output tensor**, parameterized by a **weight
tensor** $\Theta$:

$$B = f(A; \Theta)$$

Looking at the dimensions:

$$A \in \mathbb{R}^{H \times W \times C} \xrightarrow{\quad f(\cdot; \Theta) \quad} B \in \mathbb{R}^{H' \times W' \times C'}$$

Inside this function, the "internal states" (parameters) are organized into
their own high-dimensional blocks:

- The **Weights**: A tensor of shape $(C', C, K_h, K_w)$, where $C'$ is the
  number of filters, $C$ is the input channels, and $K_h, K_w$ are the kernel
  dimensions.
- The **Biases**: A vector of shape $(C',)$.

The "nodes and edges" diagram is a historical relic of how neural networks were
originally conceptualized—as simplified cartoons of biological brains. While it
works for simple, flat data, it quickly becomes an intellectual trap when you
move past basic networks.

The nodes-and-edges mental model belongs to Fully Connected Layers (also called
Linear or Dense layers). In that world:

- input is a 1D vector
- every input node connects to every output node

## The Tensor Model

The **tensor model** abandons the biological cartoon and treats deep learning
for what it actually is: geometry and multi-dimensional linear algebra.

In the tensor paradigm, a neural network is a pipeline of geometric
transformation. Data enters the pipeline with a specific shape, and each layer
is a function that morphs that shape into a new one.

<span style="color: #c94a4a;"><b> Deep learning is, at its core,
multi-dimensional geometry: Frame a real world question into the space,
operating in that space and then translate the findings back to reality.
</b></span>

> **Representation Learning** or **Manifold Learning**

A neural network is a cascade (瀑布状) of affine transformations, punctuated by
non-linearities that bend and warp the space, ultimately grouping data into
distinct regions.

> **Affine Transformation**: a geometric transformation that preserves lines and
> parallelism, but not necessarily Euclidean distances and angles - translate,
> scale, rotate, shear.

The fundamental components:

1. **Tensors** as spatial entities (the nouns)
   - Tensors (scalars, vectors, and matrices) are multidimensional arrays that
     represent the state and features of data.
   - The Geometry: They act as coordinates identifying geometry in an
     (N)-dimensional space.

> **Tensor represents a geometric entity in a N-dimensional space.**
>
> While the numerical components of a tensor will change if you rotate or change
> your coordinate system, the actual physical or geometric quantity the tensor
> represents remains unchanged.
>
> In a N-dimensional Space:
>
> - Rank 0 (Scalar): no directions. (e.g., temperature), 1 component
> - Rank 1 (Vector): one direction. (e.g., velocity), N components
> - Rank 2 (Matrix): two directions. (e.g., stress on a surface), N^2 components
> - Rand R: R directions. (e.g., Riemann curvature tensor), N^R components
>
> For example, in Einstein's General Relativity, spacetime is a 4-dimensional
> space (N=4). The Riemann curvature tensor is a Rank 4 tensor, meaning it
> requires (4^4 = 256) individual components to fully describe the geometric
> curvature of spacetime at a single point, yet it represents one single,
> objective geometric reality.

2. **Matrix Multiplication** as spatial transformation (the verbs)

   Passing data through a layer is essentially multiplying a data tensor by a
   weight matrix. The weight matrices perform **spatial transformations**. They
   stretch and squish the multi-dimensional space to group similar data points
   together.

3. **Activation Functions** introduce Non-Linearity, as spatial transformation
   on steroid (the verbs)

   Without non-linearities, the network would be doing only affine
   transformation - you may need "curves". Activation functions are what allow
   the network to "fold," "bend" and carve curve (non-linear) boundaries.

4. Learning (Optimization) being traveling on the **Loss Landscape**

   A loss function forms a multi-dimensional terrain - a loss landscape - that
   measures the deviation between the Net's internal state and the reality

   $$L(S) \to D$$
   - $S$ - Net State (parameters)
   - $D$ - Deviation from reality (loss score)

   Optimization techniques like gradient descent travel on this terrain to find
   the "valleys" where a certain $S$ produce the minimal $D$.

By viewing architectures through this lens, advanced structures (like
Transformers or CNNs) become easier to understand, revealing themselves as
spaces designed to exploit intrinsic symmetries.

---
