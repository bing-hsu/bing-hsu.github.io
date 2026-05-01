+++
date = '2026-05-01T19:38:34+08:00'
title = 'Autorag in PyTorch'
draft = true
math = true
+++

## Automatic Differentiation

The `torch.autograd` package is PyTorch's automatic differentiation
library.

What does it to be "**Automatic**"? Let's see the alternatives first:

- **Manual Differentiation:** You hard-code it; essentially transcribe
  the math formula on paper to code, case by case. This is
  impossible for deep networks with millions of parameters.
- **Numerical Differentiation:** Using the limit definition of a
  derivative: $$\frac{f(x+h) - f(x)}{h}$$ While simple, this is an
  approximation. This approach is also computationally expensive for
  large models.
- **Symbolic Differentiation:** This is what tools like Mathematica or
  SymPy do. They manipulate algebraic expressions to produce a new
  expression. The problem here is **expression swell** — the resulting
  formula for a deep neural network would be miles long and incredibly
  slow to compute. Automatic Differentiation takes a different
  approach, built on two pillars: 1) Tensor Operation Bookkeeping, and
    2) Chain Rule.

1. **Operation Trace:** As your code runs, PyTorch keep records of
   every
   operation performed on a tensor.

2. **Elementary Derivatives:** Every basic operation has a known,
   hard-coded
   derivative rule. PyTorch knows the derivative of $\sin(x)$
   is $\cos(x)$.

3. **The Chain Rule:** PyTorch applies the **chain rule** to these
   recorded
   steps. If you have $y = f(g(x))$, then:

   $$\frac{df}{dx} = \frac{df}{dg} \cdot \frac{dg}{dx}$$

See an example:

$$ z = x^2 + y^3 $$

Not difficult to have partial derivative to each variable:

$$ \frac{dz}{dx} = 2x $$

$$ \frac{dz}{dy} = 3y $$

### Make Sense of Partial Derivative

To interpret the partial
derivative $\frac{\partial z}{\partial x} = 2x$, think
of it as a measure of **sensitivity** and **influence**.

In a function of multiple variables like $z = f(x, y)$, the partial
derivative
with respect to $x$ tells us exactly how the output ($z$) changes when
we wiggle
$x$ just a tiny bit, while holding $y$ still.

Imagine you have two sliders, one for $x$ and one for $y$.

- The derivative $\frac{\partial z}{\partial x} = 2x$ says: "If you
  move the
  $x$-slider by a tiny amount (let's call it $\Delta x$), the
  output $z$ will
  move by roughly $2x$ times that amount."
- Notice that the "influence" of $x$ also depends on its **magnitude
  **.
    - If $x = 1$, moving $x$ a little bit changes $z$
      by $2 \times 1 = 2$ units.
    - If $x = 10$, moving $x$ a little bit changes $z$
      by $2 \times 10 = 20$
      units.
    - $z$ is much more sensitive to $x$ when $x$ is already large.

## Case Study

```py
# Leaf Tensors
x = torch.tensor(1.0, requires_grad=True)
y = torch.tensor(1.0, requires_grad=True)

x ** 2
# tensor([1.], grad_fn=<PowBackward0>)

x ** 2 + y ** 2
# tensor([2.], grad_fn=<AddBackward0>)

(x ** 2 + y ** 2).backward()

print(f"dz/dx = {x._grad}")
print(f"dz/dy = {y._grad}")
```

### Enable Gradient on Leaf Tensors

```py
x = torch.tensor([1.0, ], requires_grad=True)
y = torch.tensor([1.0, ], requires_grad=True)
```

By default, tensors do not track gradients because it takes memory and
processing power. Setting `requires_grad=True` informs the engine (
autograd) to
start watching every operation performed on these tensors. These are
the Leaf
Tensors (the starting points, individual tensor rather than an
expression).

### Tensor Expression

```py
x ** 2
# tensor([1.], grad_fn=<PowBackward0>)
x ** 2 + y ** 2
# tensor([2.], grad_fn=<AddBackward0>)
```

When tensors form expression, its `grad_fn` records the operator and
its
derivation:

- `x**2` has `grad_fn=<PowBackward0>`: this expression uses Power
  operator.
- `x**2 + y**2` has `grad_fn=<AddBackward0>`: this expression uses
  Addition
  operator.

Each expression forms a DAG of expressions down till Leaf Tensors:

```
        + <AddBackward0>
      /                  \
    ** <PowBackward0>     ** <PowBackward0>
   /  \                  /  \
  x    2                y    2
```

### Trigger an AD Engine Run

```py
(x ** 2 + y ** 2).backward()

# dz/dx = 2
print(f"dz/dx = {x.grad}")
# dz/dy = 3
print(f"dz/dy = {y.grad}")
```

Call `.backward()` on a tensor expression triggers the execution of
the AD
engine. The engine begins to reduce the DAG using the Chain Rule and
eventually
set the `.grad` value on all Leaf Tensors.

### Make Sense of `tensor.grad`

After calling `L.backward()`, where `L` is a tensor expression, a leaf
tensor
`x` get `x.grad == 4`. What does it mean?

**PoV: Influence & Sensitivity**

$\frac{dL}{dx} = 4$ represents a relative high level of positive
influence on
`L` by `x` - about `4x`. In comparison, if $\frac{dL}{dx} = 0.4$, then
`x` is
much less influential to `L`, only `0.4x`.

If $\frac{dL}{dx} = 0$, then `L` is indifferent to `x`, `x` cannot no
longer
influence `L`.

**PoV: Learning & Adjustment**

From the perspective of learning, value of `.grad` decides the
magnitude of
adjustment to a wight on next update.

If `w1.grad == 4`, `w2.grad == 0.4` and `w3.grad == 0`, then `w1` will
be
updated by `4 * lr`, `w2` will be updated by `0.4 * lr`, and `w3` will
not be
updated at all.

In an learning strategy (optimizer) `SGD`:

$$
w_{new} = w_{old} - \text{lr} \cdot w_{grad}
$$

- Positive $w_{grad}$ means `w` is helping increasing the loss, so we
  want to
  decrease `w` to decrease loss.
- Negative $w_{grad}$ means `w` is helping decreasing the loss, so we
  want to
  increase `w` to decrease loss.

### Gradient Accumulation

```py
x = torch.tensor(1.0, requires_grad=True)
y = torch.tensor(1.0, requires_grad=True)

# call expr.backward() multiple times
(x ** 2 + y ** 3).backward()
(x ** 2 + y ** 3).backward()
(x ** 2 + y ** 3).backward()

# it may surprise you to find
print(f"dz/dx = {x.grad}")  # gives 6
print(f"dz/dy = {y.grad}")  # gives 9
```

In PyTorch, the `.grad` attribute is not overwritten every time you
call
`<expr>.backward()`; instead, the new gradients are **added** to
whatever is
already stored there.

This feature can be helpful:

- Large Batch Memory Efficiency: If you have a massive dataset that
  doesn't fit
  in your GPU memory, you can split it into smaller "mini-batches."
  You run
  `.backward()` on each mini-batch to accumulate the gradients, and
  only update
  your weights once at the very end.

- Complex Graphs: In some advanced architectures, you might need to
  sum
  gradients from different parts of the network before taking a step.

To reset `tensor.grad`:

- `tensor.grad.zero_()` method (note the underscore, which means "
  in-place" in
  PyTorch):

```py
x.grad.zero_()
```

- `optimizer.zero_grad()` method to reset all gradients in the
  optimizer:

```py
optimizer.zero_grad()
```
