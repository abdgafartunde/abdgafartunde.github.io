---
layout: post
title: "Finding Water Underground: Geophysical Inverse Problems and the Global Groundwater Crisis"
description: "How electrical resistivity tomography turns surface measurements into subsurface maps, and why solving this inverse problem more cheaply could matter for billions of people."
date: 2026-10-19
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Geophysics, Applied Mathematics, Water]
math: true
---

There is a reasonable probability that the water you drank today came from underground. Approximately two billion people worldwide rely on groundwater as their primary drinking water source. In rural South Asia (India, Bangladesh, Pakistan), it is the dominant source for both drinking and irrigation. In China's North China Plain, one of the world's most intensively farmed regions, groundwater depletion from decades of extraction for agriculture is measurable from space: NASA's GRACE satellites have documented falling water tables across aquifer systems that support hundreds of millions of people. In the Middle East and North Africa, where rainfall is low and rivers are scarce, groundwater is not an alternative to surface water; it is all there is.

Finding groundwater, mapping its extent, and understanding its quality is a geophysical inverse problem. The mathematical structure is closely related to the inverse problem I work on in EIT. The difference is scale, medium, and application, but the core mathematics is the same: recovering subsurface electrical conductivity from surface measurements of electric potential.

## The Forward Problem

In electrical resistivity tomography (ERT, the standard geophysical method for groundwater exploration), current is injected into the ground through two surface electrodes and the resulting electric potential is measured at other electrode positions. The forward model is the elliptic PDE

$$
-\nabla \cdot (\sigma(x) \nabla u) = f,
$$

where $\sigma(x)$ is the electrical conductivity of the subsurface (or equivalently, the inverse of the resistivity $\rho = 1/\sigma$), $u(x)$ is the electric potential, and $f$ represents the injected current sources. This is the same PDE that governs EIT in medical imaging; the domain is the Earth's subsurface rather than a patient's thorax, and the electrodes are at the surface rather than around a cross-section, but the mathematical structure is identical.

Different rock and soil materials have characteristic electrical resistivities:
- Dry sand and gravel: high resistivity (hundreds to thousands of ohm-metres)
- Saturated sand (groundwater-bearing): low resistivity (tens of ohm-metres)
- Clay: low resistivity (often indistinguishable from saturated sediments, which creates ambiguity)
- Bedrock: variable, generally higher than saturated sediments
- Saltwater intrusion (a major problem in coastal aquifers): very low resistivity, easily distinguishable

The contrast between dry and saturated sediments is what makes ERT useful for groundwater mapping. By measuring the apparent resistivity along survey lines and inverting for the subsurface conductivity distribution, hydrogeologists can identify the depth, extent, and structure of aquifer systems without drilling.

## The Inverse Problem

Given a set of surface electrode configurations and the corresponding potential measurements $u_{\text{meas}}$, the inverse problem is to recover $\sigma(x)$ from

$$
\min_{\sigma} \; \frac{1}{2}\|F(\sigma) - u_{\text{meas}}\|^2 + \alpha R(\sigma),
$$

where $F(\sigma)$ maps the conductivity distribution to predicted surface potentials (by solving the forward PDE), and $R(\sigma)$ is a regularization term.

The problem is nonlinear (the forward operator $F$ is nonlinear in $\sigma$), ill-posed (the solution is not unique without regularization, and is unstable to noise), and large-scale in practice (a 3D ERT survey can have thousands of measurements and an unknown field $\sigma$ discretized on a grid with millions of nodes).

The same algorithmic approaches used in EIT apply here: iteratively regularized Gauss-Newton methods, total variation regularization for sharp interfaces, and increasingly deep learning components to encode geological prior information. The main algorithmic difference is depth. EIT images a domain of tens of centimeters; ERT images depths of tens to hundreds of meters. Sensitivity to deep structure decreases with depth, making deep aquifer characterization inherently harder than shallow imaging.

## The Global Water Context

**India and South Asia.** India accounts for approximately 25% of global groundwater extraction, more than any other country. The states of Punjab and Haryana, where the Green Revolution's agricultural transformation was centered, have seen water tables fall by several meters over recent decades. ERT surveys are used extensively by state groundwater departments, NGOs, and international development organizations to map aquifer structures and identify viable well locations. The challenge is cost: a traditional ERT survey with a skilled geophysicist, appropriate equipment, and data processing takes days per site. For rural India, where thousands of villages need to locate new well sites, the survey cost is a real constraint.

**China's North China Plain.** The NCP aquifer system underlies a region that produces a significant fraction of China's wheat and maize. Decades of over-extraction have caused water tables to fall, wells to deepen, and in some areas, land subsidence from compaction of drained sediment. The Chinese government has invested heavily in groundwater monitoring and management, including geophysical surveys of aquifer geometry. Time-lapse ERT (repeated surveys over time to track seasonal and long-term changes in the water table) is an active research and monitoring application.

**Sub-Saharan Africa and the Sahel.** In the drylands of the Sahel and Horn of Africa, groundwater is often the only reliable water source. Seasonal surface water is variable and frequently contaminated. Community boreholes that tap deeper aquifers provide more reliable supply. But borehole drilling is expensive (several thousand dollars per borehole), and drilling success rates in poorly characterized geology can be low. ERT surveys before drilling improve success rates substantially by identifying the most promising locations. International organizations including UNICEF, the World Bank, and the International Water Management Institute fund ERT-based groundwater mapping programs across sub-Saharan Africa.

**The Middle East.** The Arabian Peninsula and surrounding regions rely almost entirely on non-renewable "fossil" groundwater, aquifers recharged over geological time during wetter climatic periods, now being extracted at rates that vastly exceed recharge. ERT plays a role in characterizing these aquifers and in mapping saltwater intrusion (the infiltration of seawater into freshwater aquifers) along coastlines, which is a growing problem in Yemen, Oman, and parts of Saudi Arabia.

## Where the Mathematics Can Help

Current operational ERT is limited in three ways that better algorithms could address:

**Speed.** Classical inversion algorithms (regularized Gauss-Newton with CG inner solvers) are iterative and require multiple forward PDE solves per outer iteration. For field surveys, where geophysicists process data in the evenings to plan the next day's acquisition, faster algorithms with reliable convergence diagnostics would improve workflow efficiency.

**3D reconstruction from 2D survey lines.** Most ERT surveys are conducted along 1D or 2D transects and interpreted as 2D cross-sections. True 3D aquifer geometry requires 3D inversion of areal survey data, which is computationally more demanding but geometrically more informative. Scalable 3D ERT inversion algorithms are an active research area.

**Integration with borehole and geological data.** ERT images have inherent ambiguity (clay and saturated sediment can look similar electrically). Incorporating complementary information (borehole lithology logs, geological maps, seismic refraction data) as structured prior information in the inverse problem can resolve this ambiguity. Bayesian approaches that formally integrate these data sources are more rigorous than the ad hoc adjustments currently made in practice.

The mathematical structure of these problems is the same as the inverse problems I work on in other contexts. The forward operator differs (subsurface ERT versus thoracic EIT), the scale differs, the noise characteristics differ, and the available prior information differs. But the regularization theory, the computational algorithms, and the trade-offs between resolution and stability are common across all of them.

Water scarcity is not an abstract problem. The geophysical inverse problem that helps locate groundwater is tractable, well-posed enough to be solvable with good algorithms, and consequential enough to be worth working on. It is one of the clearest examples I know of where improvements in computational mathematics translate directly into real-world impact, not at some indeterminate future point, but in the next survey season.

*For code related to geophysical inversion for groundwater detection, see the [groundwater-detection GitHub repository](https://github.com/abdgafartunde/groundwater-detection) (to be updated).*
