import axios from "axios";
let apiKey = "6c6ff1eefb34466f1e524e319f306b8f";
let url = "https://api.themoviedb.org/3";
// Sayfa bilgileri
let currentPage = 1; // Başlangıç sayfası
let totalPages = 1; // Toplam sayfa sayısı
let pageGroupStart = 1; // Grupların başlangıcı (ilk grup 1-3)
window.addEventListener("DOMContentLoaded", () => {
  catalogFun(currentPage); // İlk sayfayı yükle
  initializeSearch(); // Arama fonksiyonunu başlat
});
// Film kataloğunu al ve sayfalama butonlarını oluştur
export async function catalogFun(page = 1, query = "") {
  // DOM'dan catalog öğesini seç
  let catalog = document.querySelector(".catalog");
  console.log(catalog);
  // catalog öğesinin doğru şekilde seçildiğini kontrol et
  if (!catalog) {
    console.error(
      "Catalog öğesi bulunamadı! Lütfen HTML'de .catalog öğesinin bulunduğundan emin olun."
    );
    return; // Eğer catalog bulunamazsa fonksiyonu durdur
  }
  catalog.innerHTML = ""; // Önceden var olan içeriği temizle
  try {
    // API URL'si
    let endpoint = query
      ? `${url}/search/movie?api_key=${apiKey}&language=tr-TR&page=${page}&query=${query}`
      : `${url}/movie/popular?api_key=${apiKey}&language=tr-TR&page=${page}`;
    // API isteğini gönder
    const response = await axios.get(endpoint);
    let movies = response.data.results;
    totalPages = response.data.total_pages; // Toplam sayfa sayısını al
    // Filmleri ekleyelim
    if (movies.length === 0) {
      catalog.innerHTML =
        "<div class='no-results'>" +
        "<p>Oops...</p>" +
        " <p>We are sorry !</p>" +
        "<p>We don't have any results matching your search.</p>" +
        "</div>";
    } else {
      // Filmler varsa, her birini listele
      movies.forEach((movie) => {
        let movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-card");
        movieDiv.innerHTML = `
          <div class="image-container">
            <img src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="${movie.title}">
          </div>
          <div class="movie-details">
            <div class="movie-name">
              <h3>${movie.title}</h3>
              <p>${getGenres(movie.genre_ids).join(", ")}</p>
            </div>
            <div class="stars">
              ${getStars(movie.vote_average)}
            </div>
          </div>
        `;
        catalog.appendChild(movieDiv);
      });
    }
    // Sayfa butonlarını oluştur
    createPaginationButtons(query);
  } catch (error) {
    console.error("Hata:", error);
  }
}
// Sayfa butonlarını oluştur (3'lü gruplar halinde)
function createPaginationButtons(query = "") {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = ""; // Önceden var olan butonları temizle
  // Önceki grup butonunu ekle
  if (pageGroupStart > 1) {
    let prevGroupButton = document.createElement("button");
    prevGroupButton.innerText = "Prev";
    prevGroupButton.classList.add("pagination-button");
    prevGroupButton.addEventListener("click", () => {
      pageGroupStart -= 3;
      catalogFun(pageGroupStart, query); // Yeni grup sayfalarını yükle
    });
    paginationContainer.appendChild(prevGroupButton);
  }
  // 3 sayfa numarasını grupla
  for (let i = pageGroupStart; i < pageGroupStart + 3 && i <= totalPages; i++) {
    let button = document.createElement("button");
    button.innerText = i;
    button.classList.add("pagination-button");
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i; // Yeni sayfa numarasını güncelle
      catalogFun(i, query); // Yeni sayfayı çek
    });
    paginationContainer.appendChild(button);
  }
  // Sonraki grup butonunu ekle
  if (pageGroupStart + 3 <= totalPages) {
    let nextGroupButton = document.createElement("button");
    nextGroupButton.innerText = "Next";
    nextGroupButton.classList.add("pagination-button");
    nextGroupButton.addEventListener("click", () => {
      pageGroupStart += 3;
      catalogFun(pageGroupStart, query); // Yeni grup sayfalarını yükle
    });
    paginationContainer.appendChild(nextGroupButton);
  }
}
// Yıldızları oluşturmak için fonksiyon
function getStars(voteAverage) {
  let stars = "";
  let fullStars = Math.floor(voteAverage / 2);
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += `<span class="fa fa-star checked"></span>`;
    } else {
      stars += `<span class="fa fa-star"></span>`;
    }
  }
  return stars;
}
// Türleri almak için (Türler film API'sinde ID ile gelir)
function getGenres(genreIds) {
  const genresList = [
    { id: 28, name: "Aksiyon" },
    { id: 12, name: "Macera" },
    { id: 16, name: "Animasyon" },
    { id: 35, name: "Komedi" },
    { id: 80, name: "Suç" },
    { id: 99, name: "Belgesel" },
    { id: 18, name: "Dram" },
    { id: 10751, name: "Aile" },
    { id: 14, name: "Fantastik" },
    { id: 36, name: "Tarih" },
    { id: 27, name: "Korku" },
    { id: 10402, name: "Müzik" },
    { id: 9648, name: "Gizem" },
    { id: 10749, name: "Romantik" },
    { id: 878, name: "Bilim Kurgu" },
    { id: 10770, name: "Televizyon" },
    { id: 53, name: "Gerilim" },
    { id: 10752, name: "Savaş" },
    { id: 37, name: "Western" },
  ];
  return genreIds.map((id) => {
    const genre = genresList.find((g) => g.id === id);
    return genre ? genre.name : "Bilinmiyor";
  });
}
// Arama işlevini başlatan fonksiyon
function initializeSearch() {
  const searchButton = document.getElementById("search-btn");
  const searchInput = document.getElementById("genre-select");
  // Arama butonuna tıklandığında
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      catalogFun(1, query); // Arama yap
    } else {
      catalogFun(1); // Arama yapılmazsa, popüler filmleri göster
    }
  });
  // Arama input'una her yazıldığında arama yapmak için
  searchInput.addEventListener("keyup", (event) => {
    const query = searchInput.value.trim();
    if (event.key === "Enter" && query) {
      catalogFun(1, query); // Arama yap
    }
  });
}
