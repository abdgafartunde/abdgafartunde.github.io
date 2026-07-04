---
layout: post
title: "Seismic Inversion and the Mathematics of Oil Exploration in Africa"
description: "Nigeria sits on 37 billion barrels of estimated oil reserves. The computational mathematics of seismic inversion (inverse problems, PDE-constrained optimization, and scientific machine learning) determines how well those reserves can be found and characterized."
date: 2026-11-16
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Geophysics, Scientific Machine Learning, Applied Mathematics]
math: true
---

In March 2026, SeaSeis Geophysical Nigeria signed a survey agreement covering 11,700 square kilometres of the offshore Niger Delta, one of the largest 3D seismic surveys in Nigerian waters in years. The announcement received little attention outside the Nigerian oil and gas press, but from a computational mathematics perspective it represents something worth noting: a large, difficult inverse problem, carried out in one of the world's most geologically complex environments, with consequences measured in billions of dollars and energy supply for hundreds of millions of people.

This post is about the mathematics behind that kind of survey: what seismic inversion is, why it is hard, and why it matters in the African context in ways that go beyond what is usually written about in mathematics journals.

## The Oil and Gas Landscape in Africa

Africa holds substantial proven hydrocarbon reserves. Nigeria's estimated 37 billion barrels of oil equivalent make it Africa's largest oil producer; Angola, Algeria, Libya, and Mozambique (which has seen major LNG discoveries offshore) each hold large reserves of their own. The Gulf of Guinea (stretching from Nigeria through Equatorial Guinea, Gabon, Congo, and Angola) is one of the world's most productive deepwater provinces, and exploration continues.

The challenge is that finding and characterizing these reserves has historically required expensive, slow, and technically demanding geophysical surveys, and the technical expertise to process and interpret those surveys has largely resided outside Africa. Major seismic processing workflows run in data centres in the UK, France, Canada, and the United States. Nigerian oil companies depend on international service providers for the most technically demanding parts of their exploration programs. The technical expertise gap is not a small detail: it directly affects the economics of exploration, the negotiating position of national oil companies, and the ability of African countries to manage their own subsurface resources.

This is the applied context in which the mathematics of seismic inversion sits.

## The Forward Problem: Wave Propagation

The physics of seismic exploration is the physics of wave propagation. A source (historically dynamite on land, an airgun array at sea) sends acoustic energy into the subsurface. The waves propagate through the Earth, refract and reflect at interfaces where rock properties change, and return to the surface where an array of receivers records them as time-series of particle velocity or pressure.

The forward model is the acoustic wave equation:

$$
\frac{1}{v(x)^2} \frac{\partial^2 u}{\partial t^2} - \nabla^2 u = f(x, t),
$$

where $v(x)$ is the compressional wave velocity at position $x$ (the quantity we want to find), $u(x,t)$ is the pressure wavefield, and $f$ is the source term. Given $v(x)$, solving this PDE for $u$ and evaluating it at receiver positions gives the predicted seismograms.

In the Niger Delta, the challenge is severe. Salt structures (masses of evaporite that flowed plastically over geological time, deforming the surrounding sediment layers into complex geometries) create strong velocity contrasts and shadow zones. Fault systems cut through the stratigraphy in patterns that are difficult to image with conventional methods. Gas clouds (accumulations of shallow gas that scatter and attenuate seismic waves) obscure deeper targets. The Niger Delta is, from a seismic imaging perspective, one of the most difficult geological environments in the world.

## The Inverse Problem: Recovering Velocity

Full waveform inversion (FWI) solves the inverse problem: given observed seismograms $d_{\text{obs}}$, find the velocity model $v(x)$ that minimises the misfit between predicted and observed data:

$$
\min_{v} \; \mathcal{J}(v) = \frac{1}{2} \sum_s \| u_s(v) - d_s \|^2 + \alpha R(v),
$$

where the sum is over seismic sources $s$, and $R(v)$ is a regularisation term.

The gradient of $\mathcal{J}$ with respect to $v$ is computed via the adjoint method, the subject of an earlier post. Each gradient evaluation requires two wave equation solves per source: one forward and one adjoint. For a 3D survey with thousands of sources and a velocity model discretised on a grid with millions of nodes, this is one of the largest routine computational problems in applied science.

**Why it is hard in the Niger Delta.** The objective function for FWI is notoriously non-convex. Gradient descent can converge to a local minimum (a velocity model that fits the data but is geologically wrong) if the initial model is not close to the truth. This "cycle-skipping" problem, where the predicted and observed waveforms are offset by more than half a wavelength, is particularly severe in complex geology where the initial velocity model is uncertain. Shallow gas clouds in the Niger Delta complicate matters further: they attenuate the signal and make the first-arrival picks that are used to build the initial model unreliable.

**The regularisation question.** What prior information can be incorporated? Geological knowledge of the Niger Delta suggests that velocity should generally increase with depth, that salt bodies have nearly uniform velocity (~4480 m/s), and that major faults produce sharp velocity contrasts. Encoding this as a regularisation term (rather than as a hard constraint, which would make the optimisation intractable) is a non-trivial modelling choice that significantly affects reconstruction quality.

**Scientific machine learning approaches.** The current research frontier combines classical FWI with data-driven components. Neural network velocity parametrisations, surrogate forward models, and learned misfit functions that are less susceptible to cycle-skipping are all active research directions. The training data challenge is real: well-labelled pairs of velocity models and seismograms from real surveys are commercially sensitive and not publicly available. Approaches that can generalise from synthetic training data to real survey data are therefore of particular practical importance.

## Building Technical Capacity in Africa

Beyond the immediate computational problem, there is a structural issue worth naming directly.

Nigeria produces 1.5–2 million barrels of oil per day. The seismic processing that underpins exploration of those reserves (FWI, depth migration, velocity model building) is a technically demanding, high-value activity. Almost none of it is done in Nigeria. It happens in Houston, London, Paris, and Oslo. The value added by the technical work accrues elsewhere.

This is changing, slowly. The Petroleum Technology Development Fund (PTDF) funds training and capacity-building in petroleum technology for Nigerians. Nigerian geoscience companies (SeaSeis, Verity Geo) are building technical capability domestically. Universities like the University of Ibadan and Lagos have geology and geophysics departments with active researchers. The African Association of Petroleum Geoscientists and Engineers provides a professional community.

The mathematical and computational side of this picture is less developed. FWI and advanced velocity model building require expertise in numerical PDEs, large-scale optimisation, and scientific computing: the intersection of disciplines that characterises computational applied mathematics. There are very few people in sub-Saharan Africa with that combination of skills. Training more of them is not a simple matter of sending people abroad for a degree: it requires building the institutional infrastructure (courses, computational resources, research groups) to sustain the work locally.

This is the long-term applied mathematics problem that I find more interesting than any individual algorithm. The algorithms are hard, but the institutional gap is the harder constraint.

## What the Mathematics Needs

From a technical standpoint, African contexts present specific challenges that the standard seismic inversion literature does not fully address:

**Limited acquisition geometries.** Deepwater surveys in the Niger Delta have good data quality but expensive acquisition. Onshore surveys in the Niger Delta and other African provinces face logistics challenges (jungle, swamps, community access) that result in irregular, incomplete acquisition geometries. Reconstruction from irregular sampling and partial data is a harder inverse problem than the standard marine acquisition case.

**Computational constraints.** Industrial FWI runs on supercomputer clusters. Academic and institutional groups in Africa generally do not have access to these resources. Developing FWI algorithms that run efficiently on cloud computing platforms (accessible with commodity internet and a credit card) or on high-end consumer hardware is a practical research question with African applicability.

**Validation without ground truth.** The standard validation for a velocity model is comparison with well logs from drilled wells. In frontier exploration areas (and Africa has many), there are few wells and the ground truth for validating any inversion result is limited. Uncertainty quantification for the inverse problem (characterising not just the best-fit velocity model but the range of models consistent with the data) is therefore practically important.

These are not uniquely African problems, but they are problems for which the African context provides urgency and specificity that motivates better mathematical work.

*For seismic inversion implementations, see the [seismic-inversion-ml GitHub repository](https://github.com/abdgafartunde/seismic-inversion-ml) (to be updated).*
