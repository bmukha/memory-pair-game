const allHeroes = [
  'demonhunter',
  'druid',
  'hunter',
  'mage',
  'paladin',
  'priest',
  'rogue',
  'shaman',
  'warlock',
  'warrior',
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

console.log(usedHeroes);

const cardsWrapper = document.querySelector('.cards-wrapper');

const init = () => {
  let content = '';
  for (hero of usedHeroes) {
    content += `<div class='flip-container' data-hero="${hero}">
  <div class='flipper'>
    <div class='front'>
      <img class='cardback' src='./img/pie-cardback.png' alt='' />
    </div>
    <div class='back'>
      <img class='hero' src='./img/${hero}.webp' alt='' />
    </div>
  </div>
</div>`;
  }
  cardsWrapper.innerHTML = content;
};

init();

let stack = [];
let pairsCounter = 0;

cardsWrapper.addEventListener('click', ({ target }) => {
  console.log(target.closest('.flip-container').dataset.hero);
  if (target.classList.contains('cardback')) {
    stack.push(target);
    target.closest('.flipper').classList.add('is-flipped');
    if (stack.length === 3) {
      stack.shift().closest('.flipper').classList.remove('is-flipped');
    }

    if (stack.length === 2) {
      if (
        stack[0].closest('.flip-container').dataset.hero ===
        stack[1].closest('.flip-container').dataset.hero
      ) {
        setTimeout(() => {
          stack.forEach((item) =>
            item.closest('.flipper').classList.add('deleted')
          );
          stack = [];
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
    // setTimeout(() => {
    //   event.target.closest('.flipper').classList.remove('is-flipped');
    // }, 300);
  }
});
