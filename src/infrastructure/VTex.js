const axios = require('axios');

const vtex = axios.create({
  baseURL: process.env.VTEX_URL,
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-vtex-api-appkey': process.env.VTEX_KEY,
    'x-vtex-api-apptoken': process.env.VTEX_TOKEN
  }
});


class VTex {
  constructor() {}

  refund(id, value) {
    return vtex.post(`/${id}/refunding-request`, { value });
  }
}

module.exports = new VTex()