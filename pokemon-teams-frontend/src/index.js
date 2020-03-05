const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


// 1.
const trainersContainer = document.querySelector('main');

fetch(TRAINERS_URL)
.then(resp => resp.json())
.then(trainers => {
  trainers.forEach(trainer => {
    const trainerInfo = `
    <div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
      <button data-action="add" data-trainer-id=${trainer.id}>Add Pokemon</button>
      <ul data-trainer-ul-id=${trainer.id}>
      </ul>
    </div>`;

    trainersContainer.insertAdjacentHTML('beforeend', trainerInfo);
    const trainerUl = document.querySelector(`[data-trainer-ul-id='${trainer.id}']`);
    trainer.pokemons.forEach(pokemon => {
      const pokemonInfo = `
        <li>${pokemon.nickname}(${pokemon.species})
          <button class="release" data-pokemon-id=${pokemon.id}>Release</button>
        </li>`;

      trainerUl.insertAdjacentHTML('beforeend', pokemonInfo);
    })
  })
});


trainersContainer.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'add') {
    const trainerId = e.target.dataset.trainerId;
    const trainerUl = e.target.parentNode.querySelector('ul');
    if (trainerUl.children.length < 6) {
      fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify({
          "trainer_id": trainerId
        })
      })
      .then(resp => resp.json())
      .then(pokemon => {
        const pokemonInfo = `
          <li>${pokemon.nickname}(${pokemon.species})
          <button class="release" data-pokemon-id=${pokemon.id}>Release</button>
          </li>`;

        trainerUl.insertAdjacentHTML('beforeend', pokemonInfo);
      })
    }
  };
  if(e.target.classList.contains("release")){
    const pokemonId = e.target.dataset.pokemonId;
    fetch(`${POKEMONS_URL}/${pokemonId}`, {
      method: 'DELETE'
    })
    .then(() => e.target.parentNode.remove());
  }
})
