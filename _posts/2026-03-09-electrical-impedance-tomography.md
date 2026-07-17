---
layout: post
title: "Electrical Impedance Tomography: Seeing Through the Body with Mathematics"
description: "How mathematicians and engineers use tiny electrical currents to image the inside of the human body, and why the mathematics behind it is so challenging."
date: 2026-03-09
author: "Abd'gafar Tunde Tiamiyu"
tags: [EIT, Medical Imaging, Inverse Problems]
math: true
---

Electrical impedance tomography uses no ionizing radiation and can provide repeated bedside measurements with portable equipment. Surface electrodes still require skin contact, and the method's spatial resolution is much lower than that of CT or MRI.

Electrical impedance tomography (EIT) injects small alternating currents through surface electrodes and measures the resulting voltages. These boundary data are used to estimate changes or distributions of electrical conductivity inside the body. Conductivity contrasts can reflect ventilation, fluid content, or tissue composition, but an EIT image is not a direct anatomical map.

I have spent most of my research career working on the mathematical and computational challenges of EIT. This post is an attempt to explain the problem, why it is hard, and why it is worth working on despite the difficulty.


## The Physical Setup

Imagine a ring of electrodes placed around a patient's chest. A device applies alternating currents that satisfy its safety and hardware limits, then records voltages on the remaining electrodes. Repeating this process for several current patterns produces a matrix of voltage measurements.

The physics is governed by a generalized Laplace equation. Inside the body, the electric potential $u$ satisfies

$$
\nabla \cdot (\sigma(x) \nabla u(x)) = 0 \quad \text{in } \Omega,
$$

where $\sigma(x)$ is the spatially varying conductivity and $\Omega$ is the cross-section of the body. The boundary conditions are determined by the electrode configuration, and in practice one uses the complete electrode model, which accounts for the finite size of the electrodes and the contact impedance at the electrode-tissue interface.

The forward problem, predicting what voltages you would measure for a known conductivity distribution, is a standard elliptic PDE problem. You discretize $\Omega$ with a finite element mesh, assemble the stiffness matrix, solve the linear system, and read off the boundary voltages. The numerics are well-understood, though the computational cost grows with mesh refinement.

The inverse problem, recovering $\sigma(x)$ from the measured voltages, is where the real challenge lies.


## Why EIT Is So Mathematically Difficult

EIT is a poster child for severe ill-posedness. The difficulty is not merely computational; it is intrinsic to the physics.

The forward map strongly smooths spatial variations in conductivity. Fine features and perturbations far from the electrodes can have only a small effect on boundary voltages. The precise decay depends on the domain, background conductivity, electrode geometry, and spatial frequency of the perturbation; there is no universal depth law of the form $e^{-cd}$.

Under boundedness, regularity, and positivity assumptions on admissible conductivities, stability results for the continuum boundary map have a logarithmic form such as

$$
\lVert \sigma_1 - \sigma_2 \rVert \leq C \left( \log \frac{1}{\varepsilon} \right)^{-\eta},
$$

where $\varepsilon$ denotes an appropriate norm of the difference between boundary maps, and the constants and norms depend on the admissible class. The logarithm expresses severe instability, but this schematic estimate should not be read as a system-independent resolution formula.

EIT resolution depends on the noise level, electrode arrangement, current patterns, reconstruction model, and prior information. Clinical thoracic systems are used primarily for regional and temporal changes, such as changes in ventilation, rather than millimetre-scale anatomical detail.


## The Complete Electrode Model

For any serious computational work in EIT, you need the complete electrode model (CEM), introduced by Cheng, Isaacson, Newell, and Gisser in 1989. The CEM accounts for two physical realities that simpler models ignore: electrodes have finite spatial extent, and there is a thin resistive layer (the contact impedance) between the electrode and the tissue.

The model reads:

$$
\nabla \cdot (\sigma \nabla u) = 0 \quad \text{in } \Omega,
$$

with conditions on each electrode $E_l$:

$$
u + z_l \sigma \frac{\partial u}{\partial \nu} = U_l \quad \text{on } E_l, \qquad l = 1, \ldots, L,
$$

$$
\int_{E_l} \sigma \frac{\partial u}{\partial \nu} \, dS = I_l, \qquad l = 1, \ldots, L,
$$

$$
\sigma \frac{\partial u}{\partial \nu} = 0 \quad \text{on } \partial\Omega \setminus \bigcup_l E_l.
$$

The applied currents must satisfy $\sum_{l=1}^L I_l=0$. Because voltage is determined only up to an additive constant, one also imposes a gauge such as $\sum_{l=1}^L U_l=0$.

Here $U_l$ are the electrode voltages (what we measure), $I_l$ are the injected currents (what we control), $z_l$ are the contact impedances, and $\nu$ is the outward normal. The first boundary condition says the potential on each electrode is constant (because electrodes are conductors) up to a voltage drop across the contact impedance. The second says the total current flowing through each electrode matches the injected current. The third says no current flows through the gaps between electrodes.

The CEM is appropriate when electrode size and contact effects are not negligible. Contact impedances may be calibrated, prescribed, or estimated jointly with $\sigma$, depending on the experiment.


## Reconstruction Approaches

The EIT community has developed a rich ecosystem of reconstruction methods over the past four decades.

**Linearized methods.** If you assume that the conductivity $\sigma$ is close to a known reference $\sigma_0$, the relationship between conductivity perturbation $\delta\sigma$ and voltage perturbation $\delta U$ is approximately linear:

$$
\delta U \approx J \, \delta\sigma,
$$

where $J$ is the Jacobian at $\sigma_0$. Regularized linearized methods can be fast, but their accuracy deteriorates as the neglected nonlinear terms grow relative to noise and modelling error.

**Nonlinear iterative methods.** These solve the full nonlinear problem by iterating. At each step, you compute the forward solution, compare it with measured data, and update $\sigma$ based on the mismatch. Gauss-Newton methods are the most common:

$$
\begin{aligned}
\delta\sigma_k
&=\left(J_k^T\Gamma^{-1}J_k+\alpha R^T R\right)^{-1}
\left[J_k^T\Gamma^{-1}\bigl(U^{\mathrm{meas}}-U(\sigma_k)\bigr)
-\alpha R^T R(\sigma_k-\sigma_{\mathrm{ref}})\right],\\
\sigma_{k+1}&=\sigma_k+s_k\delta\sigma_k,
\end{aligned}
$$

where $\Gamma$ is the voltage-noise covariance, $J_k$ is the Jacobian, the quadratic penalty is $\lVert R(\sigma-\sigma_{\rm ref})\rVert^2$, and $s_k$ is chosen by a line search or trust-region rule. Positivity can be imposed by constraints or a transformed parameterization. Nonlinear iteration can reduce linearization error, but its benefit depends on initialization, noise, and modelling error.

**Direct methods.** These bypass iterative optimization by using analytical structure. D-bar methods construct a nonlinear scattering transform from boundary data and recover a regularized conductivity through a non-iterative reconstruction pipeline. They are one family among several direct methods, and practical implementations must address noise, electrode data, dimension-specific theory, and incomplete boundary coverage.

**Deep learning approaches.** Neural networks trained to map voltage data directly to conductivity images have become increasingly popular. The networks learn the regularization implicitly from training data. Reconstruction is fast (a single forward pass). The challenge is generalization: networks trained on one electrode configuration or one class of conductivity distributions may fail on others. Combining learned components with physics-based models is, in my view, the most promising direction. This is what part of my PhD work focused on.


## Partial Data: My Research Territory

Most EIT theory and many practical systems assume you have electrodes covering the entire boundary. In clinical practice, this is often not the case. You might have access to only one side of the body: the anterior chest wall, or a portion of the skull, or one surface of a limb.

Partial boundary coverage generally reduces sensitivity and available information. Full-data uniqueness theorems hold under dimension-dependent assumptions for continuum boundary maps; finite electrode measurements do not automatically inherit those conclusions. Partial-data uniqueness results also require specific geometric and regularity assumptions. Features far from the accessible boundary can have weak influence on the data.

My PhD work focused on developing inversion frameworks for this setting, combining adaptive primal-dual methods with learned regularizers that encode prior information about the solution. The idea is to compensate for the missing data by incorporating stronger, problem-specific priors, trained from examples of the conductivity distributions you expect to encounter.

This is a difficult balancing act. Too weak a prior, and the partial data problem is hopelessly underdetermined. Too strong, and the reconstruction is dominated by the prior rather than the data. Getting this balance right, and understanding it mathematically, is what keeps me working in this area.


## Clinical Applications

EIT has real clinical applications, though they are more specialized than the flagship imaging modalities.

**Lung monitoring.** Thoracic EIT can display regional changes in ventilation at the bedside and is its most established clinical application. Clinicians and researchers use these measurements to assess ventilation distribution and study ventilator settings. Whether an EIT-guided strategy improves patient outcomes depends on the protocol and remains a clinical-evidence question.

**Brain imaging.** Conductivity changes associated with cerebral events are an active research target. The skull, uncertain geometry, contact effects, and small signal changes make the problem difficult. Stroke detection and ambulance triage should therefore be described as investigational uses, not established diagnostic capabilities.

**Breast imaging.** Researchers have investigated conductivity imaging and multifrequency measurements as possible adjuncts to established breast-imaging methods. Tissue conductivity varies across patients and conditions, so EIT cannot be presented as a validated replacement for mammography or biopsy.

**Process monitoring.** Outside medicine, EIT is used in industrial process tomography: monitoring multiphase flows in pipelines, tracking mixing processes, and imaging the interior of chemical reactors. The measurement geometry is simpler (often a circular pipe) and the conductivity contrasts can be large, making reconstruction more tractable.


## Why I Work on This Problem

People sometimes ask me why I chose such a difficult problem for my research. The honest answer is that the mathematical structure drew me in.

EIT sits at the intersection of PDE theory, inverse problems, numerical analysis, and increasingly machine learning. The forward problem requires solving elliptic PDEs. The inverse problem requires regularization theory. The partial data setting requires understanding what information is and is not contained in the measurements. And the push toward real-time reconstruction increasingly involves neural networks and GPU computing.

There is also something satisfying about working on a problem where the mathematical difficulty has direct physical consequences. The logarithmic stability estimate is not an abstract curiosity; it tells you exactly why your reconstructions look blurry and what you can and cannot hope to improve. The mathematics is honest: it tells you the limits of what is achievable, and then asks you to be clever within those limits.

EIT will probably never match CT or MRI in spatial resolution. But it offers something those modalities cannot: continuous, real-time, bedside monitoring at low cost. For the right clinical applications, those advantages matter more than raw image quality. Making the most of the information that EIT data contains, that is the mathematical challenge, and it is far from solved.
