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
  { id: 38, name: "Absürd" },
];
window.onload = function () {
  populateGenreDropdown();
  loadLibraryMovies();
  const genreSelect = document.querySelector(".genreSelect");
  genreSelect?.addEventListener("change", (e) => {
    loadLibraryMovies(e.target.value);
  });
};
function loadLibraryMovies(genreId = "") {
  const catalog = document.querySelector(".library-catalog");
  catalog.innerHTML = "";
  let movieLibrary = JSON.parse(localStorage.getItem("movieLibrary")) || [];
  const filtered = genreId
    ? movieLibrary.filter((m) => m.genre_ids.includes(parseInt(genreId)))
    : movieLibrary;
  if (filtered.length === 0) {
    catalog.innerHTML = `<div class="no-results-message"><p>OOPS...</p><p>Your library is empty..</p></div>`;
    return;
  }
  filtered.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "movie-card-library";
    card.dataset.movieId = movie.id;
    card.innerHTML = `
      <div class="image-container">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }">
      </div>
      <div class="movie-details-library">
        <div class="movie-name-library">
          <h3>${movie.title}</h3>
          <p>${getGenres(movie.genre_ids).join(", ")}</p>
        </div>
        <div class="stars">${getStars(movie.vote_average)}</div>
      </div>
      <div class="delete-btn">
        <i class="fas fa-trash-alt" title="Sil"></i>
      </div>
    `;
    card.querySelector(".delete-btn").addEventListener("click", () => {
      movieLibrary = movieLibrary.filter((m) => m.id !== movie.id);
      localStorage.setItem("movieLibrary", JSON.stringify(movieLibrary));
      loadLibraryMovies(genreId);
    });
    catalog.appendChild(card);
  });
}
function getStars(voteAverage) {
  let stars = "";
  let fullStars = Math.floor(voteAverage / 2);
  for (let i = 0; i < 5; i++) {
    stars +=
      i < fullStars
        ? `<span class="fa fa-star checked"></span>`
        : `<span class="fa fa-star"></span>`;
  }
  return stars;
}
function getGenres(genreIds) {
  return genreIds.map((id) => {
    const genre = genresList.find((g) => g.id === id);
    return genre ? genre.name : "Bilinmiyor";
  });
}
function populateGenreDropdown() {
  const select = document.querySelector(".genreSelect");
  select.innerHTML = `<option value="">All Genres</option>`;
  genresList.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    select.appendChild(option);
  });
}
