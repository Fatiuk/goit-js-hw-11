import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  '38654738-cfabe743c1eb2c961fa07a0de';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';

  page = 1;
  query = null;
  fetchPhotos() {
    return axios.get(`${this.#BASE_URL}/search/photos`, {
      params: {
        // key: this.#API_KEY,
        q: this.q,
        image_type: photo,
        orientation: horizontal,
        safesearch: true,
        page: this.page,
        per_page: 12,
      },
    });
  }
}
