///////////////////////////////////
const API_KEY = "e0fbb552-e178-4471-9e2e-12ab59b46708";
//////////////API///////////////////////////

const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const API_URL_MOVIE_DETAILS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

//const API_URL_TOP_BEST = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1'

//const TOP_AWAIT_FILMS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=1&order=RATING&type=FILM&ratingFrom=0&ratingTo=10&yearFrom=1000&yearTo=3000&page=1'

////////////////////////////////////////////

//let API_URL_USING = "";

///////////////////////////////////////////

function menu() {
  document
    .querySelector(".c-hamburger")
    .addEventListener("click", function (e) {
      e.preventDefault();
      // this.classList.toggle('is-active')
      if (this.classList.contains("is-active")) {
        this.classList.remove("is-active");
        document.querySelector("#menu").classList.remove("nav-active");
        document.body.classList.remove("body-active");
      } else {
        this.classList.add("is-active");
        document.querySelector("#menu").classList.add("nav-active");
        document.body.classList.add("body-active");
      }
    });
}
menu();

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const data = await resp.json();


  showMovies(data);
  getPage(data)
  changePage (data)

  return data
}
function getClassByRate(vote) {
  if (vote >= 7 || vote >= '70%') {
    return "green";
  } else if (vote > 5 || vote > '50%') {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  document.querySelector(".movies").innerHTML = "";
  document.querySelector('.about__film_wrapper').innerHTML ="";

  data.films.forEach((item) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
            <div class="movie">
            <img src="${item.posterUrl}">
            <div class="movie__info">
                <div class="movie__title">${item.nameRu}</div>
                <div class="movie__category">${item.genres.map(
                  (genre) => ` ${genre.genre}`
                )}</div>
                <div class="movie__mark movie__mark_${getClassByRate(
                  item.rating
                )}">${item.rating}</div>
            </div>
        </div>   
            `;
    movieEl.addEventListener('click', ()=> openModal(item.filmId))
    moviesEl.appendChild(movieEl);
  });
}
//  Поиск 
const form = document.querySelector("form");
const search = document.querySelector("input");

form.addEventListener("keyup", (e) => {
  e.preventDefault();

  const apiSearchUrl = ` ${API_URL_SEARCH}${search.value}`;

  if (search.value) {
    getMovies(apiSearchUrl);
  } else {
    getMovies(API_URL_POPULAR);
  }
});
function retMain() {
  const main = document.querySelector("h1");
  main.addEventListener("click", () => {
    return getMovies(API_URL_POPULAR);
  });
}
retMain();

///////////////////////////////////// Modal

const modalEl = document.querySelector(".modal");
async function openModal(id) {
    const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      });
      const data = await resp.json();
  modalEl.classList.add("modal--show");
  document.body.classList.add('stop-scrolling');


  modalEl.innerHTML = `
    <div class="modal__card">
            <img class="modal__movie-backdrop" src="${data.posterUrl}" alt="">
            <h2>
              <span class="modal__movie-title"> ${data.nameRu}</span>
              <span class="modal__movie-year"> ${data.year}</span>
            </h2>
            <ul class="modal__movie-info">
              <div class="loader"></div>
              <li class="modal__movie-genre">Жанр : ${data.genres.map((el)=> `<span>${el.genre}</span>`)}</li>
              ${data.filmLength ? `<li class="modal__movie-runtime"> ${data.filmLength} мимнут</li>`: ''}
              <li >Сайт : <a class="modal__movie-stile" href="${data.webUrl}">${data.webUrl}</a></li>
              <li class="modal__movie-overvie">Описание : ${data.description}</li>
            </ul>
            <div class="modal__button-wrapper">
              <button type="button" class="modal__button-info">Подробнее о фильме</button>
              <button type="button" class="modal__button-close">Закрыть</button>
            </div>
          </div>
        </div>
    `
    const btnClose = document.querySelector(".modal__button-close");
    const btnAbout = document.querySelector('.modal__button-info')

    btnClose.addEventListener("click", () => closeModal());
    btnAbout.addEventListener('click',()=>{aboutFilm(id),closeModal()})
}
/////////////////////////////////////////////////////////////

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove('stop-scrolling');
}
window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
});

//отрисовка количества страниц///////////////////////

function getPage (data){
  const mainPages = document.querySelector('.main__page')
  mainPages.innerHTML =''
  const numbPage = data.pagesCount
  let pageId = 1;
  for (let item = 1; item <= numbPage; item++){
      const pageEl = document.createElement('span');
      pageEl.textContent = item;
      pageEl.classList.add('main__page_numb');
      pageEl.id = pageId
      mainPages.appendChild(pageEl);
      pageId++;
  }
}

/////////////////////////////////////

//выбор страницы//////////////////////
function changePage (){
  const mainPages = document.querySelector('.main__page')
  mainPages.onclick = function(event){
      const target = event.target
      if (target.tagName == 'SPAN'){
          target.classList.add('main_page_click')
          const numbPage = target.id
          const API_URL_POPULAR_PAGE = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=${numbPage}`
          getMovies(API_URL_POPULAR_PAGE)
      }
  }
}
//////////////////////////////////////////



//////////////////////отрисовка странцы о фильме/////////////////////////////
async function aboutFilm(id){
  const resp = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const data = await resp.json();

  const actors = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const actorsData = await actors.json();

  const posters = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/images?type=STILL&page=1`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const postersData = await posters.json();

  // const trailer = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/videos`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-API-KEY": API_KEY,
  //   },
  // });
  // const trailerData = await trailer.json();

  document.querySelector(".movies").innerHTML = ""
  document.querySelector('.main__page').innerHTML = ""

  let arrActors =[]
  let arrPosters =[]
  
  function actorsShow (actorsData){
    for (let i = 0; i < 7; i++){
      arrActors.push(actorsData[i].nameRu)
  }
  }

  function postersShow (postersData){
    for (let i = 0; i < 3; i++){
      arrPosters.push(postersData.items[i].imageUrl)
  }
  }
  postersShow(postersData)
  actorsShow(actorsData)
  const infoFilm = document.querySelector('.about__film_wrapper')


  infoFilm.innerHTML = `
          <div class="about__film">
          <div class="about__film-poster">
          <img class='about__film-poster-img' src="${data.posterUrl}" alt="poster">
        </div>
        <div class="about__film-info">
          <h2 class="info__name">${data.nameRu}</h2>
          <p class="info__slogan"><span class="colortext">Описание: </span>${data.description}</p>
          <p class="info__country"><span class="colortext">Cтрана: </span>${data.countries.map(
            (country) => ` ${country.country}`
          )}</p>
          <p class="info__genres"><span class="colortext">Жанр: </span>${data.genres.map(
            (genre) => ` ${genre.genre}`)}</p>
          <p class="info__year"><span class="colortext">Год: </span>${data.year}</p>
          <p class="info__raiting-imdb"><span class="colortext">Рейтинг Imbd: </span>${data.ratingImdb}</p>
          <p class="info__raiting-kinopoisk"><span class="colortext">Рейтинг Кинопоиск: </span>${data.ratingKinopoisk}</p>
          <p class="info__actors"><span class="colortext">Актёры: </span>${arrActors.map((actor) => ` ${actor}`)}</p>
        </div>
        </div>
        <div class = "posters">
        <h4 class='posters_name'>Постеры:</h4>
        </div>
        <div class = "posters__imgs">
            <div><img class='poster-img' src="${arrPosters[0]}" alt="poster"></div>
            <div><img class='poster-img' src="${arrPosters[1]}" alt="poster"></div>
            <div><img class='poster-img' src="${arrPosters[2]}" alt="poster"></div>
        </div>
        <div class = "posters">
        <h4 class='posters_name'>Трейлер:</h4>
        </div>
        <div class = "trailer__video">
            
        </div>
        `
}

////////////////////////выбор в меню//////////////////////////////////////

// function changeTop (){
//   const mainMenu = document.querySelector('.menu__selection');
//   mainMenu.onclick = function(event){
//     const target = event.target
//     if (target.tagName == 'BUTTON' && target.id == 0){
//       API_URL_USING = API_URL_TOP_BEST
//       getMovies(API_URL_USING)
//     }
//     else if((target.tagName == 'BUTTON' && target.id == 1)){
//       API_URL_USING = TOP_AWAIT_FILMS
//       getMovies(API_URL_USING)
//     }
    
//   }
// }
// changeTop ()