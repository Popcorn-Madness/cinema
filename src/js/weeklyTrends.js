import axios from "axios";
export async function getMovies() {
  const apiKey = "6c6ff1eefb34466f1e524e319f306b8f";
  const url = "https://api.themoviedb.org/3";
  try {
    // Popüler filmleri almak için API'yi çağır
    const response = await axios.get(
      `${url}/movie/popular?api_key=${apiKey}&language=tr-TR`
    );
    console.log("Veri:", response.data);
    const movies = response.data.results;
    // Kontrol: Eğer filmler varsa
    if (movies.length > 0) {
      // 3 farklı div'e filmleri ekle
      const movieDivs = [".img", ".img1", ".img2"];
      movieDivs.forEach((selector, index) => {
        const movie = movies[index];
        const imgContainer = document.querySelector(selector);
        if (imgContainer) {
          const movieDiv = document.createElement("div");
          movieDiv.classList.add("movie-card");
          movieDiv.dataset.movieId = movie.id;
          movieDiv.style.cursor = "pointer";
          movieDiv.innerHTML = `
            <div class="image-container">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path || ""
              }" alt="${movie.title}" width="280" height="406">
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
          imgContainer.appendChild(movieDiv);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}
// Yıldızları oluşturmak için fonksiyon
function getStars(voteAverage) {
  let stars = "";
  const fullStars = Math.floor(voteAverage / 2); // 1-10 arasında olduğu için 2 ile bölüyoruz
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
