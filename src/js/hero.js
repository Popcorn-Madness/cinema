import axios from "axios";

export function hero() {
  const heroSection = document.querySelector(".hero-container");
  const modal = document.getElementById("movieModal");
  const closeModalButton = document.querySelector(".close-btn");
  const trailerContainer = document.getElementById("trailerContainer");
  const trailerIframe = document.getElementById("trailerIframe");

  let genreMap = {}; // Genre id -> name eşlemesi için

  async function fetchGenres() {
    const key = "cccc5e6104b30f55a3f3b525ec4830b1";
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`
      );
      const genres = response.data.genres;
      genres.forEach((genre) => {
        genreMap[genre.id] = genre.name;
      });
    } catch (error) {
      console.error("Genre listesi alınamadı", error);
    }
  }

  function getGenreNames(genreIds) {
    return genreIds.map((id) => genreMap[id] || "Unknown");
  }

  async function getTrendMovies() {
    const key = "cccc5e6104b30f55a3f3b525ec4830b1";
    const url = "https://api.themoviedb.org/3";
    await fetchGenres(); // Önce genre'ları çek

    try {
      const response = await axios.get(
        `${url}/movie/popular?api_key=${key}&language=tr-TR`
      );
      const movies = response.data.results;
      if (movies.length > 0) {
        const movie = movies[Math.floor(Math.random() * movies.length)];
        displayMovie(movie);
      } else {
        displayDefaultHero();
      }
    } catch (error) {
      console.log(error);
      displayDefaultHero();
    }
  }

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

  function displayMovie(movie) {
    // heroSection.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`;
    heroSection.style.backgroundImage = `
  linear-gradient(to right, #111 40%, rgba(17, 17, 17, 0) 80%),
  url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})
`;

    heroSection.innerHTML = `
      <div class="hero-content">
        <h1>${movie.title}</h1>
        <p class="star">${getStars(movie.vote_average)}</p>
        <p class="overview">${movie.overview}</p>
        <button class="trailer">Watch Trailer</button>
        <button class="detail">More Details</button>
      </div>`;

    const watchTrailerButton = document.querySelector(".trailer");
    watchTrailerButton.addEventListener("click", (e) => {
      e.preventDefault();
      getTrailer(movie.id);
    });

    const moreDetailsButton = document.querySelector(".detail");
    moreDetailsButton.addEventListener("click", (e) => {
      e.preventDefault();
      showDetails(movie);
    });
  }

  function displayDefaultHero() {
    heroSection.innerHTML = `
      <div class="hero-content-default">
        <h1>Let’s Make Your Own Cinema</h1>
        <p>Is a guide to creating a personalized movie theater experience. You'll need a projector, screen, and speakers.</p>
        <button class="started">Get Started</button>
      </div>`;
  }

  async function getTrailer(movieId) {
    const key = "cccc5e6104b30f55a3f3b525ec4830b1";
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${key}&language=en-US`;

    try {
      const response = await axios.get(url);
      const trailer = response.data.results.find(
        (video) => video.type === "Trailer"
      );

      if (trailer) {
        const trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
        trailerIframe.src = trailerUrl;
        trailerContainer.style.display = "block";
        modal.style.display = "block";
      } else {
        alert("Sorry, no trailer available.");
      }
    } catch (error) {
      console.error("Error fetching trailer", error);
      alert("Sorry, there was an issue fetching the trailer.");
    }
  }

  function showDetails(movie) {
    const modalContent = document.querySelector(".modal-content");
    const modalBody = modalContent.querySelector(".modal-body");
    modalBody.innerHTML = "";

    // Poster div
    const posterDiv = document.createElement("div");
    posterDiv.classList.add("modal-poster");

    const moviePoster = document.createElement("img");
    moviePoster.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    moviePoster.alt = "Movie Poster";
    moviePoster.classList.add("hero-modal-movie-poster");

    posterDiv.appendChild(moviePoster);

    // Bilgiler div
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("hero-modal-info");

    const movieTitle = document.createElement("h2");
    movieTitle.textContent = movie.title;
    infoDiv.appendChild(movieTitle);

    const movieReleaseDate = document.createElement("p");
    movieReleaseDate.textContent = `RELEASE DATE: ${movie.release_date}`;
    infoDiv.appendChild(movieReleaseDate);

    const movieRating = document.createElement("p");
    movieRating.innerHTML = `RATİNG: ${getStars(movie.vote_average)}`;
    infoDiv.appendChild(movieRating);

    const genreNames = getGenreNames(movie.genre_ids);
    const movieGenres = document.createElement("p");
    movieGenres.textContent = `GENRES: ${genreNames.join(", ")}`;
    infoDiv.appendChild(movieGenres);

    const movieDescription = document.createElement("p");
    movieDescription.textContent =
      movie.overview || "No description available.";
    infoDiv.appendChild(movieDescription);

    // Tümünü modal body'ye ekle
    modalBody.appendChild(posterDiv);
    modalBody.appendChild(infoDiv);

    // Modal'ı göster
    modal.style.display = "block";
  }

  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
    trailerContainer.style.display = "none";
    trailerIframe.src = "";
  });

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      trailerContainer.style.display = "none";
      trailerIframe.src = "";
    }
  };

  getTrendMovies();
}
