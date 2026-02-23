---
layout: post
title: "Electrical Impedance Tomography: Seeing Through the Body with Mathematics"
description: "How mathematicians and engineers use tiny electrical currents to image the inside of the human body, and why the mathematics behind it is so challenging."
date: 2026-03-09
author: "Abd'gafar Tunde Tiamiyu"
tags: [EIT, Medical Imaging, Inverse Problems]
math: true
---

There is a form of medical imaging that uses no radiation, requires no expensive magnets, and can be performed continuously at the bedside. It is portable, inexpensive, and completely non-invasive. The catch is that the mathematics behind it is extraordinarily difficult.

Electrical impedance tomography (EIT) works by injecting small alternating currents through electrodes placed on the body's surface and measuring the resulting voltages. From these boundary measurements, you try to reconstruct the electrical conductivity distribution inside the body. Different tissues (lung, heart, bone, tumour, blood) have different conductivities, so in principle, a conductivity map reveals the internal anatomy.

I have spent most of my research career working on the mathematical and computational challenges of EIT. This post is an attempt to explain the problem, why it is hard, and why it is worth working on despite the difficulty.


## The Physical Setup

Imagine a ring of 16 or 32 electrodes placed around a patient's chest. You inject a small alternating current (typically a few milliamps at around 50 kHz) through a pair of electrodes and measure the voltages on all the others. Then you rotate the injection pattern: inject through a different pair, measure again. After cycling through all the patterns, you have a matrix of voltage measurements.

The physics is governed by a generalized Laplace equation. Inside the body, the electric potential $u$ satisfies

$$
\nabla \cdot (\sigma(x) \nabla u(x)) = 0 \quad \text{in } \Omega,
$$

where $\sigma(x)$ is the spatially varying conductivity and $\Omega$ is the cross-section of the body. The boundary conditions are determined by the electrode configuration, and in practice one uses the complete electrode model, which accounts for the finite size of the electrodes and the contact impedance at the electrode-tissue interface.

The forward problem, predicting what voltages you would measure for a known conductivity distribution, is a standard elliptic PDE problem. You discretize $\Omega$ with a finite element mesh, assemble the stiffness matrix, solve the linear system, and read off the boundary voltages. The numerics are well-understood, though the computational cost grows with mesh refinement.

The inverse problem, recovering $\sigma(x)$ from the measured voltages, is where the real challenge lies.


## Why EIT Is So Mathematically Difficult

EIT is a poster child for severe ill-posedness. The difficulty is not merely computational; it is intrinsic to the physics.

The fundamental issue is that the forward operator acts as a severe low-pass filter. High-frequency features of the conductivity (small inclusions, fine details, sharp boundaries deep inside the body) have an exponentially small effect on the boundary voltages. The sensitivity of boundary measurements to internal perturbations decays roughly as $e^{-c \cdot d}$ where $d$ is the depth of the perturbation. This means that features near the boundary are relatively easy to reconstruct, while features deep inside the domain are nearly invisible to the measurements.

The mathematical statement of this instability, due to Alessandrini, establishes a logarithmic stability estimate:

$$
\lVert \sigma_1 - \sigma_2 \rVert \leq C \left( \log \frac{1}{\varepsilon} \right)^{-\eta},
$$

where $\varepsilon$ is the data error. This is about as bad as stability estimates get. It means that to gain one additional digit of accuracy in the reconstruction, you need exponentially more accurate data. For comparison, problems with polynomial stability only require polynomially better data.

The practical consequence is sobering. The spatial resolution achievable by EIT, even with perfect algorithms, is fundamentally limited by the noise level. Typical clinical EIT systems achieve spatial resolution on the order of 10-15% of the domain diameter. You will not see millimetre-scale features. You can, however, see changes: a lung filling with fluid, a region of tissue changing conductivity over time, or a large anomaly appearing where none existed before.


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

Here $U_l$ are the electrode voltages (what we measure), $I_l$ are the injected currents (what we control), $z_l$ are the contact impedances, and $\nu$ is the outward normal. The first boundary condition says the potential on each electrode is constant (because electrodes are conductors) up to a voltage drop across the contact impedance. The second says the total current flowing through each electrode matches the injected current. The third says no current flows through the gaps between electrodes.

Getting the CEM right is essential for accuracy. I have seen reconstructions degrade dramatically when a simpler boundary model is used in its place. The contact impedances $z_l$ are often unknown and must be estimated together with $\sigma$, adding extra unknowns to an already underdetermined problem.


## Reconstruction Approaches

The EIT community has developed a rich ecosystem of reconstruction methods over the past four decades.

**Linearized methods.** If you assume that the conductivity $\sigma$ is close to a known reference $\sigma_0$, the relationship between conductivity perturbation $\delta\sigma$ and voltage perturbation $\delta U$ is approximately linear:

$$
\delta U \approx J \, \delta\sigma,
$$

where $J$ is the Jacobian (or sensitivity matrix), computed by solving the forward problem for $\sigma_0$. You then solve this linear system with regularization (typically Tikhonov or TV). This is fast, often running in real time, but the linearization limits accuracy when $\sigma$ deviates significantly from $\sigma_0$.

**Nonlinear iterative methods.** These solve the full nonlinear problem by iterating. At each step, you compute the forward solution, compare it with measured data, and update $\sigma$ based on the mismatch. Gauss-Newton methods are the most common:

$$
\sigma_{k+1} = \sigma_k + \left( J_k^T J_k + \alpha R \right)^{-1} J_k^T (U^{\text{meas}} - U(\sigma_k)),
$$

where $J_k$ is the Jacobian at $\sigma_k$ and $R$ is a regularization matrix. The forward problem must be solved at each iteration, making this computationally expensive. But the reconstructions can be significantly better than linearized methods, especially for large contrasts.

**Direct methods.** These bypass iterative optimization entirely, using special analytical structures. The D-bar method, developed by Nachman, Siltanen, Mueller, and others, is based on the mathematical theory of the Calderón problem and constructs a nonlinear Fourier transform of the conductivity directly from the data. The method has a beautiful theoretical foundation and is unique in providing a non-iterative, nonlinear reconstruction algorithm. Its practical limitation is sensitivity to noise and difficulty handling partial data.

**Deep learning approaches.** Neural networks trained to map voltage data directly to conductivity images have become increasingly popular. The networks learn the regularization implicitly from training data. Reconstruction is fast (a single forward pass). The challenge is generalization: networks trained on one electrode configuration or one class of conductivity distributions may fail on others. Combining learned components with physics-based models is, in my view, the most promising direction. This is what part of my PhD work focused on.


## Partial Data: My Research Territory

Most EIT theory and many practical systems assume you have electrodes covering the entire boundary. In clinical practice, this is often not the case. You might have access to only one side of the body: the anterior chest wall, or a portion of the skull, or one surface of a limb.

The partial data problem is significantly harder. With full boundary data, uniqueness theorems guarantee that the conductivity is determined (at least in principle) by sufficiently many measurements. With partial data, the uniqueness theory is much less complete, and the ill-posedness is even more severe. Features on the far side of the domain, away from the electrodes, contribute almost nothing to the measurements.

My PhD work focused on developing inversion frameworks for this setting, combining adaptive primal-dual methods with learned regularizers that encode prior information about the solution. The idea is to compensate for the missing data by incorporating stronger, problem-specific priors, trained from examples of the conductivity distributions you expect to encounter.

This is a difficult balancing act. Too weak a prior, and the partial data problem is hopelessly underdetermined. Too strong, and the reconstruction is dominated by the prior rather than the data. Getting this balance right, and understanding it mathematically, is what keeps me working in this area.


## Clinical Applications

EIT has real clinical applications, though they are more specialized than the flagship imaging modalities.

**Lung monitoring.** This is EIT's most established clinical use. Because air and tissue have very different conductivities, EIT can track lung ventilation in real time. It is used in intensive care to optimize mechanical ventilation settings, helping clinicians distribute air evenly across the lungs and avoid ventilator-induced lung injury. Several commercial EIT systems (Dräger PulmoVista, SenTec LuMon) are in clinical use for this purpose.

**Brain imaging.** EIT can detect hemorrhagic stroke by identifying regions of altered conductivity in the brain. The skull presents significant challenges (bone has very low conductivity, creating a barrier to current flow), but work at University College London and elsewhere has produced promising results. The speed and portability of EIT could make it valuable for stroke triage in ambulances.

**Breast imaging.** Breast tumours typically have higher conductivity than surrounding tissue. EIT-based breast imaging has been explored as a complement to mammography, offering the advantages of no radiation exposure and lower cost. Multi-frequency measurements add spectral information that helps distinguish tissue types.

**Process monitoring.** Outside medicine, EIT is used in industrial process tomography: monitoring multiphase flows in pipelines, tracking mixing processes, and imaging the interior of chemical reactors. The measurement geometry is simpler (often a circular pipe) and the conductivity contrasts can be large, making reconstruction more tractable.


## Why I Work on This Problem

People sometimes ask me why I chose such a difficult problem for my research. The honest answer is that the mathematical structure drew me in.

EIT sits at the intersection of PDE theory, inverse problems, numerical analysis, and increasingly machine learning. The forward problem requires solving elliptic PDEs. The inverse problem requires regularization theory. The partial data setting requires understanding what information is and is not contained in the measurements. And the push toward real-time reconstruction increasingly involves neural networks and GPU computing.

There is also something satisfying about working on a problem where the mathematical difficulty has direct physical consequences. The logarithmic stability estimate is not an abstract curiosity; it tells you exactly why your reconstructions look blurry and what you can and cannot hope to improve. The mathematics is honest: it tells you the limits of what is achievable, and then asks you to be clever within those limits.

EIT will probably never match CT or MRI in spatial resolution. But it offers something those modalities cannot: continuous, real-time, bedside monitoring at low cost. For the right clinical applications, those advantages matter more than raw image quality. Making the most of the information that EIT data contains, that is the mathematical challenge, and it is far from solved.
