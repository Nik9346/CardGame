document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.row')
    const modal = document.querySelector('.modal')
    const modalImage = document.querySelector('.modal-img')
    const modalGenre = document.querySelector('.modal-genre')
    const modalDeveloper = document.querySelector('.modal-developer')
    const modalGameName = document.querySelector('.modal-name')
    const modalGamePublisher = document.querySelector('.modal-publisher')
    const modalGameSummary = document.querySelector('.modal-summary')

    // Costruisco l'oggetto chiamato Game
    class Game {
        constructor(id, name, publisher, description, rating, genre, developer, image, summary) {
            this.id = id;
            this.name = name
            this.publisher = publisher
            this.description = description
            this.rating = rating
            this.genre = genre
            this.developer = developer
            this.image = image
            this.summary = summary
        }
    }
    // Costruisco la chiamata al backend per ottenere i dati
    class BackendServices {
        constructor() {
            this.baseUrl = 'http://localhost:3001/games';
            this.game = []
            this.singleGame = ''
        }
    //  chiamata per ottenere i dati di tutti i giochi
        getData() {
            fetch(this.baseUrl, {})
                .then(res => res.json())
                .then((data) => {
                    data.result.forEach(game => {
                        const newGame = new Game(game.id, game.name, game.publisher, game.description, game.rating, game.genre, game.developer, game.image, game.summary);
                        this.game.push(newGame)
                    })
                    getGame(this.game)
                })
        }
    // chiamata per ottenere i dati dei singoli giochi e popolare la modale
        getSingleGame(id) {
            fetch(`${this.baseUrl}/${id}`)
                .then(res => res.json())
                .then((data) => {
                    this.singleGame = new Game(data.result.id, data.result.name, data.result.publisher, data.result.description, data.result.rating, data.result.genre, data.result.developer, data.result.image, data.result.summary)
    // popolo la modale con i dati ricevuti
                    getGameModale(this.singleGame)
                })


        }
    }
    // Chiamata al backendServices per ottenere i dati di tutti i giochi
    const backendServices = new BackendServices()
    backendServices.getData();

    // Funzione che permette di popolare la modale con i dati del singolo gioco
    const getGameModale = (element) => {
        modalImage.src = element.image
        modalDeveloper.innerHTML = element.developer
        modalGameName.innerHTML = element.name
        modalGamePublisher.innerHTML = element.publisher
        modalGameSummary.innerHTML = element.summary
        modalGenre.innerHTML = element.genre
        modal.classList.add('modal--open')
        const buttonClosemodal = document.querySelector('.modal-close')
        buttonClosemodal.addEventListener('click', function () {
            modal.classList.remove('modal--open')
        })

    }

    // Funzione che permette di ottenere le locandine di ogni singolo gioco e stamparle in pagina
    const getGame = (element) => {
        element.forEach(game => {
            template =
                `<div class="col mb-5">
                <div class="card h-100">
                <img src=${game.image} class="card-img-top" alt=${game.name} />
                <div class="card-body d-flex flex-column justify-content-between">
                <h2 class="card-title fs-5">${game.name}</h2>
                <h3 class="fs-6">${game.publisher}</h3>

                <p class="card-text">${game.description}</p>`
            // Funzione che permette di convertire il rating del gioco in stelline
            template +=
                `<p class="card-rating">${getGameStarsRating(game.rating)}</p>
                <p class="card-details">
                <span class="badge text-bg-info">New</span>
                <span class="badge text-bg-light">${game.genre}</span>
                <span class="badge text-bg-light">${game.developer}</span>
                </p>
                <div data-id=${game.id} class="btn btn-primary btn--view-more">View More details</div>
                </div>
                </div>
            </div>`
            container.innerHTML += template;
            // Prendo tutti i pulsanti che permettono di aprile la modale e lancio la funzione che ottiene id e lo assegna alla chiamata per ottenere il singolo gioco
            const btn = document.querySelectorAll('.btn--view-more')
            btn.forEach(btnOpen => {
                btnOpen.addEventListener('click', function () {
                    const id = btnOpen.getAttribute('data-id')
                    backendServices.getSingleGame(id)
                })
            });
        })
    }
    // Funzione che trasforma il rating in stelline
    const getGameStarsRating = (rating) => {
        const ratingRound = Math.round(rating)
        console.log(ratingRound);
        let stars = ''
        for (let index = 0; index < ratingRound; index++) {
            stars += '⭐'
        }
        return stars
    }


})