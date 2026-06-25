+++
date = '2026-06-25T21:27:43+08:00'
draft = false
math=true
tags=['pytorch', 'Deep Learning']
title = 'ResNet: Residual Learning'
description = """
An overview of ResNet, the degradation problem in deep networks, and how residual connections help deeper models train effectively.
"""
+++

> Original paper:
> [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)

**The Challenge of Deep Nets**

ResNet comes at the need to solve a challenge in training deeper net.

The depth of representations is of central importance for many visual
recognition tasks and evidences indicate the network depth is critical for
better performance. With more layers, new challenges emerge.

One obstacle is the notorious problem of **vanishing/exploding gradients**,
which hamper convergence. This problem has been largely addressed by normalized
initialization and intermediate normalization layers (i.e. batch normalization),
which enable networks with tens of layers to start converging for stochastic
gradient descent with backpropagation.

When deeper networks are able to start converging, a degradation problem has
been exposed: **with the network depth increasing, accuracy gets saturated and
then degrades rapidly**.

<figure>
  <img src="/img/deep-plain-net-errors.png" alt="deep-plain-net-errors" width=500>
</figure>

Unexpectedly, **such degradation is not caused by overfitting**, and adding more
layers to a suitably deep model leads to **higher training error**.

**An Experiment**

Imagine you have two networks:

- Network A: A shallower network that has already been trained and performs
  well.
- Network B: A deeper network created by and copying A's learned layers, then
  adding several new layers on top.

If the optimization algorithm works as expected, the deeper network (Network B)
should be able to mimic the shallower network (Network A) by learning the newly
added layers to behave as identity mappings $f(x) = x$, so that Network B is at
least as good as Network A.

But experiments show that our existing solvers (before ResNet, 2015) are unable
to find these identity mappings, and the deeper network (Network B) performs
worse than the shallower network (Network A).

## Proposed Solution

<figure>
  <img src="/img/res-net-idea.png" alt="res-net-idea" width=400/>
</figure>

Block 1 learns the function $A : x \to y_1$. Block 2 learns the function
$H : y_1 \to y_2$. Both $y_1$ and $y_2$ are feature maps.

The right net incorporates a shortcut connection that add $x$ to the linear
transformation output of Block 4.

We define the combined operation of blocks 3 and 4 as
$z_F = \mathcal{F}(x) = F(y_1) = F(\text{ReLU}(A(x)))$ then:

$$
\begin{align*}
y^\prime_2 &= \text{ReLU}(z_{out}) \\
z_{out} &= z_F + x  \\
        &= \mathcal{F}(x) + x
\end{align*}
$$

$y^\prime_2$ is still a feature map, but the meaning of $\mathcal{F}(x)$ is
different. As

$$
y^\prime_2 = \text{ReLU}(\mathcal{F}(x) + x)
$$

$\mathcal{F}(x)$ is learning to produce the **difference** between feature map
$y^\prime_2$ to input $x$. This is where the name of "residual learning" comes
from.

**Be aware**, both block 3 and block 4 participate in residual learning, for
$\mathcal{F}(x)$ is the combined operation of block 3 and block 4.

<figure>
  <img src="/img/resnet-illustration.png" alt="resnet-illustration" width=500 />
</figure>

Here the **Residual Learning Block** comprises of $F$ and $G$ layers.

## Why it works?

Residual learning opens the possibility for a layer to become a **"No-Op"
layer**.

If a network doesn't need to change the features at a certain layer, an identity
mapping ($y = x$) can be learned. For a feature learning block, learning to
become an identity mapping is not a easy task. But for a residual block,
identity mapping is just all-zero wights, regardless of the inputs.

> **Why zero weights are easier to get and maintain?**
>
> For the simplest setup - a single linear layer - an identity mapping is
> exactly an identity matrix (1s on the diagonal, 0s everywhere else). However,
> in the context of training a deep neural network, **driving weights to zero is
> much easier for the optimization algorithm to achieve and maintain than
> keeping a precise diagonal 1s**.
>
> Certain Regularization Method explicitly fight against maintaining 1s and
> favor 0s: Weight Decay (L2 regularization) during training penalizes large
> weights and constantly pulling weights closer to zero.
>
> Identity mapping of Multi-layer Chain is even more difficult.
>
> Say, we want to pass $x$ through two layers unchanged: $$W_G \cdot W_F = I$$
> To achieve this, the network has to coordinate the weights from two layers.
> There are many ways two matrices can multiply to equal $I$, and finding and
> holding that exact balance during gradient descent is difficult.
>
> In contrast, for a residual network to pass $x$ through unchanged, it
> needs:$$W_G \cdot W_F = 0$$ If either weights drops to zero, the goal is met.

## The Art of "Do Nothing"

<span style="color: #c94a4a;"><b> "Learn to Do Nothing" is the breakthrough of
ResNets. </b></span>

Before ResNets, deeper networks often performed **worse** than shallower
networks—even on the training data. This was because every layers present in a
net always try to do something regardless of whether the net in totality has
achieved a optimal state.

If a network already reaches its optimal feature representation at layer 20, but
there are still 30-layers to go, the remaining 30 layers should ideally do
nothing to pass those perfect features along.

However, in a traditional setup:

- **Forced Modification:** Every layer is forced to modify the input.
- **Difficulty to find a no-op option:** For those 30 extra layers to perfectly
  preserve the data, the optimization algorithm has to find and maintain a
  precise sequence of configurations across millions of parameters, see "Why
  zero weights are easier to get and maintain?".

The network ends up adding noise, destroying information, and degrading the
final accuracy.

ResNets make "no-op" becomes an potential option. ResNets allowed researchers to
stack 50, 101, or even 1000+ layers without worrying about the deeper layers
harming performance. If a layer isn't useful, the network simply learns to let
the data pass through.

## Code

[Builtin ResNets](https://docs.pytorch.org/vision/main/models/resnet.html)

`torchvision.models.resnet18 [34,50,101,...]`

The dividing line occurs at `ResNet-50`. The moment you step up to 50 layers or
more, the internal structure of the blocks changes to manage the computational
load - **Shallow Family (ResNet-18, ResNet-34)** vs. **Deep Family (ResNet-50,
ResNet-101, ResNet-152)**.

**Common to Both**

Regardless of depth, every built-in ResNet in PyTorch shares identical **entry
and exit components**:

**The Stem (Input):** A single $7 \times 7$ convolution with a stride of 2,
followed by Batch Normalization, ReLU, and a MaxPool layer. This rapidly
downsamples raw images before they hit the residual stages.

The output size ($O$) for either width or height is calculated using the input
size ($I$), kernel size ($K$), padding ($P$), and stride
($S$):$$O = \left\lfloor \frac{I - K + 2P}{S} \right\rfloor + 1$$

A stride of 2 means halving the spatial dimensions immediately.

**The Head (Output):** An Adaptive Average Pooling layer that collapses any
incoming feature map spatial dimension (Width $\times$ Height) down to
$1 \times 1$, followed by a single fully connected (Linear) layer mapping to the
target output classes.

> ResNet in `torchvision` are configured as standalone classifiers. If you want
> to use ResNets as a component (a "backbone" or "feature extractor") inside a
> larger system you have to modify or strip away that final classification head.
>
> ```py
> self.backbone = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
> self.backbone.fc = nn.Identity()
> ```

**1.The Shallow Family (ResNet-18, ResNet-34)**

These networks use the [BasicBlock](#basicblock-pattern) pattern. A BasicBlock
consists of two $3 \times 3$ convolutional layers stacked sequentially.

**ResNet-18**

- **Block Configuration:** `[2, 2, 2, 2]` (2 basic blocks in each of the 4
  stages).
- **Total Layers:** 1 stem layer + 16 conv layers (8 basic blocks x2) + 1 final
  linear layer = 18 layers.

---

⏰ **The ResNet-18 Dimension Contract** ⏰

Assumes a starting input tensor of shape **$(N, C, H, W)$**, where $C = 3$
(standard RGB channels). To make the tracking concrete, the example path uses
the classic ImageNet input size of **$(N, 3, 224, 224)$**.

**Input Tensor**

- Symbolic Shape: $(N, 3, H, W)$
- Concrete Example: $(N, 3, 224, 224)$

**The Stem (Entry Steps)**

After `conv1` ($7 \times 7$ Convolution, Stride = 2, Padding = 3)

- Symbolic Shape:
  $(N, 64, \lfloor \frac{H}{2} \rfloor, \lfloor \frac{W}{2} \rfloor)$
- Concrete Example: $(N, 64, 112, 112)$

After `maxpool` ($3 \times 3$ Max Pooling, Stride = 2, Padding = 1)

- Symbolic Shape:
  $(N, 64, \lfloor \frac{H}{4} \rfloor, \lfloor \frac{W}{4} \rfloor)$
- Concrete Example: $(N, 64, 56, 56)$

**Stage 1 (Two BasicBlocks)**

_Note: Channels stay at 64; stride is 1 throughout. No dimensional change_

- Symbolic Shape:
  $(N, 64, \lfloor \frac{H}{4} \rfloor, \lfloor \frac{W}{4} \rfloor)$
- Concrete Example: $(N, 64, 56, 56)$

**Stage 2 (Two BasicBlocks)**

_Note: uses a stride of 2 to downsample spatial sizes and doubles channels
to 128._

- Symbolic Shape:
  $(N, 128, \lfloor \frac{H}{8} \rfloor, \lfloor \frac{W}{8} \rfloor)$
- Concrete Example: $(N, 128, 28, 28)$

**Stage 3 (Two BasicBlocks)**

_Note: uses a stride of 2 to downsample spatial sizes and doubles channels
to 256._

- Symbolic Shape:
  $(N, 256, \lfloor \frac{H}{16} \rfloor, \lfloor \frac{W}{16} \rfloor)$
- Concrete Example: $(N, 256, 14, 14)$

**Stage 4 (Two BasicBlocks)**

_Note: uses a stride of 2 to downsample spatial sizes and doubles channels
to 512._

- Symbolic Shape:
  $(N, 512, \lfloor \frac{H}{32} \rfloor, \lfloor \frac{W}{32} \rfloor)$
- Concrete Example: $(N, 512, 7, 7)$

**The Head (Exit Steps)**

After `avgpool` (Adaptive Average Pooling to $1 \times 1$ spatial target)

- Symbolic Shape: $(N, 512, 1, 1)$
- Concrete Example: $(N, 512, 1, 1)$

**After Flattening**

- Symbolic Shape: $(N, 512)$
- Concrete Example: $(N, 512)$

**After `fc` (Linear Classification Layer)**

- Symbolic Shape: $(N, \text{num_classes})$
- Concrete Example (ImageNet): $(N, 1000)$

---

**ResNet-34**

- **Block Configuration:** `[3, 4, 6, 3]` (Stacked deeper across the stages).
- **Total Layers:** 1 stem layer + 32 conv layers (16 basic blocks x2) + 1 final
  linear layer = 34 layers.

**2. The Deep Family (ResNet-50, ResNet-101, ResNet-152)**

If you scale a network past 34 layers using $3 \times 3$ convolutions, the
parameter count and computational cost grow too large. To resolve this, these
deeper models switch to a **BottleneckBlock**, which uses three convolutional
layers instead of two:

1. A $1 \times 1$ convolution to **reduce** the channel dimensions (compressing
   the data).
2. A $3 \times 3$ convolution to process the spatial features in this compressed
   space.
3. A $1 \times 1$ convolution to **expand** the channels back out.

Because of this expansion step, the final feature maps are four times larger
than the Shallow Family, scaling channels as follows: 256 $\rightarrow$ 512
$\rightarrow$ 1024 $\rightarrow$ 2048.

**ResNet-50**

- **Block Configuration:** `[3, 4, 6, 3]` (Same block distribution as ResNet-34,
  but using bottlenecks).
- **Total Layers:** 1 stem layer + 46 conv layers (16 bottleneck blocks x3) + 1
  final linear layer = 50 layers.

**ResNet-101**

- **Block Configuration:** `[3, 4, 23, 3]` (Stage 3 is expanded significantly to
  capture highly complex semantic features).
- **Total Layers:** 1 stem layer + 99 conv layers (33 bottleneck blocks x3) + 1
  final linear layer = 101 layers.

**ResNet-152**

- **Block Configuration:** `[3, 8, 36, 3]` (Extremely deep stacking across all
  middle stages).
- **Total Layers:** 1 stem layer + 150 conv layers (50 bottleneck blocks x3) + 1
  final linear layer = 152 layers.

### BasicBlock Pattern

Introduced in the 2015 paper _Deep Residual Learning for Image Recognition_.

- 2 `conv` layers
- shortcut is added to last `conv` output before activation

$$
\begin{align*}
&\text{X}  \quad &\text{INPUT} \\[1.5ex]
\to &\text{Conv2d} \to \text{BatchNorm2d} \to \text{ReLU} \quad &\text{1st conv} \\[1.5ex]
\to &\text{Conv2d} \to \text{BatchNorm2d} \quad &\text{2nd conv} \\[1.5ex]
\to &+ \text{Shortcut} \quad &\text{Add input to 2nd conv output} \\[1.5ex]
\to &\text{ReLU} \quad &\text{Activation} \\[1.5ex]
\to &\text{Y} \quad &\text{OUTPUT}
\end{align*}
$$

```py
import torch
import torch.nn as nn

class BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, in_channels, out_channels, stride=1):
        super(BasicBlock, self).__init__()

        # First 3x3 convolution layer
        self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU(inplace=True)

        # Second 3x3 convolution layer
        self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)

        # input tensor is added to the output of the second BN layer
        # handle dimension matching if needed
        # by default, shortcut do not change input
        self.shortcut = nn.Sequential()
        # only when input dimension does not fit for addition
        # do transformation, downsampling input into a shape fit to outout of last conv
        if stride != 1 or in_channels != out_channels * self.expansion:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels * self.expansion, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(out_channels * self.expansion)
            )

    def forward(self, x):
        identity = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)

        out = self.conv2(out)
        out = self.bn2(out)

        # Adding the shortcut
        # input tensor is added to the output of the second BN layer
        out += self.shortcut(identity)
        out = self.relu(out)

        return out
```

---

Four stages of features expansion: 64 $\rightarrow$ 128 $\rightarrow$ 256
$\rightarrow$ 512.

> **ResNet-N assumes Input Channel $C=3$**
>
> Handle when $C \ne 3$, for example a gray-scale $C=1$
>
> ```py
> import torchvision.models as models
> import torch.nn as nn
> resnet18 = models.resnet18(weights=None) # Training from scratch
> resnet18.conv1 = nn.Conv2d(1, 64)
> ```
