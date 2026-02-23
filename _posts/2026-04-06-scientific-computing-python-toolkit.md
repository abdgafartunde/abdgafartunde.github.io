---
layout: post
title: "Scientific Computing with Python: The Tools I Actually Use"
description: "A practical overview of the Python ecosystem I rely on for research in computational mathematics, from NumPy and SciPy to mesh generation and visualization."
date: 2026-04-06
author: "Abd'gafar Tunde Tiamiyu"
tags: [Python, Scientific Computing, Tools]
math: false
---

Every researcher develops a personal toolkit over time, a set of libraries, workflows, and habits that accumulate through years of trial and error. When I started my PhD, I spent weeks trying different tools, abandoning some, rediscovering others, and slowly assembling a setup that works for the kind of research I do.

This post is a tour of the Python tools I use daily, written for graduate students or early-career researchers in computational mathematics who are still assembling their own toolkits. These are not necessarily the best tools in any objective sense; they are the ones I have found reliable, well-documented, and suited to inverse problems and PDE-based computation.


## The Foundation: NumPy and SciPy

This barely needs saying, but NumPy and SciPy are the bedrock. Nearly everything else I use is built on top of them.

NumPy handles arrays, linear algebra, and basic operations. Its broadcasting rules take some getting used to, but once internalized, they make vectorized code natural and concise. I use it for matrix operations, data manipulation, and as the interface between different libraries.

SciPy fills in the gaps: sparse matrix operations, optimization, interpolation, integration, special functions, and signal processing. For my work, the sparse linear algebra routines are particularly important. The stiffness matrices in finite element methods are sparse, and SciPy's `sparse.linalg` module provides direct and iterative solvers that handle these efficiently. The `optimize` module covers everything from root-finding to constrained minimization, and I use it regularly for parameter estimation problems.

One practical note: when working with sparse matrices, store them in CSR (Compressed Sparse Row) or CSC (Compressed Sparse Column) format for arithmetic operations, and use COO (Coordinate) format for assembly. Converting between formats is cheap; operating on the wrong format is not.


## PyTorch for Research

I switched from TensorFlow to PyTorch midway through my PhD, and the difference in research productivity was immediate. PyTorch's eager execution model means you can debug with print statements and standard Python tools. The learning curve is shallow if you already know NumPy.

For my work, PyTorch serves two purposes. First, building and training neural networks for learned regularization, physics-informed methods, and neural operators. Second, and less obviously, automatic differentiation for computing sensitivities and Jacobians in optimization problems. PyTorch's `torch.autograd` is not limited to neural network training; it can differentiate any computation graph, which is extremely useful when you need gradients of a complex forward model with respect to its parameters.

I keep most of my research code in plain NumPy/SciPy and bring in PyTorch only when I need GPU acceleration or automatic differentiation. Mixing the two ecosystems requires some care with data types and device management, but `.numpy()` and `torch.from_numpy()` make the conversion straightforward.


## Mesh Generation: Gmsh

For finite element work, you need meshes. Gmsh is the tool I use most, and it has become remarkably powerful over the years. It handles 2D and 3D mesh generation, supports complex geometries through its built-in CAD kernel or via STEP/IGES files, and provides fine-grained control over element sizes.

The Python API (`gmsh` package on PyPI) lets you script everything. I define my geometries programmatically, set mesh size fields to concentrate elements near regions of interest (electrodes, inclusions, boundaries), generate the mesh, and extract the node coordinates and element connectivity as NumPy arrays. This makes the mesh generation fully reproducible and easy to integrate into a computational pipeline.

For quick 2D triangulations, the `triangle` package (a Python wrapper around Jonathan Shewchuk's Triangle library) is simpler and faster. It produces quality triangulations with controllable minimum angles and area constraints. When I need a mesh for a prototype calculation and do not want the overhead of Gmsh, Triangle is my first choice.


## Visualization: Matplotlib and PyVista

Matplotlib is the default plotting library, and for most of my needs, it is sufficient. I use it for convergence plots, error curves, 1D solution profiles, and publication-quality figures. Getting Matplotlib to produce clean figures requires some upfront configuration (font sizes, tick formatting, colour palettes), but once you have a style file that works, you can reuse it across projects.

For 3D visualization of finite element solutions, meshes, and conductivity distributions, I use PyVista. It wraps VTK with a clean Python interface and handles unstructured grids, scalar and vector fields, and interactive 3D views. When I need to show a reconstructed conductivity distribution on an irregular mesh, PyVista renders it with a few lines of code.

I occasionally use Plotly for interactive figures, especially when exploring results with collaborators who prefer to pan, zoom, and rotate rather than look at static images. But for papers and presentations, Matplotlib with carefully chosen colormaps and layouts is my standard.


## FEniCS and Firedrake

For finite element computations that are more complex than what I want to code by hand, I use FEniCS (and sometimes Firedrake). These libraries let you specify the weak form of a PDE in a syntax that closely mirrors the mathematical notation, and they handle the assembly, solving, and postprocessing automatically.

FEniCS is particularly good for prototyping. If I want to test a new regularization strategy that involves solving a nonlinear PDE, I can implement it in FEniCS in an afternoon, run experiments, and get a clear picture of whether the idea works before committing to a hand-tuned implementation.

The trade-off is control. For my core EIT forward solver, where I need tight control over the assembly process, the mesh, and the linear algebra, I use my own finite element code built on NumPy and SciPy. This is more work but gives me the flexibility to exploit problem-specific structure.


## Jupyter Notebooks for Exploration, Scripts for Production

I use Jupyter notebooks for two things: exploratory analysis and communication. When I am trying a new idea, testing a hypothesis, or exploring a dataset, the notebook format is ideal. I can interleave code, plots, and notes, and I can see results immediately.

For anything that needs to run repeatedly, on a cluster, as part of a larger pipeline, or for generating final results, I write Python scripts. Notebooks are difficult to version control, hard to run in batch mode, and prone to hidden state errors (where the output depends on the order in which cells were executed). Scripts avoid all of these issues.

My typical workflow: prototype in a notebook, translate the working code into a script, run the script to generate results, and use a notebook to create the final figures for the paper.


## Version Control and Reproducibility

Every project lives in a Git repository from day one. Code, configuration files, experiment logs, and manuscript drafts all go in version control. When a reviewer asks "can you reproduce Figure 3 with a different parameter?" the answer should always be yes, and it should take minutes, not hours.

I have learned (the hard way) to record the exact parameters used for every numerical experiment. A simple approach: each experiment writes a JSON or YAML file recording the mesh size, regularization parameter, iteration count, random seed, and any other settings. When I come back to a result months later, that file tells me exactly how to reproduce it.

For managing Python environments, I use conda with explicit environment files. Pinning package versions may feel overly cautious, but it prevents the "it worked on my machine six months ago" problem that derails reproducibility.


## Things I Have Tried and Abandoned

**MATLAB.** I used MATLAB extensively during my undergraduate years and early PhD. It is excellent for linear algebra and quick prototyping, and many inverse problems codes are written in it. I gradually switched to Python because the ecosystem is broader, the tools are free, and the integration with deep learning frameworks is native. I still read MATLAB code (much of the EIT community uses it), but I no longer write new projects in it.

**Julia.** I have experimented with Julia and found it impressive for computational speed. The multiple dispatch system is elegant, and packages like DifferentialEquations.jl are state-of-the-art. I have not made the full switch because my existing codebase is in Python, my collaborators use Python, and the ecosystem, while growing rapidly, is still smaller. For someone starting fresh in scientific computing, Julia is a serious option.

**C++ for everything.** Early in my PhD, I tried writing performance-critical code in C++ and calling it from Python. This is powerful but the development cycle is slow. I now use this only when profiling shows that Python is genuinely the bottleneck, which is rarer than you might expect if you write properly vectorized NumPy code.


## Closing Thoughts

The best toolkit is the one you know well and can use productively. Spending weeks evaluating alternatives is useful when you are starting out, but at some point you need to commit to a set of tools and build expertise with them. Depth of knowledge in a few well-chosen tools is more productive than shallow familiarity with many.

That said, the ecosystem changes, and it pays to stay aware of new developments. Neural operator libraries (like the `neuraloperator` package for FNO), differentiable physics simulators, and GPU-accelerated PDE solvers are evolving rapidly. Incorporating new tools when they solve a real problem in your workflow is worthwhile; adopting them because they are fashionable is not.

The tools serve the mathematics, not the other way around.
