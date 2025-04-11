export function footer() {
    document.addEventListener("DOMContentLoaded", () => {
      const openModalBtn = document.querySelector("[data-modal-open]");
      const closeModalBtn = document.querySelector("[data-modal-close]");
      const modal = document.querySelector("[data-modal]");
      // Modal aç
      openModalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("is-hidden");
        document.body.style.overflow = "hidden";
      });
      // Modal kapat
      closeModalBtn.addEventListener("click", () => {
        modal.classList.add("is-hidden");
        document.body.style.overflow = "auto";
      });
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("is-hidden");
          document.body.style.overflow = "auto";
        }
      });
    });
  }