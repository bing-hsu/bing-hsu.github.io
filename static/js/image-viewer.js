(function () {
    "use strict";
    var viewer = document.querySelector("[data-image-viewer]");
    if (!viewer || typeof viewer.showModal !== "function") return;

    var preview = viewer.querySelector("[data-image-preview]");
    var stage = viewer.querySelector(".image-viewer-stage");
    var caption = viewer.querySelector(".image-viewer-caption");
    var sizeButton = viewer.querySelector("[data-image-size]");
    var activeTrigger;

    function setActualSize(enabled) {
        viewer.classList.toggle("is-actual-size", enabled);
        sizeButton.setAttribute("aria-pressed", String(enabled));
        sizeButton.textContent = enabled ? viewer.dataset.fitLabel : viewer.dataset.actualLabel;
        stage.scrollTop = 0;
        stage.scrollLeft = 0;
    }

    document.querySelectorAll(".article .prose img").forEach(function (img) {
        // Preserve authored links and allow individual images to opt out.
        if (img.closest("a, button, [data-no-zoom]")) return;
        var trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "image-zoom-trigger";
        trigger.setAttribute("aria-haspopup", "dialog");
        var label = viewer.dataset.enlargeLabel + (img.alt ? ": " + img.alt : "");
        trigger.setAttribute("aria-label", label);
        trigger.title = label;
        img.parentNode.insertBefore(trigger, img);
        trigger.appendChild(img);
        trigger.addEventListener("click", function () {
            activeTrigger = trigger;
            var figure = img.closest("figure");
            var figcaption = figure && figure.querySelector("figcaption");
            preview.src = img.dataset.fullSrc || img.currentSrc || img.src;
            preview.alt = img.alt;
            caption.textContent = figcaption ? figcaption.textContent : img.alt;
            setActualSize(false);
            viewer.showModal();
            document.documentElement.classList.add("image-viewer-open");
        });
    });

    sizeButton.addEventListener("click", function () {
        setActualSize(!viewer.classList.contains("is-actual-size"));
    });
    viewer.querySelector("[data-image-close]").addEventListener("click", function () {
        viewer.close();
    });
    // Native dialog supplies Escape dismissal and modal keyboard focus behavior.
    var startedOnBackdrop = false;
    viewer.addEventListener("pointerdown", function (event) {
        startedOnBackdrop = event.target === viewer;
    });
    viewer.addEventListener("click", function (event) {
        if (startedOnBackdrop && event.target === viewer) viewer.close();
        startedOnBackdrop = false;
    });
    viewer.addEventListener("close", function () {
        document.documentElement.classList.remove("image-viewer-open");
        preview.removeAttribute("src");
        if (activeTrigger) activeTrigger.focus({ preventScroll: true });
    });
}());
