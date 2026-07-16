---
layout: page
page_class: service-detail-page booking-page
title: "Book a Call"
eyebrow: "A short first conversation"
description: "A free 20–30 minute conversation to establish context, technical fit, and possible next steps."
seo_description: "Book a free 20–30 minute introductory call with A.T. Tiamiyu to discuss research mentorship, coursework tutoring, consulting, or workshops in inverse problems and scientific machine learning."
---

<div class="service-detail-editorial booking-editorial">
  <nav class="service-detail-nav" aria-label="Booking page navigation">
    <a class="service-back-link" href="/services/"><span aria-hidden="true">&larr;</span> Services</a>
    <span class="service-nav-divider" aria-hidden="true"></span>
    <a href="#prepare">Before scheduling</a>
    <a href="#schedule">Schedule</a>
  </nav>

  <section class="editorial-section" id="prepare" aria-labelledby="prepare-heading">
    <div class="editorial-label"><p>Prepare</p></div>
    <div class="editorial-content">
      <h2 id="prepare-heading">A useful first conversation starts with a defined question</h2>
      <p class="service-detail-intro">The call is free and carries no obligation. Its purpose is to understand what you need, determine whether the topic fits my expertise, and decide whether a further conversation or a defined engagement makes sense.</p>

      <div class="booking-expectations">
        <article><span>01</span><div><h3>Describe the context</h3><p>State the topic, your current stage, and the result you are trying to obtain.</p></div></article>
        <article><span>02</span><div><h3>Identify the difficulty</h3><p>Explain where the mathematical, computational, or research problem currently becomes unclear.</p></div></article>
        <article><span>03</span><div><h3>Define the next decision</h3><p>Tell me what you hope to decide or understand after the conversation.</p></div></article>
      </div>

      <p class="booking-note">If you need to cancel, please reschedule with at least 24 hours' notice.</p>
    </div>
  </section>

  <section class="editorial-section booking-schedule-section" id="schedule" aria-labelledby="schedule-heading">
    <div class="editorial-label"><p>Schedule</p></div>
    <div class="editorial-content">
      <h2 id="schedule-heading">Share a little context before choosing a time</h2>
      <p class="service-detail-intro">These two questions help me prepare. A few precise sentences are sufficient.</p>

      <div id="calendly-intake" class="booking-panel booking-panel-editorial">
        <form id="intake-form" onsubmit="launchCalendly(event)" novalidate>
          <div class="form-field">
            <label for="calendly-reason">What brings you here? <span aria-hidden="true" class="required-mark">*</span></label>
            <select id="calendly-reason" name="reason" class="form-control" required>
              <option value="">Select one...</option>
              <option value="Mentorship">Research mentorship</option>
              <option value="Coursework tutoring">Coursework support</option>
              <option value="Team training or workshop">Team training or workshop</option>
              <option value="Consulting inquiry">Consulting inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-field">
            <label for="calendly-context">What would you like to discuss? <span aria-hidden="true" class="required-mark">*</span></label>
            <textarea id="calendly-context" name="context" rows="5" required aria-describedby="context-error" placeholder="Describe the topic, where you are in the work, and the question you would like the conversation to address." class="form-control"></textarea>
            <p id="context-error" class="form-error" role="alert">Please describe what you would like to discuss.</p>
          </div>

          <button type="submit" class="booking-submit">Continue to scheduling <span aria-hidden="true">&rarr;</span></button>
          <p class="booking-fallback">Prefer to skip the questions? <a href="https://calendly.com/abdgafartunde/30min" target="_blank" rel="noopener">Open Calendly directly</a>.</p>
        </form>
        <p id="calendly-status" class="booking-status" aria-live="polite"></p>
      </div>

      <div id="calendly-widget" class="calendly-widget"></div>
    </div>
  </section>
</div>

<script>
function launchCalendly(e) {
  e.preventDefault();

  var reasonEl = document.getElementById('calendly-reason');
  var contextEl = document.getElementById('calendly-context');
  var errorEl = document.getElementById('context-error');
  var statusEl = document.getElementById('calendly-status');
  var context = contextEl.value.trim();
  var reason = reasonEl.value;

  errorEl.style.display = 'none';
  contextEl.removeAttribute('aria-invalid');
  contextEl.removeAttribute('aria-errormessage');

  if (!reason) {
    reasonEl.reportValidity();
    return;
  }

  if (!context) {
    errorEl.style.display = 'block';
    contextEl.setAttribute('aria-invalid', 'true');
    contextEl.setAttribute('aria-errormessage', 'context-error');
    contextEl.focus();
    return;
  }

  var url = 'https://calendly.com/abdgafartunde/30min'
    + '?a1=' + encodeURIComponent(reason)
    + '&a2=' + encodeURIComponent(context);
  var widgetEl = document.getElementById('calendly-widget');

  function showWidget() {
    try {
      window.Calendly.initInlineWidget({ url: url, parentElement: widgetEl });
      widgetEl.style.display = 'block';
      document.getElementById('intake-form').style.display = 'none';
      statusEl.textContent = 'The scheduling calendar is ready below.';
      widgetEl.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } catch (error) {
      statusEl.innerHTML = 'The calendar could not be loaded. <a href="' + url + '" target="_blank" rel="noopener">Open Calendly in a new tab</a>.';
    }
  }

  if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
    showWidget();
  } else {
    var script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.onload = showWidget;
    script.onerror = function () {
      statusEl.innerHTML = 'The calendar could not be loaded. <a href="' + url + '" target="_blank" rel="noopener">Open Calendly in a new tab</a>.';
    };
    document.head.appendChild(script);
  }
}
</script>
