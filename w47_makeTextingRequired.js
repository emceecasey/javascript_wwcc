(function () {
  function init() {
    console.log("Make Texting Required - LOADED");

    var cellphone = document.getElementById("address1_telephone2");
    var allowTexting = document.getElementById("w47_allowtexting");

    if (!cellphone || !allowTexting) return; // not on this page, bail out quietly

    // --- Styles for the highlight (added once) ---
    var style = document.createElement("style");
    style.textContent =
      ".w47-needs-answer {" +
      "  outline: 2px dashed #c00;" +
      "  outline-offset: 3px;" +
      "  border-radius: 2px;" +
      "}" +
      ".w47-hint {" +
      "  color: #c00;" +
      "  font-size: 0.9em;" +
      "  margin-top: 4px;" +
      "}";
    document.head.appendChild(style);

    // --- Label asterisk ---
    var label =
      document.querySelector('label[for="w47_allowtexting"]') ||
      document.getElementById("w47_allowtexting_label");

    if (!label) {
      console.warn("Make Texting Required - label for w47_allowtexting not found");
    }

    var marker = document.createElement("span");
    marker.className = "w47-required-marker";
    marker.textContent = " *";
    marker.setAttribute("aria-hidden", "true");
    marker.style.color = "#c00";
    marker.style.display = "none";
    if (label) label.appendChild(marker);

    // --- Short hint under the field ---
    var hint = document.createElement("div");
    hint.id = "w47_allowtexting_hint";
    hint.className = "w47-hint";
    hint.textContent = "Since you gave us a cell number, please answer this question.";
    hint.style.display = "none";
    allowTexting.insertAdjacentElement("afterend", hint);

    // Works whether the field is a dropdown, a single input, or a radio group
    function isAnswered() {
      var tag = allowTexting.tagName;
      if (tag === "SELECT" || (tag === "INPUT" && allowTexting.type !== "radio")) {
        return allowTexting.value !== "" && allowTexting.value !== "-1";
      }
      return !!allowTexting.querySelector("input:checked");
    }

    function sync() {
      var needed = cellphone.value.trim().length > 0;
      var showWarning = needed && !isAnswered();

      if (needed) {
        allowTexting.setAttribute("required", "required");
        allowTexting.setAttribute("aria-required", "true");
      } else {
        allowTexting.removeAttribute("required");
        allowTexting.removeAttribute("aria-required");
      }

      marker.style.display = needed ? "inline" : "none";

      allowTexting.classList.toggle("w47-needs-answer", showWarning);
      hint.style.display = showWarning ? "block" : "none";
      if (showWarning) {
        allowTexting.setAttribute("aria-describedby", hint.id);
      } else {
        allowTexting.removeAttribute("aria-describedby");
      }
    }

    cellphone.addEventListener("input", sync);
    cellphone.addEventListener("change", sync); // catches browser autofill
    cellphone.addEventListener("blur", sync);
    allowTexting.addEventListener("change", sync); // clears the highlight once answered

    sync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
