---
layout: post
title: "Medical Imaging Mathematics and the Radiology Gap in Africa"
description: "Medical imaging capacity remains limited and unevenly distributed across sub-Saharan Africa, creating a need for maintainable equipment, trained staff, and appropriate reconstruction methods."
date: 2026-11-02
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Medical Imaging, EIT, Applied Mathematics]
math: false
---

Medical imaging capacity in sub-Saharan Africa is limited and unevenly distributed. The WHO African Region's 2026 health-workforce report shows that most countries remain below the needs-based threshold for medical imaging and therapeutic equipment personnel. National averages also hide large differences between tertiary hospitals in major cities and facilities serving rural districts.

This is not simply a staffing problem. Imaging infrastructure (CT scanners, MRI machines, even digital X-ray units) is concentrated in a small number of urban hospitals. In most rural districts across sub-Saharan Africa, any imaging at all means a referral to a distant centre, a delay of days or weeks, a cost that many families cannot bear. Conditions that would be diagnosed and treated early in a high-income country go undetected until they are advanced, expensive, and often fatal.

The mathematics of medical imaging (specifically the mathematics of inverse problems) has something to say about this gap. Not as a complete solution, but as a set of tools that could make certain kinds of imaging dramatically cheaper, more portable, and more accessible. This is the applied context that motivates part of my own research.

## What Makes Imaging Expensive

The cost of clinical imaging has several components. MRI and CT require large capital purchases, suitable rooms, stable power, cooling, maintenance, quality assurance, and trained staff. CT also uses ionising radiation. Purchase prices vary by manufacturer, configuration, service contract, taxes, and whether equipment is new or refurbished, so a single price range quickly becomes misleading.

Then there is the operational infrastructure: reliable electricity (MRI and CT require uninterruptible power; power cuts damage hardware and corrupt scans), air conditioning, maintenance contracts, and trained operators. For many facilities, even if the initial capital could be raised, the operational costs are prohibitive.

Finally, there is the interpretation layer: a scan is only clinically useful if someone qualified to read it is available. With the radiologist shortage described above, even facilities that have scanners face backlogs and delays.

Cheaper imaging hardware addresses only the first part of this problem. But it is a necessary first part, and it is where the mathematics of alternative imaging modalities becomes relevant.

## Electrical Impedance Tomography: The Technical Case

Electrical impedance tomography reconstructs conductivity-change images from surface voltage measurements. Its measurement principle requires electrodes, controlled current injection, and voltage acquisition rather than magnets or ionising radiation. Research prototypes can use comparatively inexpensive electronic components, but a clinical system also requires electrical-safety engineering, calibration, validated software, durable patient interfaces, regulatory approval, and maintenance.

Image quality is a central limitation. The inverse problem of recovering conductivity from boundary voltages is severely ill-posed and nonlinear. Without careful regularisation and accurate modelling, reconstructed images are blurry and sensitive to modelling and measurement errors. Spatial sensitivity is nonuniform and generally decreases away from the electrodes, so EIT cannot match the anatomical resolution of CT or MRI.

This is a mathematical problem, and it has mathematical approaches that can partially address it.

**Regularisation design.** The choice of regulariser encodes prior information about what the unknown conductivity distribution looks like. For lung imaging, the anatomy is well-known: two lungs, a heart, ribs, and soft tissue, with characteristic electrical properties. Incorporating this anatomical prior (not as a hard constraint but as a structured regulariser) improves reconstruction quality substantially. The challenge is building regularisers that are robust to the inter-patient variability in anatomy and body composition that is large in a diverse population.

**Learned regularisers.** Data-driven approaches train a neural network on paired datasets (conductivity distributions and corresponding boundary measurements) to learn the inverse mapping, or more carefully, to learn a regulariser that is inserted into a classical iterative algorithm. These approaches can capture complex anatomical structures that are difficult to encode analytically. The mathematical question is: what guarantees do we have about the reconstructed image when the training distribution does not perfectly match the test case? This is the generalisation problem for inverse problems, and it remains only partially understood.

**Partial boundary data.** In practice, wounds, dressings, body shape, movement, or poor electrode contact can prevent complete and reliable boundary measurements. Recovering useful images from missing or degraded channels is harder than reconstruction from a complete, well-calibrated electrode belt.

The last two of these were central to my PhD research, motivated precisely by the clinical gap described here.

## Existing Capacity and the Distribution Problem

Sub-Saharan Africa is not a single medical-imaging environment. Teaching hospitals and private centres in major cities may operate CT, MRI, ultrasound, and digital radiography, while rural facilities in the same country may lack reliable basic imaging. The main problem is therefore not complete absence but uneven distribution, equipment downtime, maintenance capacity, and shortages of trained personnel.

Regional workforce investment, local maintenance, and appropriate technology matter alongside mathematical reconstruction. WHO assessments of medical-device access repeatedly identify financing, spare parts, training, infrastructure, and lifecycle support as connected constraints. An algorithm can reduce acquisition or computing requirements, but it cannot substitute for a functioning clinical system.

## The Mathematical Research Agenda

If cheap, portable imaging is to become clinically reliable, the following mathematical problems need better solutions:

**Resolution improvement under low-electrode-count conditions.** A documented commercial thoracic system uses 16 electrodes. Increasing the number of independent, reliable measurements may improve spatial information, but electrode count alone does not determine resolution. Reconstruction algorithms, current patterns, noise, geometry, and modelling accuracy all matter.

**Robustness to electrode contact variability.** In clinical settings, electrode contact impedance is variable and poorly known. It depends on skin preparation, electrode gel, patient movement, and sweating. The electrode model must account for this variability, and the reconstruction algorithm must be robust to it. This is an overlooked source of error in many published EIT reconstruction algorithms.

**Absolute conductivity imaging.** Clinical thoracic EIT commonly images conductivity *changes* relative to a reference, not absolute conductivity. Absolute imaging could support broader tissue characterization, but it is much more sensitive to the electrode model, contact impedance, boundary shape, and instrument calibration. Reliable absolute reconstruction remains an open technical problem.

**Real-time algorithms for field settings.** Iterative reconstruction algorithms are computationally expensive. In a district hospital setting, the computing hardware available may be limited. Algorithms that run reliably on consumer-grade hardware (or on a tablet) are a prerequisite for deployment outside major urban centres.

These are not easy problems. But they are tractable, they are connected to mainstream mathematical research in inverse problems and scientific machine learning, and the potential benefit of solving them, even partially, is large. The distance between a research paper on a learned regulariser for EIT reconstruction and a deployable device in a Nigerian district hospital is long: it involves clinical validation, regulatory approval, supply chains, and training. But the journey starts with the mathematics being right.

*For EIT reconstruction implementations, see the [eit-reconstruction-toolkit GitHub repository](https://github.com/abdgafartunde/eit-reconstruction-toolkit) (to be updated).*

For current regional context, see the WHO report [*State of the Health Workforce in Africa 2026*](https://www.afro.who.int/publications/state-health-workforce-africa-2026-plan-train-and-retain) and the WHO report on [access to medical devices through local production](https://www.who.int/publications/i/item/9789241510141). The clinical scope and limitations of thoracic EIT are summarized in the [2024 international expert report](https://doi.org/10.1186/s13054-024-05173-x).
