---
layout: page
title: "Book a Call"
eyebrow: "A short first conversation"
description: "Free 20–30 minute intro conversation. No obligation."
seo_description: "Book a free 20–30 minute intro call with A.T. Tiamiyu to discuss research mentorship, coursework tutoring, consulting, or workshops in inverse problems and scientific machine learning."
---

<section class="exp-section">
<div class="about-text">
<p>This is a free, 20–30 minute intro conversation. There is no obligation, and no pitch. If ongoing work makes sense after we talk, we will sort out the arrangement by email.</p>
<p>One request: if you need to cancel, reschedule rather than no-show. 24 hours' notice is enough.</p>
</div>
</section>

<section class="exp-section">
<h2 class="section-heading"><i class="fas fa-align-left"></i> Before You Schedule</h2>

<div class="about-text">
<p>Tell me a bit about what you are looking for. This helps me come to the call prepared rather than spending the first ten minutes on context-setting.</p>
</div>

<div id="calendly-intake" class="booking-panel">
  <form id="intake-form" onsubmit="launchCalendly(event)" novalidate>

    <div class="form-field">
      <label for="calendly-reason">
        What brings you here? <span aria-hidden="true" class="required-mark">*</span>
      </label>
      <select id="calendly-reason" name="reason" class="form-control" required>
        <option value="">Select one...</option>
        <option value="Mentorship">Mentorship</option>
        <option value="Coursework tutoring">Coursework tutoring</option>
        <option value="Team training or workshop">Team training or workshop</option>
        <option value="Consulting inquiry">Consulting inquiry</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div class="form-field">
      <label for="calendly-context">
        What would you like to discuss? <span aria-hidden="true" class="required-mark">*</span>
      </label>
      <textarea id="calendly-context" name="context" rows="4" required
        placeholder="A few sentences is enough: the topic, where you are in your work, and what you are hoping to get out of the conversation."
        class="form-control"></textarea>
      <p id="context-error" class="form-error" role="alert">
        Please describe what you would like to discuss.
      </p>
    </div>

    <button type="submit" class="button button-primary">
      Continue to scheduling &rarr;
    </button>

    <p class="booking-fallback">Prefer to skip the questions? <a href="https://calendly.com/abdgafartunde/30min" target="_blank" rel="noopener">Open Calendly directly</a>.</p>

  </form>
  <p id="calendly-status" class="booking-status" aria-live="polite"></p>
</div>

<div id="calendly-widget" class="calendly-widget">
</div>

<script>
function launchCalendly(e) {
  e.preventDefault();

  var reasonEl  = document.getElementById('calendly-reason');
  var contextEl = document.getElementById('calendly-context');
  var errorEl   = document.getElementById('context-error');
  var statusEl  = document.getElementById('calendly-status');
  var context   = contextEl.value.trim();
  var reason    = reasonEl.value;

  // Reset validation state
  errorEl.style.display = 'none';
  contextEl.removeAttribute('aria-invalid');

  if (!reason) {
    reasonEl.reportValidity();
    return;
  }

  if (!context) {
    errorEl.style.display = 'block';
    contextEl.setAttribute('aria-invalid', 'true');
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
      widgetEl.scrollIntoView({ behavior: 'smooth' });
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

</section>

<section class="exp-section">
<div class="about-text">
<p>After we talk, I will follow up by email with next steps.</p>
</div>
</section>
