---
layout: post
title: "Electrical Impedance Tomography in Clinical Practice: From Research to Bedside"
description: "How EIT moved from a mathematical inverse problem into intensive care units and diagnostic centres; the gap between current clinical use and its full potential remains wide open."
date: 2026-09-21
author: "Abd'gafar Tunde Tiamiyu"
tags: [Inverse Problems, Medical Imaging, EIT, Applied Mathematics]
math: true
---

For most of my PhD, electrical impedance tomography was a mathematical object: a nonlinear inverse problem with partial boundary data, an ill-posed mapping from boundary voltages to interior conductivity distributions, a setting in which to develop and test regularization algorithms. That framing is accurate, but it is incomplete.

EIT is also a clinical technology. It is used today in intensive care units across Europe and Asia to guide mechanical ventilation for critically ill patients. Devices are certified, sold commercially, and documented in clinical outcome studies. Understanding what clinical EIT currently does, where it works well, and why it remains limited is directly relevant to understanding what the mathematical and computational problems actually are, and where the real opportunities lie.

## What EIT Does

EIT reconstructs images of the internal electrical conductivity distribution of a body from voltage measurements made at the surface. A ring of electrodes is attached around the patient's thorax. Small alternating currents (typically a few milliamps at frequencies of 10–100 kHz, well below the threshold for physiological stimulation) are injected through pairs of electrodes while voltages are recorded at all other electrodes. The pattern of injections is cycled through many configurations, producing a data vector of boundary voltage measurements. From this data, the inverse problem recovers an image of how conductivity is distributed inside the thorax.

The conductivity of biological tissue varies substantially by type: air-filled lung tissue is highly resistive, blood is relatively conductive, muscle and fat sit between. As the lungs inflate and deflate, the regional distribution of air changes, and so does the regional conductivity distribution. EIT images this change in real time (typically at frame rates of 20-50 images per second), providing continuous, bedside monitoring of lung ventilation.

## The Clinical Problem It Solves

Patients in intensive care units who cannot breathe independently are supported by mechanical ventilators that deliver air under positive pressure. Getting the ventilation parameters right (the tidal volume, the respiratory rate, the positive end-expiratory pressure) is critical and difficult.

Set the pressure too low, and under-aerated lung regions collapse (atelectasis) and are re-recruited with each breath, causing repetitive trauma. Set it too high, and over-distended lung regions are damaged (volutrauma). In patients with acute respiratory distress syndrome (ARDS), where lung compliance is severely impaired and uneven, the optimal ventilation settings vary substantially between patients and can change over time as the condition evolves.

The problem is that clinicians have had few tools for monitoring regional lung function at the bedside. Conventional chest X-ray shows global lung structure but not function; CT is high-resolution but requires transporting a critically ill patient to a scanner and exposes them to radiation; pulse oximetry measures oxygen saturation but cannot localize which regions of the lung are contributing.

EIT fills this gap. Because it measures continuously, radiation-free, and at the bedside, it can provide real-time maps of regional lung ventilation, showing which regions are over-distended, which are poorly aerated, and how these change with ventilation settings. This allows clinicians to titrate mechanical ventilation to the individual patient's lung, rather than using population-average protocol values.

## Clinical Deployment: Europe and Asia

**Germany and Switzerland: the Dräger PulmoVista 500.** The first commercial EIT device for critical care was introduced by Dräger Medical (Lübeck, Germany) around 2011. The PulmoVista 500 uses a belt of 16 electrodes placed around the thorax and produces real-time 2D cross-sectional images of lung ventilation. It has been adopted in ICUs across Germany, Switzerland, the Netherlands, and Scandinavia, and has been studied in multiple clinical trials examining its impact on ventilation management in ARDS patients. A substantial body of evidence now supports its use for guiding positive end-expiratory pressure (PEEP) titration.

**The Netherlands and Scandinavia: academic-clinical research partnerships.** Some of the most important clinical EIT research has come from academic medical centres in Amsterdam (Amsterdam UMC), Lausanne (CHUV), and the Karolinska Institute in Stockholm. These groups have published landmark studies on using EIT-guided ventilation in ARDS, prone positioning monitoring, and lung recruitment manoeuvres. The mathematical models underlying their clinical devices are direct descendants of the regularized inverse problem formulations developed in the academic literature.

**China: rapid expansion.** The Chinese market for medical devices has grown rapidly over the past decade, and EIT is no exception. The company Swisstom (now operating under Timpel branding) has had significant presence in Chinese hospitals, and domestic Chinese companies are developing competing systems. Several major Chinese hospital groups (including those affiliated with Peking Union Medical College Hospital and Ruijin Hospital in Shanghai) have published clinical studies on EIT-guided ventilation. China's high patient volumes and the scale of its tertiary care system create both a large potential market and a significant clinical research base.

**Japan and South Korea.** Academic groups in Japan (at Keio University and Osaka University) and South Korea (Seoul National University Hospital) have research programs in clinical EIT, primarily for respiratory monitoring and neonatal applications. The neonatal application is particularly important: premature infants on ventilators are extremely vulnerable to lung injury, and EIT's continuous, radiation-free monitoring has clear value. Commercial systems are used in specialist neonatal units.

## What the Mathematics Currently Provides

The clinical devices deployed today use relatively simple reconstruction algorithms by research standards. Dräger's PulmoVista uses a linearized, sensitivity-matrix approach with Tikhonov regularization, effectively a single-step least-squares reconstruction applied to the difference between current and baseline measurements. This produces images of conductivity *change*, not absolute conductivity, and the images are low-resolution (the 16-electrode system produces images with perhaps 16×16 effective pixels after reconstruction).

This is a deliberate engineering choice. For the clinical application of tracking lung ventilation changes, high temporal resolution matters more than spatial resolution; the clinician wants to know whether the left lung or right lung is better ventilated, not a precise anatomical map. The simple reconstruction algorithm is fast enough for real-time display and robust enough for clinical use.

The research frontier is different. Current academic work addresses:

- **Absolute EIT** (reconstructing conductivity, not just changes): this requires accurate electrode models, precise contact impedance characterization, and solving a much harder inverse problem, but it would enable tissue characterization rather than just functional monitoring.
- **3D reconstruction**: commercial devices image a 2D cross-section; the lung is three-dimensional, and out-of-plane currents limit accuracy. 3D EIT requires more electrodes, more data, and far more expensive reconstruction.
- **Partial boundary data**: in some clinical settings (post-mastectomy, obese patients, surgical wounds), the full electrode ring cannot be placed. Reconstruction from partial boundary data is a mathematically harder problem with important clinical applications.
- **Learned regularizers**: data-driven approaches that use anatomical priors from CT databases to improve spatial resolution and robustness.

The last three years of my own PhD research sat at the intersection of partial boundary data, regularization theory, and learned regularizers, motivated precisely by the gap between what current clinical devices do and what is mathematically possible.

## The Gap Between Current and Potential

EIT is cheaper than CT or MRI by an order of magnitude, both in device cost and in operational cost per measurement. It is portable, radiation-free, and can run continuously at the bedside. In settings where CT and MRI are unavailable, expensive, or impractical, EIT could provide imaging capability that is currently absent.

The limitation is image quality. Resolution is low, and absolute conductivity imaging remains clinically unreliable. Closing this gap is an algorithmic and mathematical problem as much as a hardware problem. Better reconstruction algorithms (ones that exploit prior information more effectively, handle partial data more gracefully, and are robust to the inevitable imperfections in clinical electrode placement) would translate directly into clinical benefit.

That translation is not guaranteed, but it is tractable. The mathematics is hard, the clinical need is genuine, and the computational tools available now are substantially more powerful than they were when the field started. That seems like a reasonable place to be working.

*For implementations of EIT reconstruction algorithms, see the [eit-reconstruction-toolkit GitHub repository](https://github.com/abdgafartunde/eit-reconstruction-toolkit) (to be updated).*
