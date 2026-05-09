+++
date = '2026-05-10T00:35:37+08:00'
title = 'Iteration'
description = """Iteration is an useful feature to 
produce concise and readable code especially when dealing with data processing.
The iterator/iterable style is much more flexible and powerful than the
index-based looping (`for (int i = 0; i < n; ++i){...}`).
"""
tags = ['cpp']
+++

Iteration begins with 2 fundamental concepts: **Iterator** and **Iterable**.

An **Iterator** is an auxiliary object associated with a type that is meant to
produce values - called "**Iterable**".

Most common "**Iterables**" are containers (like `std::vector`, `std::list`,
etc.) and IO stream (like `std::istream`, `std::ostream`).

Think of Iterator as a **generalized pointer** that "points" to an element in
an Iterable and move one element at a time, regardless of how data is actually
structured in the Iterable.

> The **"for-range**" feature since C++11 is built on top of iterators.

## Create Iterators

There is no interface or base class for creating iterators. Instead, C++ relies
on a set of **conventions** that an object must follow to be considered an
iterator.

An object is an iterator if it supports the following operations:

- Dereferencing (`T operator*()`): Producing the value `T` at currently
  "pointed-at" position in an Iterable.
- Incrementing (`It& operator++()`): Advance the pointer positon.
- Comparison (`bool operator!=(It&)`): Checks if two iterators are pointing
  to the same position (essential for loop termination).

## Iteration Protocol: `begin()` and `end()`

> It is a form of "structural typing": **if an object has `begin()` and `end()`,
> it will work with STL algorithms and range-based for loops.**

A type is considered an **Iterable** if it provides the following member functions:

- `begin()`: Returns an Iterator pointing at the first element.
- `end()`: Returns an Iterator that represents the position signifies
  termination.

**When `iter == end()` means iteration is finished.**

## Example: A Counter

A `Counter` type which you can `for-range` loop over it until the set stop number.

```c++
struct CounterIter {
  explicit CounterIter(const int _n) : nn{_n} {}

  // iterator convention
  int operator*() const { return nn; }
  bool operator!=(const CounterIter& y) const { return nn != y.nn; }
  CounterIter& operator++() {
    ++nn;
    return *this;
  }

 private:
  int nn;
};

struct Counter {
  explicit Counter(const int _a, const int _b) : a{_a}, b{_b} {}
  
  // Iteration Protocol
  CounterIter begin() const { return CounterIter{a}; }
  CounterIter end() const { return CounterIter{b}; }

 private:
  int a;
  int b;
};

int main() {
  Counter c{0, 10};
  
  // range-base for loop
  for (int t : c) {
    std::cout << t << " "; // 0, 1, ... , 10
  }

  // Manual way (Less common)
  for (auto it = c.begin(); it != c.end(); ++it) {
    std::cout << *it << " ";
  }
}
```