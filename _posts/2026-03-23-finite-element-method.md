---
layout: post
title: "The Finite Element Method: Building Solutions Piece by Piece"
description: "An introduction to the finite element method for people who want to understand the ideas before the formalism, with applications to PDEs and inverse problems."
date: 2026-03-23
author: "Abd'gafar Tunde Tiamiyu"
tags: [Numerical Methods, FEM, Mathematics]
math: true
---

If you work in computational mathematics for any length of time, you will encounter the finite element method. It is the workhorse of modern numerical PDE solving, used across structural mechanics, fluid dynamics, electromagnetics, heat transfer, and, in my own field, the forward solver for inverse problems. Its influence is difficult to overstate.

Yet many introductions to the finite element method jump immediately into the formalism: weak forms, Sobolev spaces, interpolation theory. These are important, but they can obscure the core idea, which is geometric and intuitive. This post is an attempt to explain the central insight before the machinery takes over.


## The Problem

We want to solve a partial differential equation. To keep things concrete, consider the Poisson equation on a domain $\Omega \subset \mathbb{R}^2$ with Dirichlet boundary conditions:

$$
-\Delta u = f \quad \text{in } \Omega, \qquad u = 0 \quad \text{on } \partial\Omega.
$$

Here $f$ is a given source term and $u$ is the unknown function we want to find. This equation models steady-state heat conduction, electrostatics, and many other physical phenomena.

For a few special geometries (rectangles, circles, spheres), you can solve this analytically. For anything resembling a real engineering domain, you need a numerical method.


## The Core Idea

The finite element method rests on three ideas, each straightforward on its own.

**First: reformulate the problem.** Instead of solving the differential equation directly, reformulate it as a variational problem. Multiply the equation by a test function $v$ (which vanishes on the boundary), integrate over $\Omega$, and integrate by parts:

$$
\int_\Omega \nabla u \cdot \nabla v \, dx = \int_\Omega f v \, dx \quad \text{for all } v \in V,
$$

where $V = H_0^1(\Omega)$ is the space of functions with square-integrable first derivatives that vanish on $\partial\Omega$. This is the weak formulation.

The weak formulation does two things. It reduces the smoothness required of $u$ (you only need first derivatives, not second) and it provides a natural framework for approximation.

**Second: approximate the space.** Instead of looking for $u$ in the infinite-dimensional space $V$, look for $u_h$ in a finite-dimensional subspace $V_h \subset V$. This subspace is constructed by dividing $\Omega$ into small pieces (elements) and defining basis functions on each piece:

$$
\int_\Omega \nabla u_h \cdot \nabla v_h \, dx = \int_\Omega f v_h \, dx \quad \text{for all } v_h \in V_h.
$$

**Third: reduce to linear algebra.** If $V_h$ has a basis $\{\phi_1, \ldots, \phi_N\}$, then $u_h = \sum_{j=1}^N c_j \phi_j$, and the problem becomes: find the coefficients $c_j$ such that

$$
\sum_{j=1}^N c_j \int_\Omega \nabla \phi_j \cdot \nabla \phi_i \, dx = \int_\Omega f \phi_i \, dx, \quad i = 1, \ldots, N.
$$

In matrix form, this is $K \mathbf{c} = \mathbf{f}$, where $K_{ij} = \int_\Omega \nabla \phi_j \cdot \nabla \phi_i \, dx$ is the stiffness matrix and $f_i = \int_\Omega f \phi_i \, dx$ is the load vector. Solving this linear system gives the approximate solution.


## Meshes and Basis Functions

The subspace $V_h$ is constructed from a mesh. You divide $\Omega$ into triangles (in 2D) or tetrahedra (in 3D), and on each element you define polynomial functions.

The simplest choice is piecewise linear functions on triangles. Each basis function $\phi_i$ is associated with a mesh node $x_i$, equals 1 at that node, equals 0 at all other nodes, and varies linearly on each triangle containing $x_i$. These tent-shaped functions have small support (each one is nonzero only on the triangles touching its node), which makes the stiffness matrix sparse.

Sparsity is crucial. A mesh with $N$ nodes produces an $N \times N$ stiffness matrix, but because each basis function interacts only with its neighbours, the matrix has $O(N)$ nonzero entries rather than $O(N^2)$. This is what makes FEM computationally tractable for large problems. Sparse direct solvers or iterative methods (conjugate gradient, multigrid) can solve the resulting system efficiently.

Higher-order elements (quadratic, cubic polynomials on each triangle) improve accuracy without refining the mesh. The convergence rate for piecewise polynomial elements of degree $p$ on a mesh with element size $h$ is, for a smooth solution:

$$
\lVert u - u_h \rVert_{L^2(\Omega)} = O(h^{p+1}), \qquad \lVert u - u_h \rVert_{H^1(\Omega)} = O(h^p).
$$

This is one of the beautiful results in numerical analysis: the approximation error is controlled entirely by the element size and polynomial degree, and the convergence rate is optimal in a well-defined sense (Céa's lemma guarantees that the FEM solution is the best approximation from $V_h$ in the energy norm).


## Where Things Get Interesting

The basic framework extends in many directions.

**Adaptive refinement.** You do not have to use a uniform mesh. If the solution has steep gradients in one region and is smooth elsewhere, concentrate elements where they are needed. A posteriori error estimators quantify the local error on each element, guiding an adaptive loop: solve, estimate, mark elements with large error, refine, repeat. This is essential for problems with boundary layers, singularities, or moving fronts.

**Mixed and hybrid methods.** For some equations, particularly those involving divergence-free constraints (Stokes flow, electromagnetics), the standard approach fails or produces poor results. Mixed finite element methods introduce additional unknowns (for example, both velocity and pressure in fluid mechanics) and choose function spaces for each that satisfy a compatibility condition called the inf-sup condition. Getting this condition right is crucial. Choosing incompatible pairs leads to spurious oscillations or locking.

**Nonlinear problems.** When the PDE is nonlinear, the stiffness matrix depends on the solution itself. You linearize (typically by Newton's method), solve the linearized problem, update the solution, and repeat. Each Newton step requires assembling a new stiffness matrix and solving a new linear system. The finite element framework handles this naturally, though the computational cost multiplies.

**Time-dependent problems.** For parabolic equations (heat equation) or hyperbolic equations (wave equation), you discretize in space with finite elements and in time with a time-stepping scheme (backward Euler, Crank-Nicolson, Runge-Kutta). The combination produces a sequence of linear systems, one per time step. The choice of time integrator and the CFL condition for stability introduce additional considerations.


## FEM in My Own Work

In EIT research, the finite element method is indispensable. Every evaluation of the forward operator (predicting boundary voltages for a given conductivity) requires solving the complete electrode model, which is an elliptic PDE with nonstandard boundary conditions. This PDE is solved by FEM.

For a single forward solve, this is routine. But in an iterative reconstruction algorithm, you solve the forward problem hundreds or thousands of times, each time with a different conductivity distribution. The stiffness matrix changes at every iteration because the conductivity enters as a coefficient in the PDE. Efficiency here matters enormously: the practical speed of the reconstruction algorithm is often bottlenecked by the forward solver.

This is one reason I appreciate the finite element method as more than a black-box tool. Understanding the assembly process, the sparsity structure, the conditioning of the stiffness matrix, and how these depend on the mesh and the coefficients, directly affects how I design my inversion algorithms. Using FEM intelligently (exploiting structure, reusing factorizations where possible, choosing appropriate element orders) can make the difference between a reconstruction that runs in minutes and one that takes hours.


## Common Pitfalls

Having spent considerable time implementing and debugging finite element codes, here are patterns I have seen cause trouble.

**Ignoring mesh quality.** Not all triangulations are created equal. Elements with very small angles (slivers) lead to poorly conditioned stiffness matrices and inaccurate solutions. Mesh quality metrics (minimum angle, aspect ratio, element regularity) should be monitored. Good mesh generators (Gmsh, Triangle, CGAL) handle this automatically, but it pays to inspect the output.

**Wrong boundary conditions.** Getting boundary conditions right is harder than it looks, especially for Neumann and mixed conditions. A Dirichlet condition modifies the linear system by eliminating degrees of freedom. A Neumann condition adds terms to the load vector. Confusing the two, or applying them on the wrong part of the boundary, produces solutions that satisfy the wrong problem. The code runs without errors, the solution looks plausible, and the answer is wrong.

**Insufficient resolution.** The convergence estimates above assume that $h$ is small enough. For problems with boundary layers or sharp gradients, "small enough" can be very small indeed. A uniform mesh that resolves the smooth parts of the solution may completely miss a thin layer where the solution changes rapidly. Adaptive refinement, guided by error estimators, is the systematic remedy.


## A Tool Worth Understanding Deeply

The finite element method is sometimes treated as a software package: assemble, solve, plot. For many engineering applications, this is sufficient. But for anyone working in computational mathematics, inverse problems, or numerical analysis, understanding FEM at a deeper level (why it works, when it fails, how to extend it) is valuable in ways that go beyond any single application.

The mathematical framework (function spaces, variational formulations, approximation theory, error analysis) is the same framework that underlies finite element methods for elasticity, fluid mechanics, electromagnetics, and many other fields. Learning it once gives you a language for understanding an enormous range of computational methods.

More practically, when something goes wrong with a finite element computation (and something always goes wrong), understanding the theory gives you the tools to diagnose and fix the problem. Is the issue mesh quality, insufficient polynomial degree, a violated stability condition, or a bug in the boundary condition implementation? The theory tells you where to look.

I will write more about specific aspects of FEM in future posts, particularly the complete electrode model for EIT and the interaction between mesh refinement and regularization in inverse problems.
