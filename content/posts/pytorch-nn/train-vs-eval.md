+++
date = '2026-05-02T18:23:41+08:00'
draft = false
title = 'Train vs Eval'
description = 'Why `model.train()` and `model.eval()`?'
tags = ['pytorch']
+++

Why PyTorch need `model.train()` and `model.eval()` modes?

In simple term, calling `model.train()` or `model.eval()` set a **boolean flag**
inside every layer of a model. This is necessary because some operations that
can help a model learn can be harmful when you just want to get a prediction,
and certain features are only meaningful to be active during inference.

Two significant "features" that require explicit mode settings are **Dropout**
and **Batch Normalization**.

## Dropout

Dropout randomly "kills" a percentage of neurons (sets their outputs to zero) in
train time. This forces the network to find multiple pathways to a solution so
it doesn't become over-reliant on a single "genius" neuron.

- **`model.train()`**: Dropout is **Active**, you create adversary situation to
  help model to be robust.

With **Dropout** in train time, the model can become more robust.
However, you do not want to randomly shut down neurons for no reason
during inference.

- **`model.eval()`**: Dropout is **Disabled**, you want the model to perform to
  its max, you do not want unnecessary obstacles.

## Batch Normalization

Batch Norm layers normalize the data in batch-to-batch so the training is
less sensitive to the scale of the input features.

- **`model.train()`**: The layer calculates the mean and variance of the
  **current batch** of data. It also keeps a running "diary" (moving average) of
  these statistics to represent the whole dataset.

However, the normalization is ideally a global operation, not a batch-level
operation. During inference, you want to use the overall statistics of the
dataset, not the current batch.

- **`model.eval()`**: The layer stops looking at the current batch. Instead, it
  uses the **running stats** it saved during training. This ensures that a
  single image produces the same prediction regardless of what other images are
  in the batch.

## The Risk of Forgetting

- **forget `.eval()` during testing/inference:** Imposing Inference Obstacles.
  Your predictions will be "less stable" because Dropout is still randomly
  killing neurons, and your Batch Norm might shift slightly based on the test
  data.
- **If you forget `.train()` during training:** Ineffective Learn. Your model
  will become fragile because Dropout won't be regularizing the network,
  and Batch Norm won't be updating its understanding of your data distribution.

# Understanding: `model.eval()` vs. `torch.no_grad()`

They are often used together in inference-time environment, but they do
different things.

|                  | `model.eval()`                                                           | `torch.no_grad()`                                                                  |
|:-----------------|:-------------------------------------------------------------------------|:-----------------------------------------------------------------------------------|
| **What it does** | Changes the _behavior_ of layers (Dropout, BatchNorm).                   | Turns off Autograd, no longer tracking tensor ops or computing partial derivatives |
| **Impact**       | Turn-off train-time-only features / Turn-on inference-time-only features | Saves memory and speeds up computation.                                            |
| **Requirement**  | Required in inference time                                               | Optional, but highly recommended.                                                  |

The standard "**Inference Pattern**" looks like this:

```py
model.eval()  # Switch layers to deployment mode
with torch.no_grad():  # Stop tracking gradients to save GPU memory
    predictions = model(inputs)
```
