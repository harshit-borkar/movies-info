
const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const head = document.querySelector("header");
const main = document.querySelector("main");
const form = document.querySelector("form");
const search = document.getElementById("search");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastURL = '';
var totalPages = 100;

getMovies(APIURL); 

async function getMovies(url) {
    lastURL = url;
    const resp = await fetch(url);
    const respData = await resp.json();

    console.log(respData);

    showMovies(respData.results);
    
    currentPage = respData.page;
    nextPage = currentPage + 1;
    prevPage = currentPage - 1;
    totalPages = respData.total_pages;

    current.innerHTML = currentPage;

    if(currentPage <= 1) {
        prev.classList.add('disabled');
        next.classList.remove('disabled')
    }else if(currentPage >= totalPages) {
        prev.classList.remove('disabled');
        next.classList.add('disabled')
    }else{
        prev.classList.remove('disabled');
        next.classList.remove('disabled')
    }

    head.scrollIntoView({behavior : 'smooth'})

    return respData;
}

function showMovies(movies) {

    main.innerHTML = "";

    movies.forEach((movie) => {
        const { poster_path, title, vote_average, overview, release_date, page} = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${poster_path ? (IMGPATH + poster_path) : `https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=740&q=80`}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span>${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                <span>${overview}</span>
                <p><b>Release Date: </b>${release_date}</p>
            </div>
        `;

        main.appendChild(movieEl);
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);

        search.value = "";
    }
})

prev.addEventListener("click", () => {
    if(prevPage > 0){
        pageCall(prevPage);
    }
})


next.addEventListener("click", () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
})

function pageCall(page){
    // let lURL = lastURL.slice(0, -1);

    let urlSplit = lastURL.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('-');
    if(key[0] != 'page'){
        let url = lastURL + '&page='+page;
        getMovies(url);
    }else{
        key[1] = page.toString();
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
    }
}