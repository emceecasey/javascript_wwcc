(function () {
  function init() {
    console.log("Make Texting Required - LOADED");

    var cellphone = document.getElementById("address1_telephone2");
    var allowTexting = document.getElementById("w47_allowtexting");

    if (!cellphone || !allowTexting) return; // not on this page, bail out quietly

    // Find the question's label
    var label =
      document.querySelector('label[for="w47_allowtexting"]') ||
      document.getElementById("w47_allowtexting_label");

    if (!label) {
      console.warn("Make Texting Required - label for w47_allowtexting not found");
    }

    // Build the asterisk once, then just show/hide it
    var marker = document.createElement("span");
    marker.className = "w47-required-marker";
    marker.textContent = " *";
    marker.setAttribute("aria-hidden", "true"); // screen readers get aria-required instead
    marker.style.color = "#c00";
    marker.style.display = "none";
    if (label) label.appendChild(marker);

    function syncRequired() {
      var needed = cellphone.value.trim().length > 0;

      if (needed) {
        allowTexting.setAttribute("required", "required");
        allowTexting.setAttribute("aria-required", "true");
      } else {
        allowTexting.removeAttribute("required");
        allowTexting.removeAttribute("aria-required");
      }

      marker.style.display = needed ? "inline" : "none";
    }

    cellphone.addEventListener("input", syncRequired);
    cellphone.addEventListener("change", syncRequired); // catches browser autofill
    cellphone.addEventListener("blur", syncRequired);

    syncRequired(); // handle a phone number that's already filled in on load
  }

  // Run now if the page already finished loading, otherwise wait for it
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
