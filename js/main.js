const movieModule = (() => {
	//PRIVATE NAMESPACE
	// SELECT ELEMENTS
	const form = document.querySelector('.movie-form');
	const display = document.querySelector('.display');
	const movieWrapper = document.querySelector('.display2');
	/////GET SEARCH RESULTS FROM SESSION STORAGE
	const searchResults = JSON.parse(sessionStorage.getItem('searchResults')) || [];
	let movies;
	
	function displayMessage(msg, alertClass) {
		const div = document.createElement('div');
		div.classList.add('alert');
		div.classList.add(`alert-${alertClass}`);
		const errorMsg = `${msg}`;
		div.append(errorMsg);
		document.querySelector('.movie-form').prepend(div);
		//Set timeout to remove alert class after 2 seconds
		setTimeout (() => document.querySelector('.alert').remove(),2000);
	}
	//PUBLIC NAMESPACE
	return {
		////FORM SUBMIT FUNCTION
		handleSubmit: function(e) {
			e.preventDefault();
			//Capture Search Value
			const searchValue = document.querySelector('input[name="search"]').value;
			//Validate if form has value
			if (searchValue === '') {
				displayMessage('Enter search term before Submitting!', 'warning');
				return;
			} else {
				displayMessage('Submitted Successfully!', 'success');
			}
			//Call fetch function (FETCH API)
			this.fetchData(searchValue);
		},
		//FETCH API
		fetchData: async function fetchData (search) {
			const dataRequest = await fetch(`http://www.omdbapi.com/?s=${search}&apikey=7aecda84`);
			const dateResponse = await  dataRequest.json();
			const moviesArray = dateResponse.Search;
			this.render(moviesArray);
		},
		render: function(movies) {
			//SAVE SEARCH RESULTS TO SESSION STORAGE
			sessionStorage.setItem('searchResults', JSON.stringify(movies));
			const html = movies.map(movie => {
				console.log(movie);
				return this.renderResults(movie);  
			}).join('');
			//Unhide display
			display.classList.add('active');
			//add movies to html.
			display.innerHTML = html;
		},
		renderResults: function(movies) {
			//Check if image exists and if not default to a image place holder 
			let image = movies.Poster === 'N/A' ? 'https://critics.io/img/movies/poster-placeholder.png' : movies.Poster; 
	
			return `
					<div class="card" style="width: 18rem;">
						<div class="movieImg">
							<img class="card-img-top" src="${image}" alt="Movie Poster" />
						</div>
						<div class="card-body">
							<h5 class="card-title">${movies.Title}</h5>
						</div>
						<ul class="list-group list-group-flush">
							<li class="list-group-item">Released: ${movies.Year}</li>
						</ul>
						<div class="card-body">
							<a href="#" class=" btn btn-primary" onClick="movieModule.movieClicked('${movies.imdbID}')">More Details</a>
						</div>
					</div>
					
				`;
		},
		//To pass data from one page to another we  use LOCAL SESSION STORAGE (similar to local storage, the difference being session storage clears out when the browser is closed)
		movieClicked: function(id) {
			//Set local session storage to store movie id
			sessionStorage.setItem('movieId', id);
			//Then we want to change the page to movie.html
			window.location = 'movie.html';
			return false;
		},
		////GET MOVIE FUNCTION - to run when movie.html is loaded
		getMovie: async function() {
			//Retrieve the passed in ID from local storage
			const movieId = sessionStorage.getItem('movieId');
			//Call another fetch to retrieve movie data based on the passed in movieID
			const dataRequest = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=7aecda84`);
			const dataResponse = await dataRequest.json();
			const data = dataResponse;
				console.log(data);
				movieWrapper.innerHTML = `	
					<div class="row movie-card">
					<div class="col-md-6">
						<img src="${data.Poster}" class="thumbnail">
					</div>
					<div class="col-md-6">
						<h1>${data.Title}</h1>
						<ul class="list-group movies-list">
							<li class="list-group-item movieli"><strong>Released</strong>: ${data.Released}</li>
							<li class="list-group-item movieli"><strong>Genre</strong>: ${data.Genre}</li>
							<li class="list-group-item movieli"><strong>Rated</strong>: ${data.Rated}</li>
							<li class="list-group-item movieli"><strong>Runtime</strong>: ${data.Runtime}</li>
							<li class="list-group-item movieli"><strong>Language</strong>: ${data.Language}</li>
							<li class="list-group-item movieli"><strong>Director</strong>: ${data.Director}</li>
							</ul>
					</div>
				</div>
				<div class="row movie-plot">
					<div class="well">
						<h3>Plot</h3>
						${data.Plot}
						<hr>
						<a href="http://imdb.com/title/${data.imdbID}" target="_blank" class="btn btn-primary btn">View on IMDB</a>
						<a href="main.html" class="btn btn-danger btn">Back to Search</a>
					</div>
				</div>
			`;
		}
	};
})();

const form = document.querySelector('.movie-form');
form.addEventListener('submit', movieModule.handleSubmit.bind(movieModule));
const searchResults = JSON.parse(sessionStorage.getItem('searchResults')) || [];
//ON PAGE LOAD, DISPLAY searchResults (LocalSession array)
movieModule.render(searchResults);
