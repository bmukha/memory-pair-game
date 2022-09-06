const cardsWrapper = document.querySelector('.cards-wrapper');
cardsWrapper.addEventListener('click', (event) => {
  console.log(event.target.classList);
  if (event.target.classList.contains('cardback')) {
    console.log('its card!');
    event.target.closest('.flipper').classList.add('is-flipped');
    setTimeout(() => {
      event.target.closest('.flipper').classList.remove('is-flipped');
    }, 300);
  }
});
