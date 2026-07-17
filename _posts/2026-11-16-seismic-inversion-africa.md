---
layout: post
title: "Seismic Inversion and the Mathematics of Oil Exploration in Africa"
description: "Nigeria reported 37.01 billion barrels of oil and condensate reserves at the start of 2026. Seismic inversion helps characterize the subsurface structures associated with those resources."
date: 2026-11-16
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Geophysics, Scientific Machine Learning, Applied Mathematics]
math: true
---

In March 2026, Nigeria's upstream regulator announced an agreement with SeaSeis Geophysical and TGS for a seismic and gravity-data project covering 11,700 square kilometres of the deep-water eastern Niger Delta. From a computational mathematics perspective, the project represents a large inverse problem in a geologically complex environment.

This post is about the mathematics behind that kind of survey: what seismic inversion is, why it is hard, and why it matters in the African context in ways that go beyond what is usually written about in mathematics journals.

## The Oil and Gas Landscape in Africa

Africa holds substantial hydrocarbon reserves. Nigeria's regulator reported 37.01 billion barrels of oil and condensate reserves as of 1 January 2026. Production rankings vary over time and should not be inferred from reserve volume. Angola, Algeria, Libya, and Mozambique also have major petroleum or natural-gas resources, and exploration continues across the Gulf of Guinea.

Finding and characterizing these resources requires expensive acquisition, large computing systems, and specialized geophysical expertise. Nigerian companies and universities participate in acquisition, processing, and interpretation, while international service companies remain important partners in advanced workflows. Building more local capacity would allow a larger share of the technical work, training, and research to remain within the region.

This is the applied context in which the mathematics of seismic inversion sits.

## The Forward Problem: Wave Propagation

The physics of seismic exploration is the physics of wave propagation. A source (historically dynamite on land, an airgun array at sea) sends acoustic energy into the subsurface. The waves propagate through the Earth, refract and reflect at interfaces where rock properties change, and return to the surface where an array of receivers records them as time-series of particle velocity or pressure.

The forward model is the acoustic wave equation:

$$
\frac{1}{v(x)^2} \frac{\partial^2 u}{\partial t^2} - \nabla^2 u = f(x, t),
$$

where $v(x)$ is the compressional wave velocity at position $x$ (the quantity we want to find), $u(x,t)$ is the pressure wavefield, and $f$ is the source term. Given $v(x)$, solving this PDE for $u$ and evaluating it at receiver positions gives the predicted seismograms.

In the Niger Delta, thick mobile shales, growth faults, shale diapirs, detachment folds, and deep-water fold-and-thrust structures create complex imaging targets. These are shale-tectonic structures, not the evaporite salt bodies familiar from the Gulf of Mexico or offshore Angola. Shallow gas and incomplete illumination can further degrade deeper reflections.

## The Inverse Problem: Recovering Velocity

Full waveform inversion (FWI) solves the inverse problem: given observed seismograms $d_{\text{obs}}$, find the velocity model $v(x)$ that minimises the misfit between predicted and observed data:

$$
\min_{v} \; \mathcal{J}(v) = \frac{1}{2} \sum_s \| P_su_s(v) - d_s \|^2 + \alpha R(v),
$$

where $u_s(v)$ is the simulated wavefield, $P_s$ samples it at the receivers, $d_s$ is the observed data, and $R(v)$ is a regularisation term.

The gradient of $\mathcal{J}$ with respect to $v$ is computed via the adjoint method, the subject of an earlier post. Each gradient evaluation requires two wave equation solves per source: one forward and one adjoint. For a 3D survey with thousands of sources and a velocity model discretised on a grid with millions of nodes, this is one of the largest routine computational problems in applied science.

**Why it is hard in the Niger Delta.** The objective function for FWI is notoriously non-convex. Gradient descent can converge to a local minimum (a velocity model that fits the data but is geologically wrong) if the initial model is not close to the truth. This "cycle-skipping" problem, where the predicted and observed waveforms are offset by more than half a wavelength, is particularly severe in complex geology where the initial velocity model is uncertain. Shallow gas clouds in the Niger Delta complicate matters further: they attenuate the signal and make the first-arrival picks that are used to build the initial model unreliable.

**The regularisation question.** Geological information can constrain broad velocity trends, stratigraphic structure, faults, and the geometry of mobile-shale bodies. Encoding such information through parametrization, bounds, structural regularisation, or joint interpretation is a non-trivial modelling choice. Hard constraints do not automatically make the optimization intractable, but poorly chosen constraints can bias the recovered model.

**Scientific machine learning approaches.** The current research frontier combines classical FWI with data-driven components. Neural network velocity parametrisations, surrogate forward models, and learned misfit functions that are less susceptible to cycle-skipping are all active research directions. The training data challenge is real: well-labelled pairs of velocity models and seismograms from real surveys are commercially sensitive and not publicly available. Approaches that can generalise from synthetic training data to real survey data are therefore of particular practical importance.

## Building Technical Capacity in Africa

Beyond the immediate computational problem, there is a structural issue worth naming directly.

Nigeria remains a major oil producer, although monthly production varies. Seismic processing, depth migration, and velocity-model building are technically demanding, high-value activities. Some work is performed locally and some through international service centres; public data do not support a precise claim about the share completed inside or outside Nigeria.

The Petroleum Technology Development Fund supports training in petroleum technology, and Nigerian geoscience companies and universities participate in the sector. The 2026 SeaSeis and TGS agreement is one concrete example of a Nigerian company taking a formal role in a large data project.

FWI and advanced velocity-model building require expertise in numerical PDEs, large-scale optimisation, scientific computing, and geophysics. Expanding this capacity requires more than individual overseas training; it also requires courses, computational resources, research groups, data access, and sustained collaboration within African institutions.

This is the long-term applied mathematics problem that I find more interesting than any individual algorithm. The algorithms are hard, but the institutional gap is the harder constraint.

## What the Mathematics Needs

From a technical standpoint, African contexts present specific challenges that the standard seismic inversion literature does not fully address:

**Limited acquisition geometries.** Deepwater surveys in the Niger Delta have good data quality but expensive acquisition. Onshore surveys in the Niger Delta and other African provinces face logistics challenges (jungle, swamps, community access) that result in irregular, incomplete acquisition geometries. Reconstruction from irregular sampling and partial data is a harder inverse problem than the standard marine acquisition case.

**Computational constraints.** Industrial three-dimensional FWI can require large clusters and substantial data movement. Useful research directions include reduced experimental domains, source encoding, multiscale methods, mixed precision, efficient checkpointing, and carefully designed public benchmarks that can run on smaller systems. Cloud computing can help, but cost and data-transfer requirements remain constraints.

**Validation without ground truth.** The standard validation for a velocity model is comparison with well logs from drilled wells. In frontier exploration areas (and Africa has many), there are few wells and the ground truth for validating any inversion result is limited. Uncertainty quantification for the inverse problem (characterising not just the best-fit velocity model but the range of models consistent with the data) is therefore practically important.

These are not uniquely African problems, but they are problems for which the African context provides urgency and specificity that motivates better mathematical work.

*For seismic inversion implementations, see the [seismic-inversion-ml GitHub repository](https://github.com/abdgafartunde/seismic-inversion-ml) (to be updated).*

Sources: the [NUPRC announcement of the PEL 5 agreement](https://www.nuprc.gov.ng/media/news/b4d787a34e0927235867868e), the [NUPRC reserves position at 1 January 2026](https://www.nuprc.gov.ng/media/news/5fa3f1a3c8223aa7c4dc4a39), Spina's 2025 study of [shale tectonics across the Niger Delta](https://doi.org/10.1029/2024TC008689), and the [OpenFWI benchmark paper](https://proceedings.neurips.cc/paper_files/paper/2022/hash/27d3ef263c7cb8d542c4f9815a49b69b-Abstract-Datasets_and_Benchmarks.html).
