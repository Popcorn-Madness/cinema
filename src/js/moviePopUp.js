document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("movie-popup-overlay")) {
      const popupOverlay = document.createElement("div");
      popupOverlay.id = "movie-popup-overlay";
      popupOverlay.style.cssText = `
        display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background-color:rgba(0, 0, 0, 0.8); z-index:9999; align-items:center; justify-content:center;
      `;
      document.body.appendChild(popupOverlay);
      popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) closeMoviePopup();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMoviePopup();
      });
    }
    setupMovieCardListeners();
  });
  function addMovieIdsToCards() {
    document.querySelectorAll(".movie-card").forEach((card) => {
      card.style.cursor = "pointer";
      if (!card.dataset.movieId) {
        const title = card.querySelector("h3")?.textContent;
        if (title) searchForMovieId(title, card);
      }
    });
  }
  async function searchForMovieId(title, element) {
    try {
      const apiKey = "6c6ff1eefb34466f1e524e319f306b8f";
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=tr-TR&query=${encodeURIComponent(
        title
      )}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results?.length > 0) {
        element.dataset.movieId = data.results[0].id;
      }
    } catch (error) {
      console.error("Movie ID search error:", error);
    }
  }
  function setupMovieCardListeners() {
    addMovieIdsToCards();
    document.body.addEventListener("click", function (e) {
      const movieCard = e.target.closest(".movie-card");
      if (!movieCard) return;
      const movieId = movieCard.dataset.movieId;
      if (movieId) {
        showMoviePopup(movieId);
      } else {
        const title = movieCard.querySelector("h3")?.textContent;
        if (title) searchAndShowMovie(title);
      }
    });
  }
  async function searchAndShowMovie(title) {
    try {
      const apiKey = "6c6ff1eefb34466f1e524e319f306b8f";
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=tr-TR&query=${encodeURIComponent(
        title
      )}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results?.length > 0) {
        showMoviePopup(data.results[0].id);
      }
    } catch (error) {
      console.error("Search and show error:", error);
    }
  }
  async function showMoviePopup(movieId) {
    const popupOverlay = document.getElementById("movie-popup-overlay");
    if (!popupOverlay) return;
    popupOverlay.innerHTML = `<div style="...">Loading...</div>`;
    popupOverlay.style.display = "flex";
    try {
      const apiKey = "6c6ff1eefb34466f1e524e319f306b8f";
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=tr-TR`;
      const response = await fetch(url);
      const movie = await response.json();
      const isMobile = window.innerWidth < 768;
      const popupContent = document.createElement("div");
      popupContent.style.cssText = `
        position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
        background-color:#222; color:white; padding:20px; border-radius:10px;
        width:90%; max-width:800px; max-height:80vh; overflow:auto; box-shadow:0 0 20px rgba(248, 119, 25, 0.3);
      `;
      popupContent.innerHTML = `
        <div style="position:relative;">
          <span style="position:absolute; top:0; right:0; font-size:24px; cursor:pointer; color:#aaa;">&times;</span>
          <div class="popup-content-wrapper" style="display:flex; flex-direction:${
            isMobile ? "column" : "row"
          }; gap:15px;">
            <div class="popup-image" style="${
              !isMobile ? "flex:0 0 40%;" : ""
            } text-align:center;">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="${
        movie.title
      }" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:8px;">
            </div>
            <div class="popup-details" style="${
              !isMobile ? "flex:1;" : ""
            } display:flex; flex-direction:column;">
              <h2 style="color:#f87719;">${movie.title}</h2>
              <p><strong>Release Date:</strong> ${movie.release_date}</p>
              <p><strong>Rating:</strong> ${movie.vote_average}/10</p>
              <p><strong>Genres:</strong> ${movie.genres
                .map((g) => g.name)
                .join(", ")}</p>
              <h3>Overview</h3>
              <p>${movie.overview || "No overview available."}</p>
              <button id="add-to-library" style="margin-top:auto; padding:10px 15px; background:linear-gradient(141.22deg, #FFC226 9.4%, #F84119 91.91%); color:white; border:none; border-radius:74px; cursor:pointer;">Add to my library</button>
            </div>
          </div>
        </div>
      `;
      popupOverlay.innerHTML = "";
      popupOverlay.appendChild(popupContent);
      popupContent
        .querySelector("span")
        .addEventListener("click", closeMoviePopup);
      popupContent
        .querySelector("#add-to-library")
        .addEventListener("click", function () {
          addToLibrary(movie);
          this.textContent = "Added to library";
          this.style.opacity = "0.7";
          this.disabled = true;
        });
    } catch (error) {
      popupOverlay.innerHTML = `<div style="...">Error loading movie details.<button onclick="closeMoviePopup()">Close</button></div>`;
    }
  }
  function addToLibrary(movie) {
    let myLibrary = JSON.parse(localStorage.getItem("movieLibrary") || "[]");
    if (!myLibrary.some((item) => item.id === movie.id)) {
      myLibrary.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genres.map((g) => g.id),
        added_date: new Date().toISOString(),
      });
      localStorage.setItem("movieLibrary", JSON.stringify(myLibrary));
    }
  }
  function closeMoviePopup() {
    const popupOverlay = document.getElementById("movie-popup-overlay");
    if (popupOverlay) popupOverlay.style.display = "none";
  }
  setInterval(addMovieIdsToCards, 3000);
  window.closeMoviePopup = closeMoviePopup;