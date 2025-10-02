class Player {
  constructor({x=30, y=30, score=0, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "up":
        this.y -= speed;
        break;
      case "down":
        this.y += speed;
        break;
      case "left":
        this.x -= speed;
        break;
      case "right":
        this.x += speed;
        break;
      default:
        throw new Error("Invalid direction");
    }
  }

  collision(item) {
    const player = 15;
    const collectible = 15;

    return (
      this.x < item.x + collectible &&
      this.x < item.x + player.x &&
      this.y < item.y + collectible &&
      this.y < player
    );
  }

  calculateRank(arr) {
      const sortPlayers = arr.sort((a, b) => b.score - a.score);
      const rank = sortPlayers.findIndex(player => player.id === this.id) + 1;

      return `Rank ${rank}/${sortPlayers.length}`;
  }
}

export default Player;
