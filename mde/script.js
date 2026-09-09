/* ==========================================================================
   MDE Home Repair and Paint, LLC
   One script, no dependencies, no build step.

   >>> THE ONLY LINE YOU NORMALLY NEED TO EDIT IS THE NEXT ONE. <<<
   Paste the webhook URL from Zapier / Make / Formspree / a Cloudflare Worker.
   Until a real URL is here, the form runs in demo mode: it validates and shows
   the success message, but nothing is sent anywhere.
   ========================================================================== */

var WEBHOOK_URL = "PASTE_WEBHOOK_URL_HERE";

/* Where leads go if the webhook is ever down. Shown to the customer in the
   error message so a lead is never simply lost. */
var FALLBACK_PHONE = "(252) 904-0956";

(function () {
  "use strict";

  /* ---------------------------------------------------------- mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });

    // Close the menu on Escape, and put focus back on the button.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------- missing photo slots */
  /* Until the real job photos are dropped into /images/, show a designed
     "photo coming" panel instead of a browser broken-image icon. Does nothing
     once the files exist — no config, no cleanup needed. */
  function markEmpty(img) {
    var frame = img.parentNode;
    if (!frame || frame.getAttribute("data-empty") === "true") return;
    var fig = frame.parentNode;
    var step = fig ? fig.querySelector(".shot__step") : null;
    frame.setAttribute("data-empty", "true");
    frame.setAttribute("data-label", step ? step.textContent : "Photo coming");
  }

  function checkPhotos() {
    var imgs = document.querySelectorAll(".shot__frame img, .hero__media img");
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].complete && imgs[i].naturalWidth === 0) markEmpty(imgs[i]);
    }
  }

  // Images that fail after this script runs. The error event does not bubble,
  // so listen in the capture phase.
  document.addEventListener(
    "error",
    function (e) {
      var t = e.target;
      if (t && t.tagName === "IMG") markEmpty(t);
    },
    true
  );
  // And images that already failed before it ran.
  checkPhotos();
  window.addEventListener("load", checkPhotos);

  /* ---------------------------------------------------------- quote form */
  var form = document.getElementById("quote-form");
  if (!form) return;

  var successBox = document.getElementById("form-success");
  var errorBox = document.getElementById("form-error");
  var submitBtn = form.querySelector("[data-submit]");
  var submitLabel = submitBtn ? submitBtn.textContent : "";

  // Digits only; accept 10, or 11 starting with 1.
  function phoneLooksReal(value) {
    var digits = (value || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.charAt(0) === "1") digits = digits.slice(1);
    return digits.length === 10;
  }

  function setError(field, message) {
    var box = document.getElementById(field.id + "-err");
    if (message) {
      field.setAttribute("aria-invalid", "true");
      if (box) {
        box.textContent = message;
        box.setAttribute("data-show", "true");
      }
    } else {
      field.removeAttribute("aria-invalid");
      if (box) {
        box.removeAttribute("data-show");
        box.textContent = "";
      }
    }
  }

  function validate() {
    var firstBad = null;

    var name = form.elements["name"];
    if (!name.value.trim()) {
      setError(name, "Please tell us your name.");
      firstBad = firstBad || name;
    } else {
      setError(name, "");
    }

    var phone = form.elements["phone"];
    if (!phone.value.trim()) {
      setError(phone, "We need a phone number to call you back.");
      firstBad = firstBad || phone;
    } else if (!phoneLooksReal(phone.value)) {
      setError(phone, "That does not look like a 10-digit phone number.");
      firstBad = firstBad || phone;
    } else {
      setError(phone, "");
    }

    var email = form.elements["email"];
    if (email && email.value.trim() && email.value.indexOf("@") < 1) {
      setError(email, "Check the email address, or leave it blank.");
      firstBad = firstBad || email;
    } else if (email) {
      setError(email, "");
    }

    // 10 MB ceiling per photo keeps a phone upload from timing out on 4G.
    var photos = form.elements["photos"];
    if (photos && photos.files && photos.files.length) {
      var tooBig = false;
      for (var i = 0; i < photos.files.length; i++) {
        if (photos.files[i].size > 10 * 1024 * 1024) tooBig = true;
      }
      if (tooBig) {
        setError(photos, "One of those photos is over 10 MB. Send it by text instead.");
        firstBad = firstBad || photos;
      } else {
        setError(photos, "");
      }
    }

    return firstBad;
  }

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (errorBox) errorBox.hidden = true;

    var firstBad = validate();
    if (firstBad) {
      // If the bad field sits inside the collapsed "add more detail" block,
      // open it first — otherwise focus lands somewhere the user cannot see.
      var box = firstBad.closest ? firstBad.closest("details") : null;
      if (box) box.open = true;
      firstBad.focus();
      return;
    }

    var data = new FormData(form);
    data.append("page", window.location.pathname);
    data.append("submitted_at", new Date().toISOString());

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    // No webhook configured yet: validate, show success, send nothing.
    if (!WEBHOOK_URL || WEBHOOK_URL === "PASTE_WEBHOOK_URL_HERE") {
      finish();
      return;
    }

    fetch(WEBHOOK_URL, { method: "POST", body: data })
      .then(function (res) {
        if (!res.ok) throw new Error("Bad response " + res.status);
        finish();
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
        }
        showError(
          "That did not go through. Please call or text " +
            FALLBACK_PHONE +
            " and we will get right on it."
        );
      });
  });

  function finish() {
    form.hidden = true;
    if (successBox) {
      successBox.hidden = false;
      // Move focus so screen readers and keyboard users land on the message.
      successBox.setAttribute("tabindex", "-1");
      successBox.focus();
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
})();
