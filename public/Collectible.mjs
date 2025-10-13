class Collectible {
  constructor({ x, y, value, id }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
  }
  image() {
    const image = new Image();
      image.src = 'https://raw.githubusercontent.com/Supravisor/boilerplate-project-secure-real-time-multiplayer-game/refs/heads/main/public/bronze-coin.png';
    return image;
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
