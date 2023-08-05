import Notiflix from 'notiflix';
import { PixabayAPI } from './pixabay-api';

const refs = {
  form: document.getElementById('search-form'),
  input: document.querySelector('.search-input'),
  button: document.querySelector('.search-button'),
  gallery: document.querySelector('.gallery'),
  target: document.getElementById('js-guard'),
  currentPage: 1,
};

const pixabayApi = new PixabayAPI();

// Added eventListener on 'Search Photos Form'
refs.form.addEventListener('submit', handleSearchFormSubmit);

// Function which search photo and render markup
async function handleSearchFormSubmit(event) {
  event.preventDefault();
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
function createPhotoCardsMarkup({ webformatURL, tags }) {
  return `
  <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
        </p>
        <p class="info-item">
          <b>Views</b>
        </p>
        <p class="info-item">
          <b>Comments</b>
        </p>
        <p class="info-item">
          <b>Downloads</b>
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
  }
}

let observer = new IntersectionObserver(loadMore, {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
});

function loadMore(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      refs.currentPage += 1;
      fetchDataByInputValue();
    }
  });
}
