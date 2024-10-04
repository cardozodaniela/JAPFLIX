const URLMovieData = "https://japceibal.github.io/japflix_api/movies-data.json"

fetch(URLMovieData)
.then(function (respuesta) {
    return respuesta.json();
}) .then(function (objeto) {
    localStorage.setItem('peliculas', JSON.stringify(objeto));
    console.log(objeto);
}) .catch(function (error) {
    console.error('Algo salió mal');
    console.error(error);
});


function Mostrarpeliculas(array) {
    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let pelicula = array[i];

        htmlContentToAppend += `

        <div id="divlista" class="row">
         <div id="divconcat" class="col-lg-9" onclick="Mostrarinformacion(${pelicula.id})">
                <h4 class="titulopelicula">${pelicula.title}</h4>
                <p class="overview">${pelicula.overview}</p>
                </div>
                <div id="estrellitas" class="col-lg-3">
                   ${getStarRating(pelicula.vote_average)}
                </div>
        </div>`;
    }

    document.getElementById("lista").innerHTML = htmlContentToAppend;
}

function getStarRating(vote_average) {
    // Convertimos la calificación a una escala de 5
    let starRating = Math.round(vote_average / 2);
    let starHTML = document.getElementById('estrellitas');

    // Generamos 5 estrellas, llenas o vacías según la calificación
    for (let i = 1; i <= 5; i++) {
        starHTML += `<span class="star ${i <= starRating ? 'filled' : ''}">&#9733;</span>`;
    }

    return starHTML;
}


function filtrarpeliculas(){
    var buscador = document.getElementById('inputBuscar');
    var textoBusqueda = buscador.value.toLowerCase();
    var listadepeliculas = JSON.parse(localStorage.getItem('peliculas'));
  filteredProductsArray = listadepeliculas.filter(pelicula => 
        pelicula.title.toLowerCase().includes(textoBusqueda) || 
        pelicula.tagline.toLowerCase().includes(textoBusqueda) || 
        pelicula.overview.toLowerCase().includes(textoBusqueda) ||
        pelicula.genres.some(genre => genre.name.toLowerCase().includes(textoBusqueda))
    );
    Mostrarpeliculas(filteredProductsArray);
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnBuscar").addEventListener("click", filtrarpeliculas);
});

function Mostrarinformacion(id) {
    const peliculas = JSON.parse(localStorage.getItem('peliculas'));
    const pelicula = peliculas.find(p => p.id === id);
    let genres = pelicula.genres.map(genre => genre.name).join(", ");
    let releaseYear = new Date(pelicula.release_date).getFullYear();
    
    let htmlContentToAppend = `
    <div>    
    <h4 class="titulopeliculadesplegable">${pelicula.title}</h4>
    </div>
        <p class="overview">${pelicula.overview}</p>
        <div id="genres">${genres}
        <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
   More
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Year: ${releaseYear}</a></li>
    <li><a class="dropdown-item" href="#">Runtime: ${pelicula.runtime} mins</a></li>
    <li><a class="dropdown-item" href="#">Budget: $${pelicula.budget}</a></li>
    <li><a class="dropdown-item" href="#">Revenue: $${pelicula.revenue}
  </ul>
</div>
        </div>
    `;

    document.getElementById("desplegable").innerHTML = htmlContentToAppend;
    
    new bootstrap.Offcanvas(document.getElementById('offcanvasTop')).show();
}