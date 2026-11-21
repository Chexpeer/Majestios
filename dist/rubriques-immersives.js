/* MajestiOS — interaction commune des espaces virtuels. */
(() => {
  const spaces = document.querySelectorAll(".virtual-space");
  if (!spaces.length) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  spaces.forEach((space) => {
    const scene = space.querySelector(".virtual-space-scene");
    const building = space.querySelector(".virtual-space-building");
    const floats = [...space.querySelectorAll(".virtual-space-float")];
    if (!scene || !building) return;

    scene.setAttribute("tabindex", "0");
    scene.setAttribute("role", "group");
    scene.setAttribute("aria-label", "Espace visuel interactif. Déplacez le pointeur ou utilisez les flèches pour explorer.");

    const setPosition = (x, y) => {
      if (reducedMotion) return;
      const rx = Math.max(-1, Math.min(1, x));
      const ry = Math.max(-1, Math.min(1, y));
      space.style.setProperty("--space-tilt-x", (ry * -4).toFixed(2) + "deg");
      space.style.setProperty("--space-tilt-y", (rx * 5).toFixed(2) + "deg");
      space.style.setProperty("--space-shift-x", (rx * 7).toFixed(1) + "px");
      space.style.setProperty("--space-shift-y", (ry * 5).toFixed(1) + "px");
      floats.forEach((card, i) => {
        const factor = (i + 1) * 2.2;
        card.style.setProperty("--float-shift-x", (rx * factor).toFixed(1) + "px");
        card.style.setProperty("--float-shift-y", (ry * factor * -1).toFixed(1) + "px");
      });
    };

    scene.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = scene.getBoundingClientRect();
      setPosition(((event.clientX - rect.left) / rect.width) * 2 - 1,
        ((event.clientY - rect.top) / rect.height) * 2 - 1);
    });
    scene.addEventListener("pointerleave", () => setPosition(0, 0));
    scene.addEventListener("focus", () => space.classList.add("space-is-active"));
    scene.addEventListener("blur", () => space.classList.remove("space-is-active"));

    scene.addEventListener("keydown", (event) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") setPosition(0, 0);
      else setPosition(
        (parseFloat(space.style.getPropertyValue("--space-tilt-y")) || 0) / 5 +
          (event.key === "ArrowRight" ? 0.25 : event.key === "ArrowLeft" ? -0.25 : 0),
        (parseFloat(space.style.getPropertyValue("--space-tilt-x")) || 0) / -4 +
          (event.key === "ArrowDown" ? 0.25 : event.key === "ArrowUp" ? -0.25 : 0)
      );
    });

    scene.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      space.classList.toggle("space-is-active");
      const note = space.querySelector(".virtual-space-note");
      if (note) note.textContent = space.classList.contains("space-is-active")
        ? "Espace sélectionné · poursuivez avec les cartes de parcours"
        : "Espace visuel interactif · parcours guidé";
    });
  });
})();