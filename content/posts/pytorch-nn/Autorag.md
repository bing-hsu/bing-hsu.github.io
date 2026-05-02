+++
date = '2026-05-02T18:18:00+0800'
title = 'Autorag in PyTorch'
draft = false
math = true
+++

The `torch.autograd` package is PyTorch's automatic differentiation
library.

What does it to be "*Automatic*"? Let's see some alternatives:

- **Manual Differentiation:** You hard-code it. Essentially transcribe
  the math formula on paper to code, case by case. This is
  impossible for deep networks with millions of parameters.
- **Numerical Differentiation:** Using the limit definition of a
  derivative: $$\frac{f(x+h) - f(x)}{h}$$ While simple, this is an
  approximation. This approach is also computationally expensive for
  large models.
- **Symbolic Differentiation:** This is what tools like Mathematica or
  SymPy do. They use algebraic rule to reduce expressions into simpler
  form to evaluate them . The problem here is **expression swell** —
  the resulting formula for a deep neural network would be miles long
  and incredibly slow to compute.

Automatic Differentiation takes a different approach, built on two
pillars: 1) Tensor Operation Bookkeeping, and 2) Chain Rule.

1. **Tensor Operation Bookkeeping:** As your code runs, PyTorch keep
   records of every operation performed on a tensor.

2. **Elementary Derivatives:** Every basic operation has a known,
   hard-coded derivative rule. PyTorch knows the derivative
   of $\sin(x)$ is $\cos(x)$.

3. **The Chain Rule:** PyTorch applies the **chain rule** to these
   recorded
   steps. If you have $y = f(g(x))$,
   then: $\frac{df}{dx} = \frac{df}{dg} \cdot \frac{dg}{dx}$

## Make Sense of _Partial Derivative_

See an example:

$$ z = x^2 + y^3 $$

Not difficult to have partial derivative to each variable:

$$ \frac{\partial z}{\partial x} = 2x $$

$$ \frac{\partial z}{\partial y} = 3y $$

What is the meaning of the partial
derivative $\frac{\partial z}{\partial x} = 2x$? The trick is to think
of partial derivative as a measure of *sensitivity* and *influence*.

In a function of multiple variables like $z = f(x, y)$, the partial
derivative with respect to $x$ tells us exactly how $z$ changes when
we wiggle $x$ just a tiny bit, while holding $y$ still.

With this perspective, we have two insights:

1) The derivative $\frac{\partial z}{\partial x} = 2x$ says: "If you
   move the $x$ by a tiny amount, the $z$ will move by roughly $2x$
   times that amount."
2) The "amount of influence" of $x$ depends on its *magnitude*.
    - If $x = 1$, moving $x$ one unit changes $z$
      by $2 \times 1 = 2$ units.
    - If $x = 10$, moving $x$ ont unit changes $z$
      by $2 \times 10 = 20$ units.
    - $z$ is much more sensitive to $x$ when $x$ is already large.

## PyTorch Code Example

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

These are the Leaf Tensors (tensor primitive, not an expression).

By default, tensors do not track gradients because it takes extra
memory and processing power. Setting `requires_grad=True` informs the
engine to start watching every operation performed on these tensors.

### Form Tensor Expression using Operators

```py
x ** 2
# tensor([1.], grad_fn=<PowBackward0>)
x ** 2 + y ** 2
# tensor([2.], grad_fn=<AddBackward0>)
```

When tensors form expression, its `grad_fn` records the operator.

- `x**2` has `grad_fn=<PowBackward0>`: this expression uses Power
  operator.
- `x**2 + y**2` has `grad_fn=<AddBackward0>`: this expression uses
  Addition operator.

Each expression forms a DAG of expressions down till Leaf Tensors:

```
        + <AddBackward0>
      /                  \
    ** <PowBackward0>     ** <PowBackward0>
   /  \                  /  \
  x    2                y    2
```

### Trigger an Automatic Differentiation (AD) Engine Run

```py
(x ** 2 + y ** 2).backward()

# dz/dx = 2
print(f"dz/dx = {x.grad}")
# dz/dy = 3
print(f"dz/dy = {y.grad}")
```

Calling `<expr>.backward()` triggers the execution of the AD engine.
The engine begins to reduce the DAG using the Chain Rule and
eventually set the `<tensor>.grad` value on all Leaf Tensors.

### Make Sense of `<tensor>.grad`

After calling `L.backward()`, where `L` is a tensor expression, a leaf
tensor `x` get `x.grad` set to `4`. Let's try to make sense of it from
the perspective of partial derivative
(see [Make Sense of Partial Derivative](#make-sense-of-_partial-derivative_))

#### Influence & Sensitivity

$\frac{\partial L}{\partial x} = 4$ represents a relative high level of
positive influence on $L$ by $x$ - about `4x`.

In comparison, if $\frac{\partial L}{\partial x} = 0.4$, then $x$ is much less
influential, only `0.4x`.

If $\frac{\partial L}{\partial x} = 0$, then $L$ is indifferent to
$x$ - $x$ cannot no longer influence $L$.

#### Learning & Adjustment

From the perspective of learning, the value of `.grad` decides the magnitude of
adjustment to a wight on the next update.

If `w1.grad == 4`, `w2.grad == 0.4` and `w3.grad == 0`, then `w1` will
be updated by `4 * lr`, `w2` will be updated by `0.4 * lr`, and `w3` will
not be updated at all.

In the learning strategy `SGD` (Stochastic Gradient Descent):

$$
w_{new} = w_{old} - \text{lr} \cdot w_{grad}
$$

- Positive $w_{grad}$ means the weight `w` is helping increase the loss, to
  decrease loss, we decrease `w` by $\text{lr} \cdot w_{grad}$.
- Negative $w_{grad}$ means the weight `w` is helping decrease the loss, to
  decrease loss, we increase `w` by $\text{lr} \cdot w_{grad}$.

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
call `<expr>.backward()`; instead, the new gradients are **added** to
whatever is already stored there.

This feature can be helpful:

- Large Batch Memory Efficiency: If you have a massive dataset that
  doesn't fit in your GPU memory, you can split it into smaller "mini-batches."
  You run `.backward()` on each mini-batch to accumulate the gradients, and
  only update your weights once at the very end.
- Complex Graphs: In some advanced architectures, you might need to
  sum gradients from different parts of the network before taking a step.

To reset `tensor.grad`:

- `tensor.grad.zero_()` method (note the underscore, which a convention 
that implies "in-place" operations in PyTorch):

```py
x.grad.zero_()
```

- `optimizer.zero_grad()` method to reset all gradients in the
  optimizer:

```py
optimizer.zero_grad()
```
