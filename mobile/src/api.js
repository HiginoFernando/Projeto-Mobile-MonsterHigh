// mobile/src/api.js
import axios from 'axios';

const BASE_URL = 'http://172.20.10.2:3000';

export default axios.create({
  baseURL: BASE_URL,

});
