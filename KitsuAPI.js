const { http } = require('powercord/webpack');

module.exports = {
  searchAnime (title) {
    const url = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}&page[limit]=5`;
    return http.get(url).then(r => JSON.parse(r.text));
  }
};
