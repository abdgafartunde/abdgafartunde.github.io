---
layout: page
title: Blog
permalink: /blog/
---

{% if site.posts.size > 0 %}
<ul class="post-list">
{% for post in site.posts %}
  <li class="post-item">
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p class="post-meta">{{ post.date | date: "%B %d, %Y" }}</p>
    {% if post.excerpt %}
    <p>{{ post.excerpt }}</p>
    {% endif %}
  </li>
{% endfor %}
</ul>
{% else %}
<p>No blog posts yet. Check back soon!</p>
{% endif %}

<style>
	.post-list { list-style: none; }
	.post-item { 
		margin-bottom: 2rem; 
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
	}
	.post-item:last-child { border-bottom: none; }
	.post-item h3 { margin-bottom: 0.5rem; }
	.post-item h3 a { 
		color: #2c3e50; 
		text-decoration: none;
	}
	.post-item h3 a:hover { color: #3498db; }
	.post-meta { 
		color: #7f8c8d; 
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}
</style>
