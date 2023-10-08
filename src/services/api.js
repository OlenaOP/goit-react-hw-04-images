import axios from 'axios';
const API_KEY = '38926821-b8c8002029c81a405b7f36852';

export const fetchImages = async () => {
  const { data } = await axios.get(
    `https://pixabay.com/api/?q=cat&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  return data;
};
