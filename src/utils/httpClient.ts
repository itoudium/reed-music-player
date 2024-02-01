import axios from 'axios';

export const httpClient = axios.create({
  headers: {
    'User-Agent': 'reed-seeker 0.0.1',
  },
});
