---
layout: page
title: "Blog"
description: "Thoughts on Mathematics, Research, and Academic Life"
---

<p class="blog-intro">I write about computational mathematics, scientific machine learning, inverse problems, and life in academia. These posts reflect my research journey and insights I've gathered along the way.</p>

<div class="blog-posts">
{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
<article class="blog-card">
  <div class="blog-card-content">
    <div class="blog-card-date">
      <span class="date-day">{{ post.date | date: "%d" }}</span>
      <span class="date-month">{{ post.date | date: "%b %Y" }}</span>
    </div>
    <div class="blog-card-text">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p class="post-excerpt">{{ post.description }}</p>
      {% if post.tags.size > 0 %}
      <div class="post-tags">
        {% for tag in post.tags limit:3 %}
        <span class="tag">{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </div>
</article>
{% endfor %}
</div>

{% if site.posts.size == 0 %}
<p class="text-muted">No posts yet. Check back soon for updates on computational mathematics, inverse problems, and scientific computing.</p>
{% endif %}
