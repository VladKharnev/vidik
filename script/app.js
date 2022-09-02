const API_KEY = "e0fbb552-e178-4471-9e2e-12ab59b46708"
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1"

function menu () {
    document.querySelector('.c-hamburger').addEventListener('click',function (e) {
        e.preventDefault();
       // this.classList.toggle('is-active')
       if (this.classList.contains('is-active')) {
        this.classList.remove ('is-active');
        document.querySelector('#menu').classList.remove('nav-active');
        document.body.classList.remove('body-active');
       }else {
        this.classList.add ('is-active');
        document.querySelector('#menu').classList.add('nav-active');
        document.body.classList.add('body-active');
       }
    })
    }
    menu ()

    getMovies(API_URL_POPULAR)

    async function getMovies (url){
        const resp = await fetch(url,{
            headers : {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY,
            },
        });
        const data = await resp.json();
        showMovies(data)
    }

    function showMovies (data){
        const moviesEl = document.querySelector('.movies')

        data.films.forEach(item => {
            const movieEl = document.createElement('div')
            movieEl.classList.add('movie')
            movieEl.innerHTML = `
            <div class="movie">
            <img src="${item.posterUrl}">
            <div class="movie__info">
                <div class="movie__title">${item.nameRu}</div>
                <div class="movie__category">${item.genres.map(genre => ` ${genre.genre}`)}</div>
                <div class="movie__mark movie__mark_green">${item.rating}</div>
            </div>
        </div>   
            `
        moviesEl.appendChild(movieEl)
        });
    }
