+++
date = '2026-06-25T21:10:35+08:00'
draft = false
math=true
tags=['pytorch', 'Deep Learning']
title = 'The Max Pooling Layer'
description="""
Max-pooling in PyTorch, covering its intuition, output-shape math, and a practical `nn.MaxPool2d` example.
"""
+++

<figure >
  <img src="/img/max-pooling.png" alt="max-pooling" style="width:400;" />
</figure>

Max-pooling serves two purposes:

1. **Reduce Local Variance**: Even if the inputs shift around a little bit, the
   output of the max pooling layer stays constant. This makes the network robust
   to small translations, rotations, or distortions.

2. **Dimension Condensing**: By shrinking the spatial dimensions ($H \times W$),
   it forces the network to drop redundant spatial information and focus only on
   the most dominant features. This also keeps the computational footprint
   manageable as the network goes deeper.

## Math

A max-pooling layer $f$ has no internal states (parameters):

$$
A \in \mathbb{R}^{N \times C \times H \times W} \quad \xrightarrow{\quad f(\cdot) \quad} \quad B \in \mathbb{R}^{N \times C \times H' \times W'}
$$

A max-pooling layer only changes the spatial dimensions ($H \to H'$,
$W \to W'$), but keeps the batch size and channel count intact.

The max-pooling uses a kernel of a specific size ($k_h \times k_w$) and moves
with a stride $S$. It simply select the maximum values inside the window.

The spatial output size formula:

$$
H' = \left\lfloor \frac{H - k_h + 2P}{S} \right\rfloor + 1 \\[2ex]
W' = \left\lfloor \frac{W - k_w + 2P}{S} \right\rfloor + 1
$$

**"The Halving Layer"**

A max-pooling configured with a $2 \times 2$ kernel and a stride of 2
($k_h=k_w=2, S=2, P=0$) (non-overlapping) produces a "halving" result.

The output spital dimensions are half of the input dimensions:

$$
\begin{align*}
H' &= \left\lfloor \frac{H - 2}{2} \right\rfloor + 1 = \left\lfloor \frac{H}{2} \right\rfloor \\[2ex]
W' &= \left\lfloor \frac{W - 2}{2} \right\rfloor + 1 = \left\lfloor \frac{W}{2} \right\rfloor
\end{align*}
$$

This configuration cuts the height and width exactly in half, reducing the total
spatial area of the tensor by 75% ($0.5 * 0.5 = 0.25$), leads to an output with
one fourth of the original size.

## Code

```py
import torch
import torch.nn as nn

# Spatial configurations
kH = kW = 2  # standard pool size
S = 2        # standard stride
P = 0        # standard pooling padding

C = 64       # input depth (e.g., coming out of your previous conv layer)
H = W = 50   # input spatial size
N = 1        # batch size

# Fixed mathematical mapping function (no weights or biases)
pool = nn.MaxPool2d(kernel_size=(kH, kW), stride=S, padding=P)

# Sample tensor entering the layer
A = torch.randn(N, C, H, W)
B = pool(A)

# The channel depth (C=64) is perfectly preserved.
# The spatial dimensions are halved: (50 - 2)//2 + 1 = 25
assert B.shape == (N, C, (H - kH + 2 * P) // S + 1, (W - kW + 2 * P) // S + 1)
assert B.shape == (1, 64, 25, 25)
```
