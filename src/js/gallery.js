import { PixabayAPI } from './pixabay-api';

const refs = {
  form: document.getElementById('search-form'),
  input: document.querySelector('.search-input'),
  button: document.querySelector('.search-button'),
  gallery: document.querySelector('.gallery'),
  guradContaiber: document.getElementById('js-guard'),
};

const pixabayApi = new PixabayAPI();

refs.form.addEventListener('submit', handleSearchFormSubmit);

function handleSearchFormSubmit(event) {
  event.preventDefault();
}
