---
layout: default
title: "Home"
---

<!-- Hero Section -->
<div class="hero-section bg-gradient-primary text-white p-5 rounded mb-5">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-8">
                <h1 class="display-4 fw-bold mb-3">Welcome to My Academic Portfolio</h1>
                <p class="lead mb-4">
                    Exploring the intersection of computational mathematics, deep learning, and medical imaging 
                    through innovative research in electrical impedance tomography and inverse problems.
                </p>
                <div class="mb-4">
                    <span class="badge bg-light text-primary me-2 fs-6">PhD in Mathematics</span>
                    <span class="badge bg-light text-primary me-2 fs-6">Deep Learning Researcher</span>
                    <span class="badge bg-light text-primary fs-6">Scientific Computing</span>
                </div>
                <div class="d-flex flex-wrap gap-2">
                    <a href="/research" class="btn btn-light btn-lg">
                        <i class="fas fa-microscope me-2"></i>Research
                    </a>
                    <a href="/publications" class="btn btn-outline-light btn-lg">
                        <i class="fas fa-file-alt me-2"></i>Publications
                    </a>
                    <a href="/CV.pdf" class="btn btn-outline-light btn-lg" target="_blank">
                        <i class="fas fa-download me-2"></i>Download CV
                    </a>
                </div>
            </div>
            <div class="col-lg-4 text-center">
                <div class="position-relative">
                    <i class="fas fa-brain fa-5x opacity-25"></i>
                    <i class="fas fa-microscope position-absolute top-0 start-50 translate-middle fa-2x mt-3"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- About Section -->
<div class="container mb-5">
    <div class="row">
        <div class="col-lg-8 mx-auto">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="row align-items-center">
                        <div class="col-md-3 text-center mb-3 mb-md-0">
                            <div class="profile-image-placeholder bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" style="width: 120px; height: 120px;">
                                <i class="fas fa-user fa-3x text-muted"></i>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <h3 class="mb-3">About Me</h3>
                            <p class="text-muted mb-3">
                                I recently completed my PhD in Mathematics at The Chinese University of Hong Kong, 
                                where I developed novel computational approaches for electrical impedance tomography 
                                using deep learning and advanced regularization techniques.
                            </p>
                            <div class="row text-center">
                                <div class="col-4">
                                    <h6 class="text-primary mb-1">{{ site.data.stats.publications | default: "8+" }}</h6>
                                    <small class="text-muted">Publications</small>
                                </div>
                                <div class="col-4">
                                    <h6 class="text-primary mb-1">4+</h6>
                                    <small class="text-muted">Years Research</small>
                                </div>
                                <div class="col-4">
                                    <h6 class="text-primary mb-1">3</h6>
                                    <small class="text-muted">Major Awards</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

## Research Highlights

<div class="row mb-5">
    <div class="col-md-4 mb-4">
        <div class="card text-center h-100">
            <div class="card-body">
                <i class="fas fa-brain fa-3x text-primary mb-3"></i>
                <h5 class="card-title">Deep Learning for EIT</h5>
                <p class="card-text">Integrating physics-informed neural networks with traditional inverse problem solvers, achieving 15% accuracy improvement in noisy datasets.</p>
            </div>
        </div>
    </div>
    <div class="col-md-4 mb-4">
        <div class="card text-center h-100">
            <div class="card-body">
                <i class="fas fa-calculator fa-3x text-success mb-3"></i>
                <h5 class="card-title">Numerical Optimization</h5>
                <p class="card-text">Developing novel variational inversion schemes using adaptive primal-dual hybrid gradient methods for ill-posed problems.</p>
            </div>
        </div>
    </div>
    <div class="col-md-4 mb-4">
        <div class="card text-center h-100">
            <div class="card-body">
                <i class="fas fa-image fa-3x text-warning mb-3"></i>
                <h5 class="card-title">Computational Imaging</h5>
                <p class="card-text">Creating data-driven approaches for learning multi-parameter regularizers via convex optimization for image restoration.</p>
            </div>
        </div>
    </div>
</div>

## Recent Publications

<div class="card mb-4">
    <div class="card-header bg-primary text-white">
        <h5 class="mb-0"><i class="fas fa-newspaper"></i> Latest Research</h5>
    </div>
    <div class="card-body">
        <ul class="list-unstyled">
            <li class="mb-3">
                <strong>He J., and Tiamiyu A.T.</strong> (2025). "Physics-informed neural networks in iterative form of nonlinear equations for numerical algorithms and simulations of delay differential equations." 
                <em>Physica A: Statistical Mechanics and its Applications</em>.
            </li>
            <li class="mb-3">
                <strong>Ahmad S. and Tiamiyu A.T.</strong> (2024). "Numerical simulation of time-dependent non-Newtonian compressible fluid flow in porous media: finite element method and time-dependent approach." 
                <em>International Communications in Heat and Mass Transfer</em>.
            </li>
            <li class="mb-3">
                <strong>Audu K.J., Tiamiyu A.T., et al.</strong> (2024). "Numerical assessment of some semi-analytical techniques for solving a fractional-order leptospirosis model." 
                <em>Malaysian Journal of Science</em>.
            </li>
        </ul>
        <div class="text-center">
            <a href="/publications" class="btn btn-outline-primary">
                <i class="fas fa-list"></i> View All Publications
            </a>
        </div>
    </div>
</div>

## Research Interests

<div class="row">
    <div class="col-md-6">
        <ul class="list-group">
            <li class="list-group-item"><i class="fas fa-cog text-primary me-2"></i>Inverse problems and regularization</li>
            <li class="list-group-item"><i class="fas fa-cog text-primary me-2"></i>Numerical optimization</li>
            <li class="list-group-item"><i class="fas fa-cog text-primary me-2"></i>Scientific machine learning</li>
        </ul>
    </div>
    <div class="col-md-6">
        <ul class="list-group">
            <li class="list-group-item"><i class="fas fa-cog text-success me-2"></i>Deep learning for computational imaging</li>
            <li class="list-group-item"><i class="fas fa-cog text-success me-2"></i>Partial differential equations</li>
            <li class="list-group-item"><i class="fas fa-cog text-success me-2"></i>Electrical Impedance Tomography (EIT)</li>
        </ul>
    </div>
</div>
