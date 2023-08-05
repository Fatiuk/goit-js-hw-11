document.addEventListener('DOMContentLoaded', function () {
  const galleryElement = document.querySelector('.gallery');

  if (galleryElement && galleryElement.firstElementChild) {
    const { height: cardHeight } =
      galleryElement.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
