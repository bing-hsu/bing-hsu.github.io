+++
date = '2026-06-04T22:51:25+08:00'
title = 'Modern Robotics, A Preview'
tags = ['robotics']
description = """A preview of Modern Robotics covering the fundamental building blocks of robot mechanisms: links, joints, and actuators. Explores the anatomy of robots, the role of sensors and mechatronics, and introduces key concepts like configuration space, task space, workspace, and rigid-body motions in three-dimensional space."""
+++

> This is a preview of reading the book: "Modern Robotics: Mechanics, Planning,
> and Control" by Kevin Lynch and Frank

Our focus is on mechanics, planning, and control for **Robot Mechanisms
/ 机器人结构**.

Basically, a mechanism is constructed by connecting rigid bodies, called
**links**, together by means of **joints**, so that relative motion between
adjacent links becomes possible. **Actuation** of the joints, typically by
electric motors, then causes the robot to move and exert forces in desired ways.

<blockquote>

<b>The Anatomy of a Robot</b>

If you look at any robot, it can be broken down into three fundamental building
blocks: **Links**, **Joints**, and **Actuators**.

**1. Links: The Skeleton**

The text refers to links as "rigid bodies." In physics, a **rigid body** is an
idealized object where the distance between any two internal points never
changes. No matter how hard you push it, it won't bend, stretch, or compress.

In reality, all materials flex a little bit. But treating links as perfectly
rigid **makes the mathematics manageable**. If the robot's arm bent like rubber
every time it picked up a cup, calculating its exact position would require
complex fluid-like simulation. Rigid links give us a solid, predictable
geometric framework.

**2. Joints: The Constraint of Motion**

Joints don't just "connect" things; their primary job is to **constrain
motion**, also joint helps cascade force and motion.

A single rigid body floating in space is entirely _unconstrained_—it can move in
any direction. When we connect two links together using a **joint**, we are
deliberately destroying some of that freedom to force a specific type of motion.

**3. Actuators: The Muscles**

Links and joints are passive; they just sit there. **Actuators** ( electric
motors, hydraulic pumps, or pneumatic muscles) are the components that apply
forces or torques to the joints.

When an actuator applies a torque to a revolute joint, it forces the adjacent
links to rotate relative to each other. This relative motion at the joints
cascades through the skeleton, resulting in the overall movement of the robot's
**end-effector** through space.

</blockquote>

Let us examine the current technology behind robot mechanisms:

The links are moved by actuators, which typically are electrically driven but
can also be driven by pneumatic or hydraulic cylinders. In the case of rotating
electric motors, these would ideally be lightweight, operate at relatively low
rotational speeds (e.g., in the range of hundreds of RPM), and be able to
generate large forces and torques. Since most currently available motors operate
at low torques and at up to thousands of RPM, speed reduction and torque
amplification are required. Examples of such transmissions or transformers
include gears, cable drives, belts and pulleys, and chains and sprockets. These
speed-reduction devices should have zero or low slippage and backlash. Brakes
may also be attached to stop the robot quickly or to maintain a stationary
posture.

<blockquote> <b>Mechatronics Engineering / 机械电子学</b>

Mechatronics is the explicit combination of Mechanical engineering, Electrical
engineering, and Computer science.

A robotic joint is fundamentally mechatronic. The motor is electrical, the gears
and links are mechanical, and the micro-controller regulating the current is
digital. In a Mechatronics curriculum, you learn how electrical energy
transforms into mechanical work through an actuator. </blockquote>

Robots are also equipped with **sensors** to measure the motion at the joints.
For both revolute and prismatic joints, encoders, potentiometers, or resolvers
measure the displacement and sometimes tachometers are used to measure velocity.
Forces and torques at the joints or at the end-effector of the robot can be
measured using various types of force–torque sensors. Additional sensors may be
used to help localize objects or the robot itself, such as vision-only cameras,
RGB-D cameras which measure the color (RGB) and depth (D) to each pixel, laser
range finders, and various types of acoustic sensor.

The study of robotics often includes **artificial intelligence** and **computer
perception**, but an essential feature of any robot is that it moves in the
physical world. Therefore, this book, which is intended to support a first
course in robotics for undergraduates and graduate students, focuses on
mechanics, motion planning, and control of robot mechanisms.

<blockquote>

**Sensor Instrumentation & Measurement**

This is a core branch of **Electrical and Mechatronics Engineering**. It focuses
on the physics of **transducers**—devices that take a physical property (like
light, magnetism, or mechanical stretching) and convert it into an electrical
voltage that a computer can read.

**Robotic Perception & Computer Vision**

This field lives primarily within Computer Science and Robotics Engineering. It
focuses on exteroceptive sensors—sensors that measure the world around the robot
rather than the robot itself.

**State Estimation & Sensor Fusion**

This is the mathematical glue, usually taught in advanced robotics or control
systems courses. It deals with a harsh truth: all sensors lie. Encoders slip.
Cameras get blurry when the robot shakes. Laser range finders get confused by
glass mirrors.

You learn the statistical algorithms—like Kalman Filters or Factor Graphs—used
to combine multiple lying sensors to find trustworthy state. If the camera says
the robot moved 5 cm, but the wheel encoder says it moved 10 cm, Sensor Fusion
is the math that decides who to believe.

</blockquote>

## [Configuration Space]()

The **Configuration** of a robot system, which is a specification of **the
position of every point** of the robot.

Since the robot consists of a collection of rigid bodies connected by joints,
our study begins with understanding **the configuration of a rigid body**. We
see that the configuration of a rigid body in the plane can be described using
three variables and the configuration of a rigid body in space can be described
using six variables.

The number of variables is the number of **degrees of freedom (dof)** of the
rigid body. It is also the dimension of the **configuration space**, the space
of all configurations of the body.

A robot arm is typically equipped with a hand or gripper, more generally called
an **end-effector**, which interacts with objects in the surrounding world. To
accomplish a task such as picking up an object, we are concerned with the
configuration of the end-effector, and not necessarily the configuration of the
entire arm. We call the space of positions and orientations of the end-effector
frame the **task space** and note that there is not a one-to-one mapping between
the robot’s configuration space and the task space. The **workspace** is defined
to be the subset of the task space that the end-effector frame can reach.

> Think of it like this:
>
> - The Task Space is the entire blank wall you want to paint.
> - The Workspace is the specific shape of the spray-pattern you can actually
>   reach with your arm while your feet are glued to the floor.
>
> Workspace is a subset of the Task Space: If a box is sitting on a table within
> the Task Space, but the robot's arm is too short to reach it, that box is in
> the task space but outside the workspace.

## [Rigid-Body Motions]()

This chapter addresses the problem of how to **describe mathematically the
motion of a rigid body moving in three-dimensional physical space**.

One convenient way is to attach a reference frame to the rigid body and to
develop a way to quantitatively describe the frame’s position and orientation as
it moves. As a first step, we introduce a 3×3 matrix representation for
describing a frame’s orientation; such a matrix is referred to as a **rotation
matrix**.
