+++
date = '2026-06-25T20:54:53+08:00'
draft = false
math=true
tags=['pytorch', 'Deep Learning']
title = 'The Convolutional Layer'
description = """
A concise introduction to convolution in CNNs, covering kernel operations, output computation, and multi-channel (RGB) image filtering with clear formulas and examples.
"""
+++

## The Convolution Process in Image Processing

> In image processing: convolution refers to the process that uses a
> kernel/filter scanning an image and produces a new image whose pixels is
> computed by combining (addition, subtraction, multiplication, etc.) kernel
> pixels and image pixels.

The process of producing a new grid $B$ by **applying** a filter/kernel $k$ all
across a grid $A$. The value at $B_{(i,j)}$ (row $i$ and column $j$) :

$$B_{i,j} = \sum_{u=0}^{U-1} \sum_{v=0}^{V-1} A_{i+u, j+v} \cdot k_{u,v} + b$$

- kernel of dimension $U \times V$
- $u,v$ are the kernel's row and column index, respectively.
- $i,j$ are the output grid's row and column index, respectively.

For example, say $k$ is a 2x2 kernel, $u = 2, v = 2$, the value at $B_{(0,0)}$
is:

$$
\begin{align*}
B_{(0,0)} &= \sum_{u=0}^{1} \sum_{v=0}^{1} A_{(0+u, 0+v)} \cdot k_{(u,v)} + b \\[1.5ex]
 &= A_{(0,0)} \cdot k_{(0,0)} + A_{(0,1)} \cdot k_{(0,1)} + A_{(1,0)} \cdot k_{(1,0)} + A_{(1,1)} \cdot k_{(1,1)} + b \\[3ex]
\end{align*}
$$

**A kernel "condenses" the original grid**.

- A 2x2 kernel condenses 4 values from into 1:

$$
B_{(i,j)} \gets A ~ \begin{pmatrix}
(i+0, j+0) & (i+0, j+1) \\
(i+1, j+0) & (i+1, j+1)
\end{pmatrix}
$$

- A 3x3 kernel condenses 9 values from into 1:

$$
B_{(i,j)} \gets A ~ \begin{pmatrix}
(i+0, j+0) & (i+0, j+1) & (i+0, j+2) \\
(i+1, j+0) & (i+1, j+1) & (i+1, j+2) \\
(i+2, j+0) & (i+2, j+1) & (i+2, j+2)
\end{pmatrix}
$$

Extend this idea to a grid with depth, for example a RGB image (3 channels):

$$
\begin{align*}
B_{i,j} &= \sum_{c=0}^{C-1} \sum_{u=0}^{U-1} \sum_{v=0}^{V-1} A_{c, i+u, j+v} \cdot k_{c, u, v} + b \\[1.5ex]
&= \sum_{c=0}^{2} \sum_{u=0}^{U-1} \sum_{v=0}^{V-1} A_{c, i+u, j+v} \cdot k_{c, u, v} + b
\end{align*}
$$

- $C$ is the number of channels, for RGB image, $C=3$.
- $c$ is the channel index, $c=0$ for Red, $c=1$ for Green, $c=2$ for Blue.

With a 2x2 kernel $k$, the value at $B_{(0,0)}$ is:

$$
\begin{align*}
B_{(0,0)} &= \sum_{c=0}^{2} \sum_{u=0}^{1} \sum_{v=0}^{1} A_{(c, 0+u, 0+v)} \cdot k_{(c, u, v)} + b \\[1.5ex]
 &= \sum_{c=0}^{2} \left( A_{(c, 0, 0)} \cdot k_{(c, 0, 0)} + A_{(c, 0, 1)} \cdot k_{(c, 0, 1)} + A_{(c, 1, 0)} \cdot k_{(c, 1, 0)} + A_{(c, 1, 1)} \cdot k_{(c, 1, 1)} \right) + b \\[3ex]
 &= \left( A_{(0, 0, 0)} \cdot k_{(0, 0, 0)} + A_{(0, 0, 1)} \cdot k_{(0, 0, 1)} + A_{(0, 1, 0)} \cdot k_{(0, 1, 0)} + A_{(0, 1, 1)} \cdot k_{(0, 1, 1)} \right) + \\[1.5ex]
&\quad \left( A_{(1, 0, 0)} \cdot k_{(1, 0, 0)} + A_{(1, 0, 1)} \cdot k_{(1, 0, 1)} + A_{(1, 1, 0)} \cdot k_{(1, 1, 0)} + A_{(1, 1, 1)} \cdot k_{(1, 1, 1)} \right) + \\[1.5ex]
&\quad \left( A_{(2, 0, 0)} \cdot k_{(2, 0, 0)} + A_{(2, 0, 1)} \cdot k_{(2, 0, 1)} + A_{(2, 1, 0)} \cdot k_{(2, 1, 0)} + A_{(2, 1, 1)} \cdot k_{(2, 1, 1)} \right) + b
\end{align*}
$$

> Notice the depth dimension is lost

---

## The Convolutional Layer

**1. Multiple Filters/Kernels**

A single filter/kernel can only look for one feature. To understand a complex
image, a layer needs to look for many different features at the same time.
Therefore, **a convolutional layer contains multiple independent filters**.

Each filter has its own set of parameters (weights and bias).

The **weights** of a kernel are the values on each pixel.

For a $3 \times 3$ filter:

$$
k = \begin{pmatrix}
w_{0,0} & w_{0,1} & w_{0,2} \\
w_{1,0} & w_{1,1} & w_{1,2} \\
w_{2,0} & w_{2,1} & w_{2,2}
\end{pmatrix}
$$

The **bias** $b$ is a single scalar. When a kernel slides across the input grid,
the same bias value is added to ever single cell of that output map.

**2. Activation Function**

Passing every values obtained from convolution operation through a non-linear
activation function. Activation function is a element-wise operation. It does
not change the shape of the output grid.

**3. Stacking Feature Maps into a Feature Volume**

Each filter produce one depth=1 feature map, with multiple feature maps from
multiple filters in a ler, we stacked them together to form a new feature
"volume".

With input $A_{(30,30,3)}$, a convolutional layer with 2 filters $k^1_{(5,5,3)}$
and $k^2_{(5,5,3)}$ will each produce a feature map $B^1_{(26,26,1)}$ and
$B^2_{(26,26,1)}$.

Stacking $B^1$, $B^2$ together will produce the layer output $B_{(26,26,2)}$.

---

⏰ **Key observations on dimensionality** ⏰

<span style="color: #c94a4a;"><b> The kernel's channel dimension must match the
input's channel dimension. </b></span>

$$
\begin{align*}
\text{Input Shape} &= (\text{Height}, \text{Width}, \mathbf{Channels}) \\
\text{Kernel Shape} &= (\text{Kernel Height}, \text{Kernel Width}, \mathbf{Channels})
\end{align*}
$$

<span style="color: #c94a4a;"><b> The output grid loses the channel dimension.
</b></span>

$$
A_{(30,30,3)} \ast k_{(5,5,3)} \to B_{(26,26,1)}
$$

And, as mentioned above, <span style="color: #c94a4a;"><b> in the same layer,
all kernels have the same dimensions </b></span>, so that their outputs can be
stacked together.

---

### Math

A Convolutional Layer is a function that maps an _input volume_
$A \in \mathbb{R}^{N \times C \times H \times W}$ to an _output volume_
$B \in \mathbb{R}^{N \times K \times H' \times W'}$:

$$
A \in \mathbb{R}^{N \times C \times H \times W} \quad \xrightarrow[\mathbf{W}, \mathbf{b}]{\quad f(\cdot) \quad} \quad B \in \mathbb{R}^{N \times K \times H' \times W'}
$$

- $N$ - batch size
- $C$ - input depth
- $H, W$ - height and width
- $K$ - kernel count / output depth
- $H', W'$ - output height and width

More specifically, a convolutional layer does:

1. Receive an input gird $A_{(H, W, C)}$.
2. Apply $N$ filters $k^n_{(U, V, C)}$ on $A$, producing $N$ intermediate grids
   $B^n_{(H', W', 1)}$
3. Apply an activation function $\sigma$ on $B^n$, producing $N$ activated
   feature maps $a^n_{(H', W', 1)}$.
4. Stack $a^n$ together, producing the final output grid $a_{(H', W', N)}$.

> Order of 3 and 4 does not matter. DL frameworks (like PyTorch or TensorFlow)
> almost always stack first, then activate to optimize the resources usage.

A relationship exists between the spatial dimensions (height and width) of input
volume $A$ and output volume $B$:

$$
\begin{align*}
H' = \left\lfloor \frac{H - k_h + 2p}{s} \right\rfloor + 1 \\
W' = \left\lfloor \frac{W - k_w + 2p}{s} \right\rfloor + 1
\end{align*}
$$

- $k_h, k_w$ - kernel height and width
- $p$ - zero-padding width
- $s$ - stride length

Generally, it’s wise to keep filter sizes small (size 3 × 3 or 5 × 5) to achieve
high representational power while keep a smaller number of parameters.

It’s also suggested to use a stride of 1 to capture all useful information from
the input volume, and a zero padding width that keeps the output volume’s height
and width equivalent to the input volume’s height and width - see "Same
Padding".

---

⏰ **Zero Padding and "Same Padding"** ⏰

<figure>
   <img src="/img/zero-padding-2.png" alt="zero-padding-2" style="width:300" />
   <figcaption>Zero Padding p = 2</figcaption>
</figure>

Zero Padding exists to solve 2 technical issues:

- Spatial Shrinkage

Every time a kernel slides across a grid, the output grid shrinks. If you have a
deep network with many layers, and the image shrinks slightly at every single
layer, your spatial dimensions will eventually collapse to $1 \times 1$ long
before the network can finish extracting deep features.

Zero padding allows you to control the output size. By adding rows and columns
of zeros, you can artificially inflate the input size so that the output matches
the original input dimensions (this is called "Same Padding").

- Loss of Edge Information

A pixel in the center of the image is overlapped by the sliding kernel multiple
times as it moves past. Its information is heavily processed. In comparison, a
pixel at the corner or edge of the image is only touched exactly once.

Adding a border of zeros pushes the actual image pixels toward the center of the
calculation, ensuring that edge features are paid more attention.

**"Same Padding"**

a technique that ensures the output grid has the same spatial dimensions as the
input grid.

With stride $s=1$ and square kernel $e = k_w = k_h$, to achieve same padding
($H = H'$ and $W = W'$), $p$ should be:

$$p = \frac{e - 1}{2}$$

- for a 3x3 kernel, $p = 1$
- for a 5x5 kernel, $p = 2$
- for a 7x7 kernel, $p = 3$

---

### Code

```py
import torch.nn as nn

K = 64 # kernel count / output depth
kH = kW = 3 # kernel height and width
S = 1  # stride
P = 1  # input zero-padding

C = 3  # input depth
H = W = 50 # input height and width
N = 1  # batch size

conv = nn.Conv2d(
    in_channels = C,        # input depth
    out_channels = K,      # kernel count / output depth
    kernel_size = (kH, kW),   # kernel extent (height, width)
    stride = S,
    padding = P
)

# W -> (out_depth/kernel_count, in_depth, kernel_height, kernel_width)
assert conv.weight.shape == (K, C, kH, kW)
# b -> (out_depth/kernel_idx)
assert conv.bias.shape == (K,)

# a sample RGB data
# In PyTorch, data tensors follow the (N, C, H, W) layout.
A = torch.randn(N, C, H, W)  # (instance_count, in_depth, in_height, in_width)
B = conv(A)
# -> (instance_count, out_channel/kernel_count, out_height, out_width)
# use // to keep consistency to the "flooring" operation
assert B.shape == (N, K, (H-kH+2*P)//S + 1, (W-kW+2*P)//S + 1)
```

> The $(N, C, H, W)$ layout is, by convention, the standard 4D tensor format
> used in deep learning to represent image data, where N is the number of
> samples (batch size / instance count), C is the number of channels / depth
> (e.g., 3 for RGB), H is the height, and W is the width

---

⏰ **Dim Check in Tensor Multiplication** ⏰

It is easy to see $C = AB$ is compatible if both are matrices:
$A \in \mathbb{R}^{M \times K}$ and $B \in \mathbb{R}^{K \times N}$, then the
output will be $C \in \mathbb{R}^{M \times N}$.

What if $A$ and $B$ are Rank > 2 tensors?

When you scale past Rank-2 matrices into high-dimensional tensors, performing a
dimensional sanity check becomes a vital debugging skill. In deep learning
frameworks like PyTorch, **tensor multiplication follows three behaviors**.

**Behavior 1: Batch Matrix Multiplication**

Those Rank > 2 tensors are in fact "stacked" matrices, where the last two
dimensions represent the matrix, and the preceding dimensions represent the
batch size, depth, or other dimensions that "repeats" the same matrix shape.

The last two dimensions perform standard 2D matrix multiplication. All leading
dimensions are treated as "batch dimensions" and must **either be exactly the
same** or **be compatible for broadcasting**.

In such case, $C = AB$ is meaningful when

$$
\begin{align*}
A &\in \mathbb{R}^{B_1 \times B_2 \times \mathbf{M} \times \mathbf{K}} \\[1.5ex]
B &\in \mathbb{R}^{B_1 \times B_2 \times \mathbf{K} \times \mathbf{N}}
\end{align*}
$$

- Check the tail:
  $(\mathbf{M} \times \mathbf{K}) \times (\mathbf{K} \times \mathbf{N})$ is
  valid and yields $\mathbf{M} \times \mathbf{N}$.
- Check the batch: $B_1 \times B_2$ is the same.

The output shape will be:

$$C \in \mathbb{R}^{B_1 \times B_2 \times \mathbf{M} \times \mathbf{N}}$$

**Behavior 2: Trailing Dimension Projection (The Linear Layer Rule)**

This occurs when you pass a high-dimensional data tensor through a standard
`nn.Linear` layer where the wight tensor is a matrix.

The multiplication **only targets the very last dimension of your data tensor**.
All preceding dimensions are treated as independent batch or sequence dimensions
and are left entirely untouched.

In such case, $C = AB$ is meaningful when

$$
\begin{align*}
A &\in \mathbb{R}^{N_1 \times N_2 \times \dots \times N_{D-1} \times \mathbf{K}} \\[1.5ex]
B &\in \mathbb{R}^{\mathbf{K} \times \mathbf{N}}
\end{align*}
$$

The inner $\mathbf{K}$ dimensions cancel out, and the output shape preserves
every single leading dimension while replacing $\mathbf{K}$ with $\mathbf{N}$:

$$C \in \mathbb{R}^{N_1 \times N_2 \times \dots \times N_{D-1} \times \mathbf{N}}$$

**Behavior 3:
[Einstein Summation](https://docs.pytorch.org/docs/2.12/generated/torch.einsum.html)
(Skip)**
