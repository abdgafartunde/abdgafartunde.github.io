---
layout: default
title: "Home"
---

<div class="hero-section bg-light py-5">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-4 text-center">
                <img src="/assets/images/profile.jpg" alt="{{ site.author.name }}" 
                     class="rounded-circle img-fluid mb-3" style="max-width: 250px;">
            </div>
            <div class="col-md-8">
                <h1 class="display-4 mb-3">{{ site.author.name }}</h1>
                <h3 class="text-muted mb-3">{{ site.author.position }}</h3>
                <h5 class="text-secondary mb-4">{{ site.author.affiliation }}</h5>
                <p class="lead">{{ site.description }}</p>
                <div class="mt-4">
                    <a href="/research" class="btn btn-primary me-2">
                        <i class="fas fa-microscope"></i> Research
                    </a>
                    <a href="/publications" class="btn btn-outline-primary me-2">
                        <i class="fas fa-file-alt"></i> Publications
                    </a>
                    <a href="/cv" class="btn btn-outline-secondary">
                        <i class="fas fa-download"></i> CV
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container my-5">
    <div class="row">
        <div class="col-lg-8">
            <section class="mb-5">
                <h2><i class="fas fa-user-graduate text-primary"></i> About Me</h2>
                <hr>
                <p class="lead">
                    Welcome to my academic website! I am a [your position] at [your institution], 
                    specializing in [your field]. My research focuses on [brief description of your research].
                </p>
                <p>
                    [Add more detailed information about your background, education, and career highlights.]
                </p>
            </section>

            <section class="mb-5">
                <h3><i class="fas fa-bullhorn text-primary"></i> Recent News</h3>
                <hr>
                <div class="card">
                    <div class="card-body">
                        <ul class="list-unstyled">
                            <li class="mb-3">
                                <strong>{{ 'now' | date: "%B %Y" }}:</strong> 
                                New paper accepted at [Conference/Journal Name]
                            </li>
                            <li class="mb-3">
                                <strong>{{ 'now' | date: "%B %Y" }}:</strong> 
                                Presenting at [Conference Name]
                            </li>
                            <li class="mb-3">
                                <strong>{{ 'now' | date: "%B %Y" }}:</strong> 
                                Started new collaboration with [Institution/Person]
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>

        <div class="col-lg-4">
            <div class="card mb-4">
                <div class="card-header">
                    <h5><i class="fas fa-search text-primary"></i> Research Interests</h5>
                </div>
                <div class="card-body">
                    <ul class="list-unstyled">
                        {% for interest in site.research_interests %}
                        <li class="mb-2">
                            <i class="fas fa-chevron-right text-primary"></i> {{ interest }}
                        </li>
                        {% endfor %}
                    </ul>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header">
                    <h5><i class="fas fa-envelope text-primary"></i> Contact</h5>
                </div>
                <div class="card-body">
                    <p><i class="fas fa-envelope me-2"></i> {{ site.author.email }}</p>
                    <p><i class="fas fa-building me-2"></i> {{ site.author.affiliation }}</p>
                    <p><i class="fas fa-map-marker-alt me-2"></i> {{ site.author.location }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
