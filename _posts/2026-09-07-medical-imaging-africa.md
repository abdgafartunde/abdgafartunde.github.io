---
layout: post
title: "Medical Imaging Mathematics and the Radiology Gap in Africa"
description: "Sub-Saharan Africa faces a severe shortage of radiologists and imaging infrastructure. The mathematics of low-cost, low-data imaging — inverse problems and EIT — has a direct role to play."
date: 2026-09-07
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Medical Imaging, EIT, Applied Mathematics]
math: true
---

There is a figure I return to often. The World Health Organisation recommends one radiologist per 50,000 people. In the United Kingdom, the ratio is approximately 1 per 43,000. In the United States, closer to 1 per 20,000. In Nigeria — Africa's most populous country — the estimate is roughly 1 per 600,000. In Ethiopia, Tanzania, and many other sub-Saharan African countries, it is worse.

This is not simply a staffing problem. Imaging infrastructure — CT scanners, MRI machines, even digital X-ray units — is concentrated in a small number of urban hospitals. In most rural districts across sub-Saharan Africa, any imaging at all means a referral to a distant centre, a delay of days or weeks, a cost that many families cannot bear. Conditions that would be diagnosed and treated early in a high-income country go undetected until they are advanced, expensive, and often fatal.

The mathematics of medical imaging — specifically the mathematics of inverse problems — has something to say about this gap. Not as a complete solution, but as a set of tools that could make certain kinds of imaging dramatically cheaper, more portable, and more accessible. This is the applied context that motivates part of my own research.

## What Makes Imaging Expensive

The cost of clinical imaging has several components. Hardware: a 1.5T MRI scanner costs $1–3 million to purchase and requires expensive superconducting magnets, liquid helium cooling, and a shielded room. A 64-slice CT scanner costs $500,000–$1.5 million and exposes patients to ionising radiation with cumulative risk. Even mid-range digital X-ray systems cost $50,000–$200,000. In an environment where a district hospital's entire annual equipment budget may be $100,000 or less, none of these is accessible.

Then there is the operational infrastructure: reliable electricity (MRI and CT require uninterruptible power; power cuts damage hardware and corrupt scans), air conditioning, maintenance contracts, and trained operators. For many facilities, even if the initial capital could be raised, the operational costs are prohibitive.

Finally, there is the interpretation layer: a scan is only clinically useful if someone qualified to read it is available. With the radiologist shortage described above, even facilities that have scanners face backlogs and delays.

Cheaper imaging hardware addresses only the first part of this problem. But it is a necessary first part, and it is where the mathematics of alternative imaging modalities becomes relevant.

## Electrical Impedance Tomography: The Technical Case

Electrical impedance tomography reconstructs images of internal electrical conductivity from surface voltage measurements. The hardware required is simple: a ring of electrodes, a current source, and a voltage measuring unit. No magnets, no radiation, no cryogenic cooling. A complete EIT system can be built for a few thousand dollars, and the cost is continuing to fall. The device is lightweight, portable, and can run on battery power.

The limiting factor is not hardware — it is image quality. The inverse problem of recovering conductivity from boundary voltages is severely ill-posed and nonlinear. Without careful regularisation, the reconstructed images are blurry, artefact-laden, and unreliable for clinical diagnosis. The spatial resolution of EIT is fundamentally limited compared to CT or MRI, because the electric field diffuses rather than propagating in straight rays: information from deep structures is exponentially attenuated at the surface.

This is a mathematical problem, and it has mathematical approaches that can partially address it.

**Regularisation design.** The choice of regulariser encodes prior information about what the unknown conductivity distribution looks like. For lung imaging, the anatomy is well-known: two lungs, a heart, ribs, and soft tissue, with characteristic electrical properties. Incorporating this anatomical prior — not as a hard constraint but as a structured regulariser — improves reconstruction quality substantially. The challenge is building regularisers that are robust to the inter-patient variability in anatomy and body composition that is large in a diverse population.

**Learned regularisers.** Data-driven approaches train a neural network on paired datasets (conductivity distributions and corresponding boundary measurements) to learn the inverse mapping, or more carefully, to learn a regulariser that is inserted into a classical iterative algorithm. These approaches can capture complex anatomical structures that are difficult to encode analytically. The mathematical question is: what guarantees do we have about the reconstructed image when the training distribution does not perfectly match the test case? This is the generalisation problem for inverse problems, and it remains only partially understood.

**Partial boundary data.** In practice, the full electrode ring cannot always be placed. Post-mastectomy patients cannot use a full thoracic belt. Obese patients have electrode contact problems. Abdominal wounds prevent electrode placement on parts of the torso. Recovering reliable images from partial boundary data is substantially harder than full-boundary reconstruction, but it is the clinically relevant problem in many settings.

The last two of these were central to my PhD research, motivated precisely by the clinical gap described here.

## What Already Exists in Africa

The picture is not entirely bleak. Several African institutions have established serious medical imaging research and clinical programs.

**Ghana.** The Korle-Bu Teaching Hospital in Accra has a functional radiology department that conducts research. The Ghana College of Physicians and Surgeons has a radiology training programme. The Ghanaian healthtech ecosystem has been growing, with startups working on digital health infrastructure.

**Rwanda.** The government's health system transformation over the past two decades has included significant investment in diagnostic infrastructure. University Teaching Hospital of Kigali (CHUK) has functional CT and ultrasound. Rwanda has used telemedicine and AI-assisted diagnostics as partial solutions to the radiologist shortage, with programs supported by international partners including Carnegie Mellon University Africa.

**South Africa.** Groote Schuur Hospital in Cape Town and Charlotte Maxeke Johannesburg Academic Hospital have research-active radiology departments. Academic groups at the University of Cape Town and the University of the Witwatersrand have published on AI-assisted diagnostics and computational imaging. South Africa is the most advanced sub-Saharan African country in medical imaging research.

**Nigeria.** University College Hospital (UCH) in Ibadan and Lagos University Teaching Hospital (LUTH) are the most research-active Nigerian teaching hospitals for imaging. UCH Ibadan — one of the oldest teaching hospitals in West Africa, established 1957 — has a radiology department that has been involved in collaborative research projects. The Nigerian medical imaging market has attracted healthtech startups: Helium Health, Curacel, and others have worked on healthcare data and diagnostics infrastructure, though most of these focus on data systems rather than imaging physics.

The gap between these relatively strong nodes and the median district hospital in the same countries is enormous.

## The Mathematical Research Agenda

If cheap, portable imaging is to become clinically reliable, the following mathematical problems need better solutions:

**Resolution improvement under low-electrode-count conditions.** Commercial EIT systems use 16–32 electrodes. Increasing electrode count improves resolution but increases hardware cost and patient preparation time. Reconstruction algorithms that extract maximum information from 16 electrodes — through better regularisation and better use of prior information — improve the clinical value of existing hardware.

**Robustness to electrode contact variability.** In clinical settings, electrode contact impedance is variable and poorly known. It depends on skin preparation, electrode gel, patient movement, and sweating. The electrode model must account for this variability, and the reconstruction algorithm must be robust to it. This is an overlooked source of error in many published EIT reconstruction algorithms.

**Absolute conductivity imaging.** Current clinical EIT (as in the Dräger PulmoVista) images conductivity *changes* relative to a baseline, not absolute conductivity. Absolute imaging would allow tissue characterisation — distinguishing tumour from surrounding tissue, for example — but it requires solving a much harder inverse problem that is sensitive to the electrode model and boundary shape. Reliable absolute EIT reconstruction is an open problem with significant clinical upside.

**Real-time algorithms for field settings.** Iterative reconstruction algorithms are computationally expensive. In a district hospital setting, the computing hardware available may be limited. Algorithms that run reliably on consumer-grade hardware — or on a tablet — are a prerequisite for deployment outside major urban centres.

These are not easy problems. But they are tractable, they are connected to mainstream mathematical research in inverse problems and scientific machine learning, and the potential benefit of solving them, even partially, is large. The distance between a research paper on a learned regulariser for EIT reconstruction and a deployable device in a Nigerian district hospital is long — it involves clinical validation, regulatory approval, supply chains, and training. But the journey starts with the mathematics being right.

*For EIT reconstruction implementations, see the [eit-reconstruction-toolkit GitHub repository](https://github.com/abdgafartunde/eit-reconstruction-toolkit) — to be updated.*
