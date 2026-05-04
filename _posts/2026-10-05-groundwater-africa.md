---
layout: post
title: "Groundwater Mathematics: Finding Water in a Drying Continent"
description: "Over 300 million people in sub-Saharan Africa lack access to safe water. The inverse problem of finding groundwater from surface geophysical measurements has both mathematical depth and direct human consequences."
date: 2026-10-05
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Geophysics, Applied Mathematics, Water]
math: true
---

In the dry season, you can watch the queues form at boreholes before dawn. In rural northern Nigeria (in Katsina, Kebbi, Sokoto), women and children wait for hours to collect water from the few working boreholes in a community. The wells that served earlier generations have run dry, as water tables have dropped under the combined pressure of population growth, expanded agriculture, and climatic shifts that have shortened and intensified the rainfall season. A new borehole, drilled to reach deeper aquifers, costs somewhere between $3,000 and $15,000 depending on depth, geology, and accessibility. In communities where a household's monthly income may be $50, that cost is not theoretical: it is either borne collectively, funded by a government program, an NGO, or a diaspora donor, or it does not get drilled.

Drilling in the wrong place is expensive and demoralising. In fractured crystalline basement geology (which underlies large parts of West Africa, East Africa, and the Sahel), groundwater is not distributed uniformly in large porous aquifers but is concentrated in fractures, weathered zones, and sediment-filled valleys. A borehole sited 50 metres from one of these structures may be dry; a borehole sited on it will produce water for decades. The question of where to drill is fundamentally a geophysical inverse problem.

## The Geophysics of Groundwater

The standard geophysical method for groundwater exploration is electrical resistivity tomography (ERT). The physical principle is simple: water-saturated rock conducts electricity better than dry rock. Measuring the apparent electrical resistivity of the subsurface, and inverting those measurements to produce a map of the conductivity distribution with depth, reveals where saturated zones are likely to occur.

The forward model is exactly the same PDE that governs electrical impedance tomography in medical imaging: the elliptic equation for electric potential in a heterogeneous medium:

$$
-\nabla \cdot (\sigma(x) \nabla u) = f,
$$

where $\sigma(x)$ is the electrical conductivity of the subsurface (the inverse of resistivity), $u$ is the electric potential, and $f$ represents the injected current. Injecting current through two surface electrodes and measuring the potential at other electrode positions gives data from which $\sigma(x)$ (and therefore the subsurface structure) can be recovered.

The differences from the medical EIT case are practical rather than mathematical. The domain is the Earth rather than a thorax; the measurements are at the surface rather than around a cross-section; the depths of interest range from a few metres to hundreds of metres depending on the target aquifer; and the geological heterogeneity (faults, fractures, varying lithology) creates a more complex and variable conductivity structure than the relatively predictable anatomy of human tissue.

## Africa's Groundwater Situation

The African continent sits on enormous groundwater reserves. The British Geological Survey estimated in 2012 that Africa's groundwater volume is approximately 0.66 million cubic kilometres, about 100 times the volume of water in all of Africa's lakes and rivers combined. The problem is not that groundwater is absent; the problem is that it is unevenly distributed, poorly characterised, and increasingly stressed by extraction that outpaces natural recharge in many areas.

**The Sahel and northern Nigeria.** The semi-arid Sahel, which runs across West Africa from Senegal to Chad and into northern Nigeria, receives 300–600 mm of rainfall per year, mostly concentrated in a June-to-September wet season. Groundwater recharge during the wet season is the primary freshwater source for the dry season. Aquifers in this region are in sedimentary basins (the Chad Basin, the Iullemeden Basin) and in fractured crystalline basement. The Chad Basin aquifer, shared between Nigeria, Niger, Chad, and Cameroon, is one of the largest in Africa, but it is being depleted faster than it recharges in the more arid northern zones.

**East Africa's Rift Valley.** The East African Rift System creates a complex hydrogeological environment: volcanic rocks, deep sedimentary basins, and geothermal systems. Groundwater access is a critical issue in Ethiopia (where droughts have become more frequent), Kenya, Tanzania, and Uganda. The IGAD (Intergovernmental Authority on Development) and the World Bank have funded ERT-based groundwater mapping programs across the Horn of Africa.

**Southern Africa.** Botswana, Namibia, and Zimbabwe rely heavily on groundwater in areas without perennial rivers. South Africa's droughts (particularly the 2015-2018 Western Cape drought that brought Cape Town close to "Day Zero") have accelerated investment in groundwater characterisation. South African academic groups (at the University of the Free State, Rhodes University) have active hydrogeophysics research programs.

**Urban groundwater.** Lagos (with a population of 15-20 million and notoriously unreliable piped water supply) depends substantially on private boreholes. The density of extraction in some areas of Lagos has caused saline intrusion (seawater moving into freshwater aquifers near the coast) and land subsidence from compaction of drained sediment. Mapping these processes with ERT and time-lapse geophysics is both scientifically interesting and practically urgent.

## The Inverse Problem in Practice

For a hydrogeologist using ERT to site a borehole, the workflow is:

1. Deploy an electrode array along a survey line (typically 24–96 electrodes, separated by 5–20 metres).
2. Inject current through pairs of electrodes and measure the resulting potential at all other electrode pairs (hundreds to thousands of measurements per line).
3. Process the raw data to compute "apparent resistivities", a weighted average of the subsurface resistivity sampled by each measurement configuration.
4. Run an inversion algorithm to reconstruct the 2D (or 3D) subsurface resistivity distribution from the apparent resistivity data.
5. Interpret the resistivity section geologically to identify saturated zones and recommend borehole locations.

Step 4 is the mathematical core. The standard algorithm is a regularised Gauss-Newton method: linearise the forward operator around the current resistivity model, solve the regularised linear system for the model update, repeat until convergence. Total variation regularisation is common when sharp boundaries (e.g., the top of a weathered zone or a sediment-filled valley) are expected.

**The clay ambiguity.** The most persistent practical challenge is that clay and saturated sand can have similar low resistivities. A low-resistivity anomaly in an ERT section might be a water-bearing sand layer (the drilling target) or a clay layer that would yield no water and clog the pump. Resolving this ambiguity from ERT data alone is often impossible. It requires additional data: induced polarisation (which distinguishes clay from electrolyte conductivity through their different frequency responses), or borehole lithology logs from nearby wells.

Mathematically, this is a non-uniqueness problem. The forward operator maps the conductivity distribution to the surface measurements; multiple conductivity distributions can produce nearly identical surface data. Regularisation reduces the non-uniqueness but cannot eliminate it when the fundamental physics does not distinguish between the ambiguous cases. Joint inversion of ERT and induced polarisation data, treating the conductivity and chargeability as coupled unknowns and inverting them simultaneously, addresses this at the cost of a larger, more complex inverse problem.

**Depth sensitivity.** ERT sensitivity to deep structure decreases with depth. For a surface electrode array, the sensitivity to conductivity perturbations at depth $d$ falls off roughly as $1/d^2$ (the precise rate depends on electrode spacing and geometry). This means that the resolution of ERT inversions degrades with depth: shallow features can be resolved to a few metres, while deep targets at 50–100 metres are imaged with much lower resolution. For aquifer targets at depth, this fundamental sensitivity limitation constrains what can be recovered regardless of the algorithm.

## Where Better Mathematics Helps

Standard ERT inversion software (RES2DINV, ERTLab, pyGIMLi) is commercially available and widely used. The algorithms are established, the interfaces are usable by trained geologists, and the results are adequate for many applications. The question is where better mathematics can move the needle beyond the current state of practice.

**Resolution at depth through structural constraints.** If geological knowledge constrains the likely depth and geometry of the target (e.g., weathered zone thickness from regional mapping, or sediment geometry from exposed outcrops), this can be encoded as a structural prior in the regularisation. Level-set methods, which parametrise the boundary of a conductivity anomaly rather than the conductivity distribution itself, can produce sharper images of bodies with known geometry but unknown extent. These approaches are more computationally demanding than standard Tikhonov regularisation but can substantially improve the interpretability of deep features.

**Uncertainty quantification.** A borehole siting decision is not just about the best-fit resistivity model; it is about whether the geophysicist is confident enough in the recommended location to recommend drilling. Probabilistic inversion methods (Markov chain Monte Carlo, ensemble methods, linearised Gaussian approximations to the posterior) characterise the range of models consistent with the data, and therefore the uncertainty in the borehole recommendation. In high-stakes, high-cost decisions like borehole siting, this uncertainty information has direct practical value.

**Computational accessibility.** Commercial ERT inversion software runs on Windows laptops and is accessible to field geologists in Africa. Open-source alternatives (pyGIMLi, SimPEG) require more technical expertise but are free and extensible. The barrier to using more sophisticated algorithms (structural priors, joint inversion, uncertainty quantification) is partly computational (they are slower) and partly accessibility (they require skills that are not yet widespread in African geophysical practice). Lowering both barriers is a concrete contribution that applied mathematicians can make.

The mathematics here is not the frontier of the field; regularised Gauss-Newton ERT inversion is decades-old technology. But the combination of applying it correctly, incorporating appropriate prior information, and communicating uncertainty quantitatively is not yet standard practice in field hydrogeology. Closing that gap between what the mathematics can do and what actually gets used in decisions about where to drill is, in the end, the applied problem.

*For groundwater detection and ERT inversion implementations, see the [groundwater-detection GitHub repository](https://github.com/abdgafartunde/groundwater-detection) (to be updated).*
