+++
date = '2026-05-10T00:13:47+08:00'
title = 'Interface in C++'
description = """Interface in C++ looks pretty weird...
if you come from Java/C# background. Let's see how it works in C++.
"""
tags = ['cpp']
+++

Surprisingly without surprise, C++ has no dedicated `interface` keyword.

Instead, the faculty of **interface** in C++ is implemented using `class`, specifically, **Pure
Virtual Class** that contains **Pure Virtual Functions**.

```c++
// Interface
// 1) declare a class
class Shape {
public:
    // 2) `virtual T fn() = 0`: Pure Virtual Function
    //
    //    - `virtual` function allows "override" by subclass.
    //    - `= 0` part strip it off any implementation, causing 
    //       "override" mandatory for any subclass that want to 
    //       be instantiable.
    //
    //    You cannot instantiate a class contains a pure virtual 
    //    function, thanks to the `= 0` part, any instantiable
    //    subclass must provide concrete implementation.
    virtual double getArea() const = 0;
    virtual void draw() = 0;

    // 3) Virtual destructor
    //    You need this to bridge destructor call into the concrete
    //    type's destructor, see later
    virtual ~Shape() {}
};


// A Class implement the Interface
// 1) Subclass the interface
class Circle: public Shape {
public:
    Circle(double r) : radius(r) {}

    // 2) `override` keyword
    //    helps the compiler catch signature mismatches
    double getArea() const override { return 3.14159 * radius * radius; }
    // 3) `final` keywoard prevents further override by 
    //    subclass, this is optional
    void draw() final { std::cout << "Drawing a circle." << std::endl; }
    
private:
    double radius;
};


// Usage
int main() {
    // Why a pointer? See later...
    Shape* myShape = new Circle(5.0);
    myShape->draw();
    delete myShape;
    return 0;
}
```

# Using Interface in C++

First thing, you cannot do this:

```c++
Shape s = Circle{1};
```

The fundamental rule is: **You cannot instantiate an abstract class (class
contains _Pure Virtual Function_)**.

> Virtual Function vs "Pure" Virtual Function
>
> ```c++
> // The culprit is actually the `= 0` part, not the `virual` keyword.
> class T {
>   public:
>   virtual foo() {}    // "virtual" keyword allow "override" by subclass,
>                       // but it won't forbid instantiation
>   virtual bar() = 0;  // if this line appears, you cannot instantiate T,
>                       // as the compiler doesn't know how to do about bar()
> }
> ```

Up on the line `Shape s`, allocation kicks in. The compiler attempts to allocate
memory for a `Shape` and call the constructor. But `Shape` contains "pure
virtual method" -  non-deterministic memory requirement - therefore
allocation is impossible.

**Interface type can only exist in these forms**:

- Pointer: `Shape*`
- Reference: `Shape&`
- Smart Pointer: `std::unique_ptr<Shape>`

With above rules in mind, you would expect common usage of interface types.

1. as Class Member (owned version (`std::unique_ptr<T>`), or non-owned version
   (`Shape* / Shape&`))
2. as Function/Method Argument (`fn(T& t)`)

**Example**

```c++
class IShape {
 public:
  virtual double area() const = 0;
  
  // you need this to bridge polymorphic destructor call into concrete type
  // in code signature, you work with an variable of type IShape& on paper, 
  // but you actually want to invoke the destructor on the concrete type.
  virtual ~IShape() { printf("IShape destructor called\n"); }
};

// public vs private inheritance, another topic
class Circle : public IShape {
 public:
  Circle(float _r) : radius{_r} {}
  double area() const override { return 3.14159f * radius * radius; }
  
  // concrete type's destructor. when the compiler calls
  // `delete IShape&`, this method is triggerd 
  ~Circle() { printf("Circle destructor called\n"); }
  
 private:
  float radius;
};

// Polymorphic class member
class ShapeReporter {
 public:
  ShapeReporter(IShape& _s) : s{_s} {}
  void report() { printf("Area: %.2f\n", s.area()); }
 private:
  IShape& s;
};

// Polymorphic function
void report_area(IShape& s) { printf("Area: %.2f\n", s.area()); }

int main(int argc, char const* argv[]) {
  {
    std::unique_ptr<IShape> c = std::make_unique<Circle>(2);
    report_area(*c);

    // use as a class member
    ShapeReporter sr{*c};
    sr.report();
  }

  {
    IShape* c = new Circle{3};
    report_area(*c);
    ShapeReporter sr{*c};
    sr.report();
    // if IShape does not have a virtual destructor
    // delete expr won't call concrete type's destructor even it has one
    // you can verify this by comment out IShape's destructor while keep
    // Circle's destructor
    delete c;
  }

  return 0;
}
```
