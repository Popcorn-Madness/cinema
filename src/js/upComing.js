import axios from "axios";
export function upComing() {
  const apiKey = "6c6ff1eefb34466f1e524e319f306b8f";
  const url = "https://api.themoviedb.org/3";
  const upcomingContainer = document.getElementById("movie-container");
  async function getRandomUpcomingMovie() {
    try {
      const response = await axios.get(
        `${url}/movie/upcoming?api_key=${apiKey}&language=tr-TR`
      );
      const movies = response.data.results;
      if (movies.length === 0) {
        upcomingContainer.innerHTML = "<p>Yakında çıkacak film bulunamadı.</p>";
        return;
      }
      // Rastgele bir film seç
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      // Film kartını oluştur
      upcomingContainer.innerHTML = `
      <div class="upcoming-movie-card">
        <img src="https://image.tmdb.org/t/p/w500${randomMovie.poster_path}"
             alt="${randomMovie.title}" class="upcoming-movie-poster">
        <div class="movie-info">
        <h3 class="movie-title">${randomMovie.title}</h3>
        <div class="release-vote-popular-genre">
        <div class="release-vote">
              <p><strong>Release date:</strong> <span class="release-date-value">${formatDate(
                randomMovie.release_date
              )}</span></p>
          <p><strong>Vote / Votes:</strong><span class="vote-average">${
            randomMovie.vote_average
          }</span> / <span class="vote-count">${
        randomMovie.vote_count
      }</span></p>
        </div>
        <div class="popular-genre">
        <p><strong>Popularity:</strong> <span class="popularity">  ${randomMovie.popularity.toFixed(
          1
        )} </span></p>
          <p><strong>Genre:</strong> <span class="genre">${getGenres(
            randomMovie.genre_ids
          )}</p></span>
        </div>
        </div>
          <h3 class="about">ABOUT</h3>
          <p class="movie-overview">${randomMovie.overview}</p>
          <button class="add-to-library"> Add to my library</button>
        </div>
      </div>
    `;
      // "Add to my library" butonuna tıklama olayı
      const addButton = document.querySelector(".add-to-library");
      addButton.addEventListener("click", () => addMovieToLibrary(randomMovie));
    } catch (error) {
      console.error("Hata:", error);
      upcomingContainer.innerHTML = "<p>Film yüklenirken hata oluştu.</p>";
    }
  }
  // Film türlerini almak için yardımcı fonksiyon
  function getGenres(genreIds) {
    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return genreIds.map((id) => genreMap[id] || "Bilinmeyen Tür").join(", ");
  }
  // Tarih formatını düzenleyen fonksiyon (YYYY-AA-GG → GG.AA.YYYY)
  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  }
  // "Add to library" butonuna tıklayınca film bilgilerini localStorage'a ekleme
  function addMovieToLibrary(movie) {
    // LocalStorage'da mevcut filmleri al
    let movieLibrary = JSON.parse(localStorage.getItem("movieLibrary")) || [];
    // Eğer film zaten eklenmemişse, yeni film verisini ekle
    if (!movieLibrary.some((item) => item.id === movie.id)) {
      movieLibrary.push(movie);
      localStorage.setItem("movieLibrary", JSON.stringify(movieLibrary));
      // alert(`${movie.title} kütüphanenize eklendi!`);
    } else {
      alert(`${movie.title} zaten kütüphanenizde mevcut.`);
    }
  }
  getRandomUpcomingMovie();
}






