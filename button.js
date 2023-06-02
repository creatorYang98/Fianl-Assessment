const playButton = document.getElementById('btn-2');
const audio = document.getElementById('my-audio')

playButton.addEventListener('click', function () {
  const popup = document.getElementById('popup');
  popup.style.animation = 'shrink 0.5s ease-out forwards';
  audio.play();
});
