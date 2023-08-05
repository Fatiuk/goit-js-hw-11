import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from './pixabay-api';

const refs = {
  body: document.querySelector('body'),
  form: document.getElementById('search-form'),
  input: document.querySelector('.search-input'),
  button: document.querySelector('.search-button'),
  gallery: document.querySelector('.gallery'),
  target: document.getElementById('js-guard'),
  currentPage: 1,
};

let totalHits;

const pixabayApi = new PixabayAPI();

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

// Added eventListener on 'Search Photos Form'
refs.form.addEventListener('submit', handleSearchFormSubmit);

// Function which search photo and render markup
async function handleSearchFormSubmit(event) {
  event.preventDefault();
  refs.body.classList.remove('animation');
  refs.currentPage = 1;
  fetchDataByInputValue();
  refs.gallery.innerHTML = '';
  setTimeout(() => {
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  }, 1000);
}

// Function to fetch data based on input value
async function fetchDataByInputValue() {
  // Change the variable name from 'null' to 'query'
  // (where 'query' is the value from the input)
  const searchValue = refs.form.elements['searchQuery'].value.trim();
  pixabayApi.query = searchValue;

  // Resetting the page counter in the class.
  pixabayApi.page = refs.currentPage;

  // Fetch photos and throw an error if there is a problem
  try {
    // Deep destructuring to extract 'hits' from the response data
    const {
      data,
      data: { hits },
    } = await pixabayApi.fetchPhotos();

    console.log(hits);
    // Update count total hits
    totalHits = data.total;

    // Handling the case where no results were found for the search query
    if (!hits.length) {
      throw new Error('Sorry, no photos were found for this search query.');
    } else {
      // Set a timeout to delay rendering of the photo cards markup.
      setTimeout(() => {
        // Generate the photo cards markup for all the fetched photos
        const photoCardsMarkup = hits.map(createPhotoCardsMarkup).join('');
        // Render the generated markup
        refs.gallery.insertAdjacentHTML('beforeend', photoCardsMarkup);
        // Refresh SimpleLightBox
        lightbox.refresh();
        // Toggle IntersectionObserver
        toggleIntersectionObserver();
      }, 300);

      // Move search-form up
      refs.form.style.top = '35px';
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

// Function that creates the markup for a photo card
function createPhotoCardsMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <div class="photo-card">
    <a href = ${largeImageURL}>
      <img src=${webformatURL} alt=${tags} loading="lazy" />
    </a>
      <div class="info">
        <p class="info-item">
          <b>&#128077;</b>${likes}
        </p>
        <p class="info-item">
          <b>&#128064;</b>${views}
        </p>
        <p class="info-item">
          <b>&#128172;</b>${comments}
        </p>
        <p class="info-item">
          <b>&#128229;</b>${downloads}
        </p>
      </div>
  </div>`;
}

// Toggle function for IntersectionObserver (add or remove)
async function toggleIntersectionObserver() {
  // Destructuring data from response
  const { data } = await pixabayApi.fetchPhotos();
  // Counter total pages
  const totalHits = data.total;
  const totalPages = Math.ceil(totalHits / pixabayApi.limit);
  // Determine if there are more pages to load
  if (totalPages > refs.currentPage) {
    observer.observe(refs.target);
  } else {
    observer.unobserve(refs.target);
    Notiflix.Notify.warning(
      'We are sorry, but you have reached the end of search results.'
    );
  }
}

let observer = new IntersectionObserver(loadMore, {
  root: null,
  rootMargin: '1000px',
  threshold: 0,
});

function loadMore(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      refs.currentPage += 1;
      fetchDataByInputValue();
    }
  });
}
