+++
date = '2026-06-25T21:16:33+08:00'
draft = false
math=true
tags=['pytorch', 'Deep Learning']
title = 'Normalization'
description = """
Normalization in deep learning, converting vanishing/exploding gradients and how z-score standardization stabilizes training.
"""
+++

DL researchers introduced **Normalization** to address the vanishing/exploding
gradients problem.

Normalization works by <span style="color: #c94a4a;"><b> standardizing
("taming") each layers' "scale of activations" </b></span> during the
forward-pass, so that the gradients during the backward-pass are kept in a
reasonable range.

> An **activation** refers to the output of a artificial neuron.
>
> Deep learning borrows this concept from a biological brain where a neuron
> "activates"/"fires" when it receives a strong enough electrical signal.

**Vanishing / Exploding Gradients**

This backward-pass update relies on the **chain rule** of calculus, which
**multiplies gradients layer by layer**. If a network is deep, **a long chain of
multiplications can be problematic, especially for earlier layers where
gradients are the products of all previous layers' gradients**.

**1. Vanishing Gradients**

By the time they reach the earliest layers of the network, they are close to
zero. The early layers receive minimal learning stimulus (gradient) and hardly
change.

As the early layers are responsible for detecting foundational patterns so that
the later layers can focus more subtle patterns. The ineffective learning in the
early layers would cause the network fails to learn anything.

**2. Exploding Gradients**

The gradients grow exponentially as they are multiplied backward through the
layers, becoming excessively large.

The weight updates become massive, causing the model's loss to fluctuate wildly
or shoot up to `NaN` (Not a Number). The training process becomes unstable, and
the model fails to converge.

## Input Z-Score

Standardizes the input data before it enters the network. For each channel,
normalize cell value $x$ to $z$ (z-score) using:

$$
z = \frac{x - \mu}{\sigma}
$$

Effectively, turn absolute pixel value $[0, 255]$, into a measure of the
multiples to the standard deviation. For example, if a $x = 142$ is normalized
into $z = 1.32$, it means that the value $142$ in its channel is $1.32 \times$
standard deviations above the mean.

- a $z = 0$ means the value is exactly at the mean.
- a $z = 0.3$ means the value is 0.3x std **above** the mean,
- a $z = -0.3$ means the value is 0.3x std **below** the mean,
- a $z = 30$ means an extreme outlier.

**Preservation of Distribution Shape**

<span style="color: #c94a4a;"><b> This normalization step DOES NOT turn the data
into a Gaussian (Normal) distribution. </b></span>

$\frac{x - \mu}{\sigma}$ is a linear transformation, it scales and translates
the space but does not warp the internal topology of the data points.

If your original channel pixel distribution was heavily, the normalized
distribution $z$ will remain bimodal.

## Batch Normalization $BN$

Input Z-Score only normalizes the input data. $BN$ is a in-net step that
normalizes the intermediate activations of a network layer.

**$BN$ may not use a $\mu=0, \sigma=1$ strategy**, as this artificial rule can
limit the learning capacity of the network. Instead, $BN$ introduces two
learnable parameters per channel: a shift factor $\beta$ (effective $\mu$) and a
scale factor $\gamma$ (effective $\sigma$).

`nn.BatchNorm2d`

```py
import torch
import torch.nn as nn

N = 32
C = 64
H = W = 28

# Generate a mock activation tensor: [N, C, H, W]
# Skewed distribution: mean = 5.0, std = 3.0
mock_activations = torch.randn(N, C, H, H) * 3.0 + 5.0

# BN
# num_features matches the channel dimension (C) of the incoming tensor layout
# see note text for description about other hyperparameters
bn = nn.BatchNorm2d(num_features=C, eps=1e-5, momentum=0.1, affine=True)

# Training Mode
#
# During training, mu and sigma used to z-score elements are estimated from
# the current mini-batch (varies from batch to bach).
#
# Simultaneously, the layer updates a running estimation of the dataset's
# global mean `running_mean` and variance `running_var`
bn.train()
output_train = bn(mock_activations)

# verify the contract: dimensions [0, 2, 3] should be zero-mean, unit-variance
print( f"Output Mean (Channel 0): {output_train[:, 0, :, :].mean().item():.4f}")  # Target: ~0.0
print( f"Output Std  (Channel 0): {output_train[:, 0, :, :].std().item():.4f}")  # Target: ~1.0

# Inspect learnable parameter weights (initialized to gamma=1, beta=0)
print(f"Beta (effective mu): {bn.bias}")  # Vector of size [C]
print(f"Gamma (effective sigma): {bn.weight}")  # Vector of size [C]

# Running estimation of global mean/std
print(f"Running Mean: {bn.running_mean}")
print(f"Running Var: {bn.running_var}")

# Evaluation Mode
#
# During inference, your network needs to make deterministic predictions,
# often on a single image ($B=1$). You cannot compute a meaningful variance
# across a single image, therefore batch-based z-scoring is not possible.
#
# When you toggle model.eval(), BN stops calculating batch
# statistics. Instead, it uses the running_mean and running_var to z-score
# intermediate outputs. (effectively, memorize the mean/var of the its training set)
bn.eval()
# Single instance inference execution contract
single_image = torch.randn(1, C, H=W, H=W)
output_eval = bn(single_image)
```

**Hyperparameters**

1. `eps=1e-5`

Epsilon $\epsilon$ is a tiny scalar added to the mini-batch variance. This is a
safeguard for numerical stability. If a convolutional feature map becomes highly
uniform—for instance, if a ReLU activation zeros out nearly an entire channel
across a mini-batch—the empirical variance $\sigma^2$ will approach or equal
exactly $0$. Without $\epsilon$, dividing by zero would output `NaN` values,
causing the gradients to explode and terminating training.

2. `momentum=0.1` (Moving Average, absorption rate)

This parameter regulates how the layer constructs its trainset-wise $\mu$ and
$\sigma$ using an Exponential Moving Average (EMA). Every time a new mini-batch
propagates through the layer, the `running_mean` and `running_var` get an
update. `momentum` control how much power the new batch's statistics have in
updating the running estimates.

A higher `momentum` means the running mean/var responds more quickly to recent
batches, while a lower momentum means a more stable running mean/var.

An `momentum=1` would have the running estimates entirely replaced by the
current batch's statistics (i.e., the trainset-wise $\mu$ and $\sigma$ would
just be the last mini-batch's $\mu$ and $\sigma$), while a `momentum=0` would
never update the running estimates (i.e., they remain at their initial values).

3. `affine=True`

This boolean flag dictates whether the `BatchNorm2d` layer instantiates the two
learnable parameters: the scale factor $\gamma$ and the shift factor $\beta$.

`affine=True` (Default): start with default zero-mean, unit-variance. If the
optimization process discovers that a feature performs better when it is
stretched out or shifted away from zero, the backpropagation algorithm adapts
$\gamma$ and $\beta$.

`affine=False`: The layer acts as a strict, non-parameterized mathematical
operator. The output tensor is strictly locked $\mu=0, \sigma=1$.

### Usage in Net Design

<span style="color: #c94a4a;"><b> Normalization is typically incorporated after
almost every intermediate layer.</b></span>

You should avoid placing Batch Normalization in two locations:

1. **The Input Data Space:** We usually normalize the inputs using trainset-wide
   statistics before they enter the model.
2. **The Final Output Layer:** Forcing your final raw logits to adhere to a
   strict zero-mean and unit-variance distribution severely limits the capacity
   of the downstream `Softmax` operator to generate high-confidence probability
   vectors.

The convention is to insert the normalization layer
<span style="color: #c94a4a;"><b> after the linear transformation but before the
activation function. </b></span>

$$\text{Input} \quad \longrightarrow \quad \text{Conv2d(bias=False)} \quad \longrightarrow \quad \text{BatchNorm2d} \quad \longrightarrow \quad \text{ReLU} \quad \longrightarrow \quad \text{MaxPool2d}$$

**The `bias=False` Requirement**

Because `nn.BatchNorm` applies a learnable shift parameter ($\beta$), it cancels
out the translation effect of the preceding layer's bias vector. Leaving
`bias=True` on your `Conv2d` or `Linear` layers introduces redundant parameters
and wastes compute resource.

```python
import torch
import torch.nn as nn

class MNISTConvNet(nn.Module):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        IN_H = 28
        IN_W = 28
        IN_C = 1

        MAXPOOL_CONFIG = {
            "kernel_size": (2, 2),
            "stride": 2,
            "padding": 0,
        }

        CONV1_C = 32
        CONV2_C = 64
        FC1_OUT = 1024
        FC2_OUT = 10

        # Layer 1: [B, 1, 28, 28] -> [B, 32, 14, 14]
        self.conv1 = nn.Sequential(
            nn.Conv2d(
                in_channels=IN_C,
                out_channels=CONV1_C,
                kernel_size=(5, 5),
                padding="same",
                bias=False, # Remapped: Bias is redundant before BatchNorm
            ),
            nn.BatchNorm2d(num_features=CONV1_C), # Normalizes across B, H, W per channel
            nn.ReLU(),
            nn.MaxPool2d(**MAXPOOL_CONFIG),
        )

        # Layer 2: [B, 32, 14, 14] -> [B, 64, 7, 7]
        self.conv2 = nn.Sequential(
            nn.Conv2d(
                in_channels=CONV1_C,
                out_channels=CONV2_C,
                kernel_size=(5, 5),
                padding="same",
                bias=False, # Remapped: Bias is redundant before BatchNorm
            ),
            nn.BatchNorm2d(num_features=CONV2_C), # Normalizes across B, H, W per channel
            nn.ReLU(),
            nn.MaxPool2d(**MAXPOOL_CONFIG),
        )

        # Layer 3: [B, 64, 7, 7] -> [B, 1024]
        self.fc1 = nn.Sequential(
            nn.Flatten(start_dim=1, end_dim=-1),
            nn.Linear(
                in_features=CONV2_C * (IN_H // 4) * (IN_W // 4),
                out_features=FC1_OUT,
                bias=False, # Remapped: Bias is redundant before BatchNorm
            ),
            nn.BatchNorm1d(num_features=FC1_OUT), # Normalizes across B for 1D feature vectors
            nn.ReLU(), # Note: Added standard missing non-linearity before Dropout
            nn.Dropout(p=0.5),
        )

        # Layer 4 (Classification Head): [B, 1024] -> [B, 10]
        # NO BatchNorm here. We preserve raw scale variations for the loss function.
        self.fc2 = nn.Sequential(
            nn.Linear(
                in_features=FC1_OUT,
                out_features=FC2_OUT,
            ),
        )

    def forward(self, X):
        X = self.conv1(X)
        X = self.conv2(X)
        X = self.fc1(X)
        X = self.fc2(X)
        return X
```

**Why Not Place It After the Activation?**

There is an ongoing debate regarding $Conv \rightarrow BN \rightarrow ReLU$
versus $Conv \rightarrow ReLU \rightarrow BN$. While both configurations are
functional, the traditional choice (_before_ activation) remains the default for
most baseline architectures.

- **Before Activation ($Conv \rightarrow BN \rightarrow ReLU$):** The output of
  a linear projection satisfies a symmetric, relatively Gaussian distribution.
  Centering this symmetric space ensures that the subsequent `ReLU` cuts off
  exactly the negative half of the space predictably during initialization.
- **After Activation ($Conv \rightarrow ReLU \rightarrow BN$):** Passing the
  tensor through `ReLU` completely chops off the negative coordinates, leaving a
  highly asymmetric distribution containing a hard spike at zero. If you
  calculate batch statistics _after_ this step, your mean ($\mu$) will be
  strictly positive, and the normalization step will drag some of those
  zero-valued elements into negative territory, modifying the non-linear
  execution contract of the network.

## Group Normalization $GN$

Group normalization is an alternative to batch normalization **in scenarios
where large batch sizes is impractical due to hardware memory limitations**.

**The Limits of $BN$**

$BN$ estimates the $\mu, \sigma$ across the batch dimension. While highly
effective for large batches, its performance drops significantly when the batch
size becomes small.

$BN$ estimate $\mu_c$:

$$
\mu_c = \frac{1}{N \times H \times W} \sum_{n=1}^{N} \sum_{h=1}^{H} \sum_{w=1}^{W} x_{n, c, h, w}
$$

If $N$ is small, $\mu_c$ is not representative enough to be an estimator for
global $\mu$ (using 1 or 2 images to estimate the whole dataset). Same logic
applies to $\sigma_c$.

This presents a major obstacle to use $BN$ in computer vision tasks where
hardware reality limits the batch size.

**How $GN$ Works**

Given $X \in \mathbb{R}^{N \times C \times H \times W}$. $GN$ divides $C$ into a
number of groups, and normalization process the pixels from channels belonging
to the same group for each instance.

Let's see the different effects of $GN$ and $BN$ to make it clear:

```py
C = 64
X = torch.randn(2, C, 10, 10) * 3 + 5

gn = nn.GroupNorm(num_groups=4, num_channels=C, affine=False)
X_gn = gn(X)

# 4 groups over 64 channels
# [0:16], [16:32], [32:48], [48:64]
group1 = slice(0, 16)
group2 = slice(16, 32)
group3 = slice(32, 48)
group4 = slice(48, 64)

groups = [group1, group2, group3, group4]
# the biggest difference to BN
# GN normalize is instance-wise,
# no matter N=1 or N=300, the output stats are stable
print("GN:\n")
for n in range(X.size(0)):
    for g in groups:
        original_slice = X[n, g, :, :]
        o_mean = original_slice.mean().item()
        o_std = original_slice.std(unbiased=False).item()

        norm_slice = X_gn[n, g, :, :]
        n_mean = norm_slice.mean().item()
        n_std = norm_slice.std(unbiased=False).item()

        # expect mean becomes 0 and std becomes 1
        print(
            f"N={n}, C[{g.start}:{g.stop}]",
            f"| mean: {o_mean:.4f} -> {n_mean:.4f}",
            f"| std: {o_std:.4f} -> {n_std:.4f}",
        )
"""
GN:

N=0, C[0:16] | mean: 5.0935 -> -0.0000 | std: 2.9822 -> 1.0000
N=0, C[16:32] | mean: 5.0213 -> -0.0000 | std: 2.9994 -> 1.0000
N=0, C[32:48] | mean: 4.8787 -> 0.0000 | std: 3.0082 -> 1.0000
N=0, C[48:64] | mean: 5.0359 -> -0.0000 | std: 3.0979 -> 1.0000
N=1, C[0:16] | mean: 5.2087 -> 0.0000 | std: 3.0198 -> 1.0000
N=1, C[16:32] | mean: 4.9427 -> 0.0000 | std: 2.9803 -> 1.0000
N=1, C[32:48] | mean: 5.0771 -> 0.0000 | std: 3.0063 -> 1.0000
N=1, C[48:64] | mean: 4.9063 -> 0.0000 | std: 2.9939 -> 1.0000
"""

# compared to BN
print("\BN:\n")
bn = nn.BatchNorm2d(num_features=C, affine=False)
X_bn = bn(X)
for n in range(X.size(0)):
    # instance level does not display stable stats
    print(
        f"instance-wise BN; N={n}, C=0",
        f"| mean: {X_bn[n,0,:,:].mean().item():.4f}",
        f"| std: {X_bn[n,0,:,:].std(unbiased=False).item():.4f}",
    )

# BN is batch-wise, batch level displays stable stats
print(
    f"batch-wise BN; C=0",
    f"| mean: {X_bn[:,0,:,:].mean().item():.4f}",
    f"| std: {X_bn[:,0,:,:].std(unbiased=False).item():.4f}",
)

"""
BN:

instance-wise BN; N=0, C=0 | mean: -0.0719 | std: 1.0114
instance-wise BN; N=1, C=0 | mean: 0.0719 | std: 0.9832
batch-wise BN; C=0 | mean: 0.0000 | std: 1.0000
"""
```
