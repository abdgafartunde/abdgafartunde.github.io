---
layout: post
title: "Full Waveform Inversion: The Mathematics Behind Finding Oil"
description: "How a PDE-constrained optimization problem sits at the heart of modern seismic exploration; solving it is one of the most computationally demanding inverse problems in industry."
date: 2026-07-27
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Geophysics, Scientific Machine Learning, Applied Mathematics]
math: true
---

When a seismic survey vessel crosses the ocean, it tows an array of airguns that fire compressed air into the water at regular intervals. The acoustic waves travel down through the water, penetrate the seafloor, and propagate through kilometers of sediment and rock. Where the rock properties change (at the boundary between a shale layer and a sandstone reservoir, for instance, or beneath a dome of salt), some energy is reflected back. Hydrophones behind the vessel record these reflections as a function of time.

The question the geophysicist wants to answer is the inverse problem: given the recorded waveforms, what are the subsurface rock properties? More precisely, what is the velocity field $v(x)$ that governs how fast acoustic waves travel at each point in the subsurface? The velocity field encodes the lithology (the rock types and their spatial arrangement) and is the primary input for identifying where hydrocarbons might be trapped.

This inverse problem is called **full waveform inversion** (FWI). It is one of the most computationally demanding inverse problems in industrial use, and its mathematical structure is a direct application of the ideas in PDE-constrained optimization and the adjoint method.

## The Forward Problem

The forward model is the acoustic wave equation. For a scalar pressure field $u(x, t)$ driven by a source $f(x, t)$:

$$
\frac{1}{v(x)^2} \frac{\partial^2 u}{\partial t^2} - \nabla^2 u = f(x, t),
$$

with appropriate initial and boundary conditions. Given the velocity model $v(x)$ and the source signature $f$, this PDE can be solved numerically (using finite differences or finite elements) to predict the wavefield $u$ and, by restriction to the receiver locations, the predicted seismograms $u_{\text{pred}}$.

The forward solve is expensive. For a 3D survey, the domain can be tens of kilometers in each direction, the wavefield must be evolved over several seconds of simulated time, and the spatial and temporal discretization must be fine enough to resolve the shortest wavelengths in the source signal. A single forward solve can take minutes on a large compute cluster, and a 3D FWI run requires thousands of forward solves.

## The Inverse Problem

FWI is formulated as a least-squares minimization:

$$
\min_{v} \; \mathcal{J}(v) = \frac{1}{2} \sum_{s} \| u_s(v) - d_s \|^2,
$$

where the sum is over seismic sources $s$, $u_s(v)$ are the predicted seismograms at receiver locations (which depend on $v$ through the wave equation), and $d_s$ are the observed seismograms.

This is a nonlinear, large-scale optimization problem. The state variable (the wavefield) satisfies a PDE that depends on the parameter $v$. Computing the gradient $\nabla_v \mathcal{J}$ by finite differences would require one forward solve per parameter, and $v$ is discretized on a grid with millions of nodes. This is computationally impossible.

The solution is the **adjoint method**. For each source $s$, the gradient can be computed with exactly two PDE solves: the forward solve to compute $u_s(v)$, and the adjoint solve, which propagates the data residual $u_s(v) - d_s$ backward in time through the adjoint wave equation. The gradient contribution from source $s$ is a cross-correlation of the forward wavefield with the adjoint wavefield, integrated over time. The full gradient over all sources can be computed with $2N_s$ PDE solves, regardless of the number of parameters.

This is why the adjoint method is not optional in FWI: it is the only way the computation can be done at all.

## Why It Is Hard

FWI is a highly nonlinear, non-convex optimization problem. The objective function has many local minima, and gradient-based methods will converge to a local minimum that may be geologically meaningless unless the starting model is sufficiently close to the true solution. The "cycle-skipping" problem (where the predicted and observed waveforms are offset by more than half a wavelength, causing the optimization to match the wrong cycle) is one of the central challenges in practical FWI.

A significant research effort over the past decade has gone into alternative misfit functions that are more convex than the $\ell^2$ norm: optimal transport distances (Wasserstein metrics), envelope-based misfits, and waveform-specific distance measures that are less sensitive to phase errors. The choice of misfit function turns out to matter enormously for whether gradient descent converges to a useful solution.

Ill-posedness is also a serious issue. The mapping from velocity model to seismograms is not injective: different velocity models can produce very similar seismograms, particularly when only reflected arrivals are recorded (as is typically the case in marine surveys). Regularization is essential, and the choice of regularizer encodes geological priors: smoothness in the background velocity, sharpness at interfaces, or more structured priors for salt geometries.

## Where This Is Used

**Gulf of Mexico.** Deepwater exploration in the Gulf is dominated by complex salt geology. Large salt domes with irregular geometries create strong velocity contrasts and shadow zones that conventional migration cannot image correctly. FWI with accurate salt flooding and velocity model building is the standard approach for imaging beneath and around these structures. Companies including Shell, BP, and Chevron run industrial-scale FWI workflows on survey areas covering thousands of square kilometers.

**Brazil's pre-salt.** The Santos and Campos basins offshore Brazil contain some of the world's largest deepwater discoveries, located beneath thick layers of evaporites (salt) that make imaging extremely challenging. Petrobras and its partners have invested heavily in FWI-based velocity model building to map these reservoirs. The pre-salt fields are among the most seismically complex environments in which FWI has been applied at scale.

**Canada and the Arctic.** The Canadian oil sands and the Beaufort Sea shelf represent different FWI challenges: land seismic in permafrost environments, and shallow-water marine seismic with near-surface velocity complexities. The Geological Survey of Canada and academic groups at the University of British Columbia have made significant contributions to FWI methodology for these settings.

**European North Sea.** The Norwegian Continental Shelf (managed by Equinor and partners) is one of the most intensively surveyed and studied geological provinces in the world. Norwegian geophysics companies and university research groups (at the University of Bergen, NTNU, and the University of Oslo) have contributed substantially to FWI theory and practice, with a particular focus on elastic FWI (which accounts for both compressional and shear wave propagation) and anisotropy.

## The Machine Learning Connection

Classical FWI is iterative and gradient-based. The emerging research direction combines it with neural networks in several ways:

**Neural network velocity parametrization.** Instead of optimizing $v(x)$ on a grid, parametrize it as the output of a neural network: $v(x) = \mathcal{N}_\theta(x)$. The optimization then runs over the network weights $\theta$. The implicit regularization of neural networks (their bias toward smooth functions) can act as a natural regularizer, and the network can be pretrained on geological databases to encode prior information.

**Physics-informed neural networks for forward modeling.** PINNs can be trained to solve the wave equation for a given velocity model, providing a differentiable forward solver that can be used within a gradient-based inversion loop. This is particularly promising for irregular geometries and multi-physics coupling.

**Deep learning-based inversion.** Train a neural network directly on pairs (seismograms, velocity models) to learn the inverse mapping. This requires large training datasets but can be extremely fast at inference time. The challenge is generalization: a network trained on a particular geological style may fail on a different basin.

Each of these directions is active, and none has yet displaced classical FWI in production workflows. But the combination of adjoint-based optimization with learned components is where much of the frontier research currently sits.

*For code related to seismic inversion and FWI, see the [seismic-inversion-ml GitHub repository](https://github.com/abdgafartunde/seismic-inversion-ml) (to be updated).*
