const allHeroes = [
  { id: 'demonhunter', name: 'Illidan Stormrage' },
  { id: 'druid', name: 'Malfurion Stormrage' },
  { id: 'hunter', name: 'Rexxar' },
  { id: 'mage', name: 'Jaina Proudmoore' },
  { id: 'paladin', name: 'Uther Lightbringer' },
  { id: 'priest', name: 'Anduin Wrynn' },
  { id: 'rogue', name: 'Valeera Sanguinar' },
  { id: 'shaman', name: 'Thrall' },
  { id: 'warlock', name: "Gul'dan" },
  { id: 'warrior', name: 'Garrosh Hellscream' },
];

// true array shuffle with Fisher-Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//lets shuffle initial array
shuffle(allHeroes);

//lets get two copies of 6 random heroes out of 10
const usedHeroes = [...allHeroes.slice(4), ...allHeroes.slice(4)];

//and shuffle them again
shuffle(usedHeroes);

const cardsWrapper = document.querySelector('.cards-wrapper');
const infoWrapper = document.querySelector('.info-wrapper');
const opponents = document.querySelector('.opponents');
const restart = document.querySelector('.restart');
let stack = [];
let pairsCounter = 0;
let movesCounter = 0;

const init = () => {
  let cards = '';
  for (hero of usedHeroes) {
    cards += `<div class='flip-container' data-hero="${hero.id}">
  <div class='flipper'>
    <div class='front'>
      <img class='cardback' src='./img/pie-cardback.png' draggable="false" alt="${hero.id}"/>
    </div>
    <div class='back'>
    <img class='hero' src='./img/${hero.id}.webp' draggable="false" alt="${hero.id}"/>
    </div>
  </div>
</div>`;
  }

  let opposition = '';
  const heroList = [...new Set(usedHeroes)].sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );
  for (hero of heroList) {
    opposition += `<li class='hero-list' data-hero-list="${hero.id}">
  <img class='logo' src='./img/${hero.id}-logo.png' alt='${hero.id}' />
  <span class='name'>${hero.name}</span>
  <span class="defeated hidden">DEFEATED</span>
  </li>`;
  }

  cardsWrapper.innerHTML = cards;
  opponents.innerHTML = opposition;
};

init();

const isStackFull = (stack) => stack.length === 3;
const isClickedItemIsACard = (item) => item.classList.contains('cardback');
const addCardToStack = (stack, card) => stack.push(card);
const flipCard = (card) => card.closest('.flipper').classList.add('is-flipped');
const unflipCard = (card) =>
  card.closest('.flipper').classList.remove('is-flipped');
const deleteFirstCardInStack = (stack) => stack.shift();
const isThereAPairOfCardsInStack = (stack) => stack.length === 2;
const areTwoCardsInStackEqual = (stack) => {
  return (
    stack[0].closest('.flip-container').dataset.hero ===
    stack[1].closest('.flip-container').dataset.hero
  );
};
const hideEqualCards = (stack) => {
  stack.forEach((item) => item.closest('.flipper').classList.add('hidden'));
};

const makeHeroInListOpaqueAndDefeated = (stack) => {
  const defeatedHero = document.querySelector(
    `[data-hero-list="${stack[1].closest('.flip-container').dataset.hero}"]`
  );
  defeatedHero.classList.add('opaque');
  defeatedHero.lastElementChild.classList.remove('hidden');
};

const clearStack = (stack) => (stack = []);

cardsWrapper.addEventListener('click', ({ target }) => {
  if (isClickedItemIsACard(target)) {
    addCardToStack(stack, target);
    flipCard(target);
    if (isStackFull(stack)) {
      unflipCard(stack[0]);
      deleteFirstCardInStack(stack);
    }
    if (isThereAPairOfCardsInStack(stack)) {
      if (areTwoCardsInStackEqual(stack)) {
        setTimeout(() => {
          hideEqualCards(stack);
          makeHeroInListOpaqueAndDefeated(stack);
          clearStack(stack);
        }, 600);
      } else {
        stack.forEach((item) =>
          setTimeout(() => {
            item.closest('.flipper').classList.remove('is-flipped');
            stack = [];
          }, 600)
        );
      }
    }
  }
});
