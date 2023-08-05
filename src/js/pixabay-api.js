import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '38654738-cfabe743c1eb2c961fa07a0de';

  page = 1;
  query = null;
  limit = 12;

  async fetchPhotos() {
    return await axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.limit,
      },
    });
  }
}
