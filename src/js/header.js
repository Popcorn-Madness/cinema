export function header() {
  document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector("[data-menu-open]");
    const menuContainer = document.getElementById("mobile-menu__container");
    const backdrop = document.querySelector("[data-backdrop]");
    const themeSwitcher = document.getElementById("theme-switcher");
    const body = document.body;
    // Menü Aç/Kapat
    function toggleMenu() {
      const isOpen = menuContainer.classList.contains("open");
      menuContainer.classList.toggle("open", !isOpen);
      backdrop.classList.toggle("show", !isOpen);
    }
    menuButton.addEventListener("click", toggleMenu);
    backdrop.addEventListener("click", () => {
      menuContainer.classList.remove("open");
      backdrop.classList.remove("show");
    });
    // Tema Geçişi
    function applyTheme() {
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme === "dark") {
        body.classList.add("dark-theme");
        document.documentElement.setAttribute("data-theme", "dark"); // Dark temayı ayarlamak için
        themeSwitcher.classList.add("dark-mode");
      } else {
        body.classList.remove("dark-theme");
        document.documentElement.setAttribute("data-theme", "light"); // Light temayı ayarlamak için
        themeSwitcher.classList.add("light-mode");
      }
    }
    themeSwitcher.addEventListener("click", () => {
      const isDark = body.classList.contains("dark-theme");
      if (isDark) {
        body.classList.remove("dark-theme");
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        themeSwitcher.classList.remove("dark-mode");
        themeSwitcher.classList.add("light-mode");
      } else {
        body.classList.add("dark-theme");
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeSwitcher.classList.remove("light-mode");
        themeSwitcher.classList.add("dark-mode");
      }
    });
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
    }
    applyTheme();
    // === Aktif Sayfa Linkini Sakla ===
    const navLinks = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop();
    // Sayfa yüklendiğinde, saklanan aktif sayfa bilgisi varsa, ona turuncu renk ver
    const savedActivePage = localStorage.getItem("activePage");
    if (savedActivePage) {
      const activeLink = document.querySelector(
        `.nav-link[href*='${savedActivePage}']`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
    // Sayfa butonuna tıklanınca, aktif sayfa bilgisini sakla
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        const href = link.getAttribute("href");
        localStorage.setItem("activePage", href); // Tıklanan sayfa bilgisini sakla
      });
    });
  });
}
