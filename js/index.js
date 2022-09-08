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
// let queue;
let pairsCounter;
let movesCounter;
let lastCardClickedId;
let usedHeroes;

const queue = {
  cards: [],
  isEmpty() {
    return this.cards.length === 0;
  },
  isFull() {
    return this.cards.length > 1;
  },
  clear() {
    this.cards = [];
  },
  addCard(card) {
    this.cards.push(card);
  },
  deleteOldestCard() {
    this.cards.shift();
  },
  unflipAndDeleteOldestCard() {
    this.cards[0]?.closest('.flipper').classList.remove('is-flipped');
    this.cards.shift();
  },
  unflipYoungestCardAfterTwoSeconds() {
    setTimeout(() => {
      this.cards[this.cards.length - 1]
        ?.closest('.flipper')
        .classList.remove('is-flipped');
    }, 2000);
  },
  unflipAndDeleteOldestCardAfterTwoSeconds() {
    setTimeout(() => {
      this.unflipAndDeleteOldestCard();
    }, 2000);
  },
  print() {
    console.log(
      this.cards.map(
        (card) => card?.closest('.flip-container').dataset.hero || 'fuck'
      )
    );
  },
  isCardFlipped(card) {
    return card?.closest('.flipper').classList.contains('is-flipped');
  },
  containsTwoFlippedCards() {
    return (
      this.isCardFlipped(this.cards[0]) && this.isCardFlipped(this.cards[1])
    );
  },
  containsTwoCardsOfSameKind() {
    return (
      this.cards[0].closest('.flip-container').dataset.hero ===
        this.cards[1].closest('.flip-container').dataset.hero &&
      this.cards[0].closest('.flip-container').dataset.id !==
        this.cards[1].closest('.flip-container').dataset.id
    );
  },
  hideEqualCards() {
    this.cards.forEach((card) =>
      card.closest('.flipper').classList.add('hidden')
    );
  },
  makeDefeatedHeroOpaque() {
    const defeatedHero = document.querySelector(
      `[data-hero-list="${
        this.cards[0].closest('.flip-container').dataset.hero
      }"]`
    );
    defeatedHero.classList.add('opaque');
    defeatedHero.lastElementChild.classList.remove('hidden');
  },
};

const init = () => {
  shuffle(allHeroes);
  usedHeroes = [...allHeroes.slice(4), ...allHeroes.slice(4)];
  shuffle(usedHeroes);
  queue.clear;
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

const isClickedItemACard = (item) => item.classList.contains('cardback');
const flipCard = (card) => card.closest('.flipper').classList.add('is-flipped');
const unflipCardAfterTwoSeconds = (card) =>
  setTimeout(() => {
    card.closest('.flipper').classList.remove('is-flipped');
    // console.log('removed');
  }, 2000);

const handleClick = ({ target }) => {
  if (!isClickedItemACard(target)) return;
  movesCounter++;
  if (queue.isFull()) {
    console.log('queue full');
    queue.unflipAndDeleteOldestCard();
  }
  flipCard(target);
  queue.addCard(target);
  unflipCardAfterTwoSeconds(target);
  if (queue.containsTwoFlippedCards() && queue.containsTwoCardsOfSameKind()) {
    console.log('same!!!');
    setTimeout(() => {
      queue.hideEqualCards();
      queue.makeDefeatedHeroOpaque();
      queue.clear();
    }, 700);
  }
  // else {
  //   queue.unflipAndDeleteOldestCard();
  //   queue.addCard(target);
  //   flipCard(target);
  //   unflipCardAfterTwoSeconds(target);
  // }

  queue.print();
};

document.addEventListener('DOMContentLoaded', init);
document.querySelector('.try-again').addEventListener('click', init);
cardsWrapper.addEventListener('click', handleClick);
