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

const cardsWrapper = document.querySelector('.cards-wrapper');
const infoWrapper = document.querySelector('.info-wrapper');
const opponents = document.querySelector('.opponents');
const message = document.querySelector('.message');
let stack;
let pairsCounter;
let movesCounter;
let lastCardClickedId;
let usedHeroes;

const init = () => {
  shuffle(allHeroes);
  usedHeroes = [...allHeroes.slice(4), ...allHeroes.slice(4)];
  shuffle(usedHeroes);
  stack = [];
  pairsCounter = 0;
  movesCounter = 0;
  lastCardClickedId = -1;
  let cards = '';
  for (let i = 0; i < usedHeroes.length; i++) {
    cards += `<div class='flip-container' data-hero="${usedHeroes[i].id}" data-id="${i}">
  <div class='flipper'>
    <div class='front'>
      <img class='cardback' src='./img/pie-cardback.png' draggable="false" alt="${usedHeroes[i].id}"/>
    </div>
    <div class='back'>
    <img class='hero' src='./img/${usedHeroes[i].id}.webp' draggable="false" alt="${usedHeroes[i].id}"/>
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
  message.innerText = `Good luck!`;
};

const endGame = () => {
  message.innerText = `Congratulation! You won in ${movesCounter} moves!`;
};

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
const areBothCardsFlipped = (card1, card2) => {
  return (
    card1.closest('.flipper').classList.contains('is-flipped') &&
    card2.closest('.flipper').classList.contains('is-flipped')
  );
};

const areTwoCardsIdentical = (cardOne, cardTwo) => {
  return (
    cardOne?.closest('.flip-container').dataset.id ===
    cardTwo.closest('.flip-container').dataset.id
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

const handleClick = ({ target }) => {
  if (isClickedItemIsACard(target)) {
    movesCounter++;
    if (
      lastCardClickedId === target.closest('.flip-container').dataset.id &&
      lastCardClickedId ===
        stack[stack.length - 1].closest('.flip-container').dataset.id
    ) {
      console.log('Same card');
    } else {
      addCardToStack(stack, target);
      lastCardClickedId = target.closest('.flip-container').dataset.id;
    }
    flipCard(target);
    if (isStackFull(stack)) {
      unflipCard(stack[0]);
      deleteFirstCardInStack(stack);
    }
    if (isThereAPairOfCardsInStack(stack)) {
      if (
        areTwoCardsInStackEqual(stack) &&
        areBothCardsFlipped(stack[stack.length - 1], stack[stack.length - 2])
      ) {
        setTimeout(() => {
          hideEqualCards(stack);
          makeHeroInListOpaqueAndDefeated(stack);
          clearStack(stack);
        }, 1000);
        if (++pairsCounter === 6) {
          endGame();
        }
      } else {
        stack.forEach((item) =>
          setTimeout(() => {
            unflipCard(item);
          }, 1000)
        );
        clearStack(stack);
      }
    }
  }
  console.log(`moves: ${movesCounter}`);
  console.log(`pairs: ${pairsCounter}`);
  console.log(
    stack.map((item) => item.closest('.flip-container').dataset.hero)
  );
};

document.addEventListener('DOMContentLoaded', init);
document.querySelector('.try-again').addEventListener('click', init);

cardsWrapper.addEventListener('click', handleClick);
