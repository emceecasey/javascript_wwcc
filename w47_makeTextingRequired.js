document.addEventListener("DOMContentLoaded", function () {
    console.log("Make Texting Required - LOADED");
  var cellphone = document.getElementById("address1_telephone2");
  var allowTexting = document.getElementById("w47_allowtexting");

  if (!cellphone || !allowTexting) return; // not on this page, bail out quietly

  function syncRequired() {
    if (cellphone.value.trim().length > 0) {
      allowTexting.setAttribute("required", "required");
      // optional: add your own visual required-indicator here if the portal doesn't auto-style it
    } else {
      allowTexting.removeAttribute("required");
    }
  }

  cellphone.addEventListener("blur", syncRequired);
  cellphone.addEventListener("input", syncRequired);
});
