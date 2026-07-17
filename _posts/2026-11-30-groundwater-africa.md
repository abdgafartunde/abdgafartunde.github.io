---
layout: post
title: "Groundwater Mathematics: Finding Water in a Drying Continent"
description: "Groundwater exploration from surface geophysical measurements is an inverse problem with direct consequences for water access across sub-Saharan Africa."
date: 2026-11-30
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Geophysics, Applied Mathematics, Water]
math: true
---

In the dry season, queues form at boreholes before dawn in many communities across northern Nigeria. Water access depends on local hydrogeology, rainfall, infrastructure, maintenance, and the balance between abstraction and recharge. A failed borehole can waste thousands of dollars, although drilling costs vary widely with depth, geology, access, casing, pump design, and local procurement.

Drilling in the wrong place is expensive. In crystalline basement terrain, groundwater occurrence is controlled by weathering, fractures, regolith thickness, recharge, and hydraulic connectivity. Two nearby boreholes can therefore have very different yields, but geophysics alone cannot guarantee a productive or sustainable well. Borehole siting is a decision problem that combines hydrogeology, field mapping, geophysics, and local evidence.

## The Geophysics of Groundwater

One common geophysical method for groundwater exploration is electrical resistivity tomography (ERT). Water saturation often lowers resistivity, but pore-water salinity, clay content, porosity, temperature, and mineralogy also affect the measurement. ERT therefore maps electrical contrasts that must be interpreted hydrogeologically rather than water content directly.

The forward model uses the same conductivity equation that appears in medical EIT:

$$
-\nabla \cdot (\sigma(x) \nabla u) = f,
$$

where $\sigma(x)$ is the electrical conductivity of the subsurface, $u$ is the electric potential, and $f$ represents a balanced current source and sink. Surface voltage measurements provide data from which a regularized conductivity model can be estimated. Geological structure is then inferred by combining that model with other evidence.

The differences from medical EIT are mathematical as well as practical. The domain, boundary conditions, electrode geometry, observation operator, dimensionality, and prior information all change. Surface-only measurements also produce weak sensitivity to deep or poorly illuminated structures.

## Africa's Groundwater Situation

MacDonald and co-authors estimated Africa's total groundwater storage at approximately 0.66 million cubic kilometres, with a wide uncertainty range. They emphasized that only a fraction is practically available for abstraction and compared total storage with annual renewable freshwater resources, not with the standing volume of every lake and river. Local accessibility and sustainable yield matter more than the continental total.

**The Sahel and northern Nigeria.** Rainfall is strongly seasonal, and groundwater occurs in both large sedimentary basins and fractured crystalline basement. Recharge, abstraction, and long-term storage vary substantially between aquifer systems, so basin-wide statements about depletion require monitoring data at the appropriate scale.

**East Africa's Rift Valley.** The East African Rift System creates a complex hydrogeological environment: volcanic rocks, deep sedimentary basins, and geothermal systems. Groundwater access is a critical issue in Ethiopia (where droughts have become more frequent), Kenya, Tanzania, and Uganda. The IGAD (Intergovernmental Authority on Development) and the World Bank have funded ERT-based groundwater mapping programs across the Horn of Africa.

**Southern Africa.** Botswana, Namibia, and Zimbabwe rely heavily on groundwater in areas without perennial rivers. South Africa's droughts (particularly the 2015-2018 Western Cape drought that brought Cape Town close to "Day Zero") have accelerated investment in groundwater characterisation. South African academic groups (at the University of the Free State, Rhodes University) have active hydrogeophysics research programs.

**Urban groundwater.** Lagos depends substantially on private boreholes in areas where piped supply is unreliable. Coastal aquifers face risks from saline intrusion, contamination, and concentrated abstraction. Establishing the magnitude and location of these processes requires monitoring wells, hydrochemistry, geodesy, and geophysics rather than ERT alone.

## The Inverse Problem in Practice

For a hydrogeologist using ERT to site a borehole, the workflow is:

1. Deploy an electrode array along a survey line (typically 24–96 electrodes, separated by 5–20 metres).
2. Inject current through pairs of electrodes and measure the resulting potential at all other electrode pairs (hundreds to thousands of measurements per line).
3. Process the raw data to compute "apparent resistivities", a weighted average of the subsurface resistivity sampled by each measurement configuration.
4. Run an inversion algorithm to reconstruct the 2D (or 3D) subsurface resistivity distribution from the apparent resistivity data.
5. Interpret the resistivity section geologically to identify saturated zones and recommend borehole locations.

Step 4 is the mathematical core. The standard algorithm is a regularised Gauss-Newton method: linearise the forward operator around the current resistivity model, solve the regularised linear system for the model update, repeat until convergence. Total variation regularisation is common when sharp boundaries (e.g., the top of a weathered zone or a sediment-filled valley) are expected.

**The clay ambiguity.** Clay-rich material and water-saturated sand can both have low resistivity. A low-resistivity anomaly may therefore represent a productive aquifer, clay, saline water, or a mixture. Induced-polarisation measurements, hydrochemistry, geological mapping, and borehole logs can add information, but no single complementary measurement removes the ambiguity in every setting.

Mathematically, this is a non-uniqueness problem. The forward operator maps the conductivity distribution to the surface measurements; multiple conductivity distributions can produce nearly identical surface data. Regularisation reduces the non-uniqueness but cannot eliminate it when the fundamental physics does not distinguish between the ambiguous cases. Joint inversion of ERT and induced polarisation data, treating the conductivity and chargeability as coupled unknowns and inverting them simultaneously, addresses this at the cost of a larger, more complex inverse problem.

**Depth sensitivity.** Surface ERT generally loses sensitivity and resolution with depth. There is no universal $1/d^2$ law: the sensitivity kernel depends on array type, electrode spacing, domain geometry, background conductivity, noise, and the target. Depth of investigation should therefore be assessed for the actual survey, for example through sensitivity analysis or depth-of-investigation diagnostics.

## Where Better Mathematics Helps

Commercial packages such as RES2DINV and ERTLab are widely used, while pyGIMLi and SimPEG provide open-source research frameworks. Their capabilities, assumptions, and required expertise differ. The question is where better mathematics can improve reliability beyond current practice.

**Resolution at depth through structural constraints.** If geological knowledge constrains the likely depth and geometry of the target (e.g., weathered zone thickness from regional mapping, or sediment geometry from exposed outcrops), this can be encoded as a structural prior in the regularisation. Level-set methods, which parametrise the boundary of a conductivity anomaly rather than the conductivity distribution itself, can produce sharper images of bodies with known geometry but unknown extent. These approaches are more computationally demanding than standard Tikhonov regularisation but can substantially improve the interpretability of deep features.

**Uncertainty quantification.** A borehole siting decision is not just about the best-fit resistivity model; it is about whether the geophysicist is confident enough in the recommended location to recommend drilling. Probabilistic inversion methods (Markov chain Monte Carlo, ensemble methods, linearised Gaussian approximations to the posterior) characterise the range of models consistent with the data, and therefore the uncertainty in the borehole recommendation. In high-stakes, high-cost decisions like borehole siting, this uncertainty information has direct practical value.

**Computational accessibility.** Commercial ERT inversion software runs on Windows laptops and is accessible to field geologists in Africa. Open-source alternatives (pyGIMLi, SimPEG) require more technical expertise but are free and extensible. The barrier to using more sophisticated algorithms (structural priors, joint inversion, uncertainty quantification) is partly computational (they are slower) and partly accessibility (they require skills that are not yet widespread in African geophysical practice). Lowering both barriers is a concrete contribution that applied mathematicians can make.

The mathematics here is not the frontier of the field; regularised Gauss-Newton ERT inversion is decades-old technology. But the combination of applying it correctly, incorporating appropriate prior information, and communicating uncertainty quantitatively is not yet standard practice in field hydrogeology. Closing that gap between what the mathematics can do and what actually gets used in decisions about where to drill is, in the end, the applied problem.

*For groundwater detection and ERT inversion implementations, see the [groundwater-detection GitHub repository](https://github.com/abdgafartunde/groundwater-detection) (to be updated).*

Sources and further reading: MacDonald et al., ["Quantitative maps of groundwater resources in Africa"](https://nora.nerc.ac.uk/id/eprint/17892/); the [UNICEF drinking-water data portal](https://data.unicef.org/topic/water-and-sanitation/drinking-water/); the World Bank's [Horn of Africa groundwater programme](https://documents1.worldbank.org/curated/en/099072825051511982/pdf/P174867-5dc0b9fe-165f-4c0e-b8d2-9d681440d7a1.pdf); and Furman, Ferré, and Warrick's [array-sensitivity study](https://doi.org/10.2136/vzj2003.4160).
