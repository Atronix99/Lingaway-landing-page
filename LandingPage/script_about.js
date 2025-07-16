document.addEventListener("DOMContentLoaded", () => {
  // Inicjalizacja AOS
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 800
    });
  }

  // Dynamiczny rok w stopce
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});