---
layout: page
title: "Blog"
description: "Thoughts on Mathematics and Machine Learning"
---

## Recent Posts

{% for post in site.posts %}
**[{{ post.title }}]({{ post.url }})**  
{{ post.date | date: "%B %d, %Y" }}  
{{ post.description }}

---
{% endfor %}

{% if site.posts.size == 0 %}
No posts yet. Check back soon for updates on computational mathematics, inverse problems, and scientific computing.
{% endif %}
