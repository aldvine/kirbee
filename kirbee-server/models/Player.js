const players = {};
module.exports.players = players;
const CHARACTER_KIRBY = "KIRBY";
const CHARACTER_KNIGHT = "KNIGHT";

module.exports.CHARACTER_KIRBY = CHARACTER_KIRBY;
module.exports.CHARACTER_KNIGHT = CHARACTER_KNIGHT;

module.exports.Player = class Player {
  constructor(socket) {
    this.id = socket.id;
    this.victory = 0;
    this.defeat = 0;
    this.ready = false;
    this.socket = socket;
    this.character = null;
  }

  isReady() {
    return this.ready;
  }
  getScore() {
    return {
      id: this.id,
      victory: this.victory,
      defeat: this.defeat,
    };
  }
  setCharacter(character) {
    this.character = character;
  }
  setReady(ready) {
    this.ready = ready;
  }

  addVictory() {
    this.victory++;
  }

  addDefeat() {
    this.defeat++;
  }
};
