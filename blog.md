---
layout: page
title: "Research Blog"
description: "Exploring the Intersection of Mathematics, Machine learning, and Computational Science"
---

<div class="hero-section bg-gradient-primary text-white p-4 rounded mb-5">
    <div class="row align-items-center">
        <div class="col-md-8">
            <h1 class="display-6 mb-3">Welcome to My Research Blog</h1>
            <p class="lead mb-0">
                Sharing insights from the fascinating world of computational mathematics, 
                deep learning, and inverse problems. Join me as I explore the challenges 
                and breakthroughs in modern scientific computing.
            </p>
        </div>
        <div class="col-md-4 text-center">
            <i class="fas fa-brain fa-4x opacity-50"></i>
        </div>
    </div>
</div>

## Featured Posts

<div class="row mb-5">
    {% assign featured_posts = site.posts | where: "featured", true | limit: 2 %}
    {% if featured_posts.size > 0 %}
        {% for post in featured_posts %}
        <div class="col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                        <i class="fas fa-star me-2"></i>Featured
                    </h5>
                </div>
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="{{ post.url }}" class="text-decoration-none text-dark">{{ post.title }}</a>
                    </h5>
                    <p class="card-text">{{ post.description }}</p>
                    <div class="mb-3">
                        {% for tag in post.tags limit:3 %}
                            <span class="badge bg-secondary me-1">{{ tag }}</span>
                        {% endfor %}
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <small class="text-muted">
                        <i class="fas fa-calendar"></i> {{ post.date | date: "%B %d, %Y" }}
                        <span class="float-end">
                            <a href="{{ post.url }}" class="btn btn-sm btn-outline-primary">Read More</a>
                        </span>
                    </small>
                </div>
            </div>
        </div>
        {% endfor %}
    {% else %}
        <div class="col-12">
            <div class="card border-primary">
                <div class="card-body text-center">
                    <i class="fas fa-edit fa-3x text-primary mb-3"></i>
                    <h5>Next Post Coming Soon!</h5>
                    <p class="text-muted">I'm working on some exciting content about computational and applied mathematics, deep learning and physics-based modeling.</p>
                </div>
            </div>
        </div>
    {% endif %}
</div>

## Recent Posts

<div class="row mb-5">
    {% assign recent_posts = site.posts | limit: 6 %}
    {% if recent_posts.size > 0 %}
        {% for post in recent_posts %}
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                {% if post.image %}
                    <img src="{{ post.image }}" class="card-img-top" alt="{{ post.title }}" style="height: 200px; object-fit: cover;">
                {% else %}
                    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                        <i class="fas fa-file-alt fa-3x text-muted"></i>
                    </div>
                {% endif %}
                <div class="card-body">
                    <h6 class="card-title">
                        <a href="{{ post.url }}" class="text-decoration-none">{{ post.title }}</a>
                    </h6>
                    <p class="card-text small text-muted">{{ post.description | truncatewords: 15 }}</p>
                    <div class="mb-2">
                        {% for tag in post.tags limit:2 %}
                            <span class="badge bg-outline-secondary small">{{ tag }}</span>
                        {% endfor %}
                    </div>
                </div>
                <div class="card-footer bg-transparent small">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-muted">
                            <i class="fas fa-calendar"></i> {{ post.date | date: "%b %d, %Y" }}
                        </span>
                        {% if post.read_time %}
                            <span class="text-muted">
                                <i class="fas fa-clock"></i> {{ post.read_time }} min read
                            </span>
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>
        {% endfor %}
    {% else %}
        <div class="col-12">
            <div class="text-center py-5">
                <i class="fas fa-pen-alt fa-4x text-muted mb-4"></i>
                <h3 class="text-muted">Coming Soon!</h3>
                <p class="lead">I'm preparing some exciting content about computational mathematics and deep learning.</p>
                <p>Topics I'll be covering include:</p>
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <ul class="list-unstyled">
                            <li>🧠 Physics-informed neural networks</li>
                            <li>🔬 Inverse problems and regularization</li>
                            <li>⚡ Electrical impedance tomography insights</li>
                            <li>📊 Scientific computing best practices</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    {% endif %}
</div>

<!-- ## Explore by Category

<div class="row mb-5">
    <div class="col-md-3 mb-3">
        <div class="card text-center h-100">
            <div class="card-body">
                <i class="fas fa-brain fa-2x text-primary mb-3"></i>
                <h6 class="card-title">Deep Learning</h6>
                <p class="card-text small">Neural networks, physics-informed models, and scientific ML</p>
                <a href="/blog/category/deep-learning" class="btn btn-sm btn-outline-primary">Explore</a>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="card text-center h-100">
            <div class="card-body">
                <i class="fas fa-calculator fa-2x text-success mb-3"></i>
                <h6 class="card-title">Mathematics</h6>
                <p class="card-text small">Numerical analysis, optimization, and computational methods</p>
                <a href="/blog/category/mathematics" class="btn btn-sm btn-outline-success">Explore</a>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="card text-center h-100">
            <div class="card-body">
                <i class="fas fa-microscope fa-2x text-info mb-3"></i>
                <h6 class="card-title">Research</h6>
                <p class="card-text small">EIT, inverse problems, and medical imaging applications</p>
                <a href="/blog/category/research" class="btn btn-sm btn-outline-info">Explore</a>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="card text-center h-100">
            <div class="card-body">
                <i class="fas fa-graduation-cap fa-2x text-warning mb-3"></i>
                <h6 class="card-title">Academia</h6>
                <p class="card-text small">PhD life, conferences, and academic career insights</p>
                <a href="/blog/category/academia" class="btn btn-sm btn-outline-warning">Explore</a>
            </div>
        </div>
    </div>
</div> -->

## All Posts

{% if site.posts.size > 0 %}
<div class="card">
    <div class="card-header">
        <h5 class="mb-0">
            <i class="fas fa-list"></i> All Blog Posts ({{ site.posts.size }})
        </h5>
    </div>
    <div class="list-group list-group-flush">
        {% for post in site.posts %}
            <a href="{{ post.url }}" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">{{ post.title }}</h6>
                        {% if post.description %}
                            <p class="mb-2 text-muted">{{ post.description }}</p>
                        {% endif %}
                        {% if post.tags.size > 0 %}
                            <div>
                                {% for tag in post.tags limit:4 %}
                                    <span class="badge bg-secondary me-1">{{ tag }}</span>
                                {% endfor %}
                            </div>
                        {% endif %}
                    </div>
                    <div class="text-end ms-3">
                        <small class="text-muted">{{ post.date | date: "%b %d, %Y" }}</small>
                        {% if post.read_time %}
                            <br><small class="text-muted">{{ post.read_time }} min read</small>
                        {% endif %}
                    </div>
                </div>
            </a>
        {% endfor %}
    </div>
</div>
{% endif %}

---

## Research Insights & Updates

<div class="row mt-4">
    <div class="col-md-6">
        <div class="card border-primary">
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0"><i class="fas fa-lightbulb"></i> What I Write About</h6>
            </div>
            <div class="card-body">
                <ul class="list-unstyled mb-0">
                    <li class="mb-2">🔬 <strong>Inverse Problems:</strong> Mathematical techniques for solving EIT and other imaging challenges</li>
                    <li class="mb-2">🤖 <strong>Physics-ML Integration:</strong> Combining deep learning with physical constraints</li>
                    <li class="mb-2">⚡ <strong>Medical Imaging:</strong> Real-world applications of computational methods</li>
                    <li class="mb-0">📊 <strong>Numerical Methods:</strong> Optimization algorithms and computational techniques</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card border-success">
            <div class="card-header bg-success text-white">
                <h6 class="mb-0"><i class="fas fa-user-graduate"></i> Academic Journey</h6>
            </div>
            <div class="card-body">
                <ul class="list-unstyled mb-0">
                    <li class="mb-2">🎓 <strong>PhD Experiences:</strong> Lessons from my doctoral studies at CUHK</li>
                    <li class="mb-2">🌍 <strong>International Research:</strong> Insights from my time in Austria and Hong Kong</li>
                    <li class="mb-2">🏆 <strong>Conference Tips:</strong> How to present research and network effectively</li>
                    <li class="mb-0">💡 <strong>Career Development:</strong> Navigating academic and research careers</li>
                </ul>
            </div>
        </div>
    </div>
</div>

---

<div class="alert alert-primary border-0 mt-5">
    <div class="row align-items-center">
        <div class="col-md-8">
            <h6 class="alert-heading mb-2"><i class="fas fa-rss text-primary"></i> Stay Connected</h6>
            <p class="mb-0">
                Get notified about new posts and research updates. Subscribe to my RSS feed or connect on social media.
            </p>
        </div>
        <div class="col-md-4 text-end">
            <a href="/feed.xml" class="btn btn-outline-primary btn-sm me-2">
                <i class="fas fa-rss"></i> RSS Feed
            </a>
            <a href="https://linkedin.com/in/abdgafartunde" class="btn btn-primary btn-sm" target="_blank">
                <i class="fab fa-linkedin"></i> Follow
            </a>
        </div>
    </div>
</div>
