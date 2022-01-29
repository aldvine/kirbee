const { Player, CHARACTER_KIRBY, CHARACTER_SAMURAI } = require("./Player");

const STATUS_WAITING = "waiting";
const STATUS_FIGHTING = "fighting";
const STATUS_ZERO = "ZERO"; // en attente de demarrage du jeu

const LIMIT_PLAYERS = 2;

class Game {
  constructor() {
    this.players = [];
    this.status = false;
    this.lastResult = { winner: null, looser: null };
    this.room = "game";
  }

  addPlayer(player) {
    if (game.players.length >= LIMIT_PLAYERS) {
      // FULL
      return null;
    } else {
      this.players.push(player);
      player.setCharacter(game.getCharacterAvailable());
      return player;
    }
  }

  getCharacterAvailable() {
    return this.players.find((p) => p.character === CHARACTER_KIRBY)
      ? CHARACTER_SAMURAI
      : CHARACTER_KIRBY;
  }

  readyForStart() {
    if (this.players.length !== LIMIT_PLAYERS) {
      return false;
    }
    for (const player of this.players) {
      if (!player.isReady()) {
        return false;
      }
    }
    return true;
  }

  isWaiting() {
    return this.status === STATUS_WAITING;
  }
  isFighting() {
    return this.status === STATUS_FIGHTING;
  }

  setStatus(status) {
    this.status = status;
  }

  setWinner(winner) {
    this.lastResult.winner = winner;
    this.lastResult.looser =
      this.players.find((p) => p.id != winner.id) ?? null;
    for (const player of this.players) {
      player.ready = false;
    }
  }

  setLooser(looser) {
    this.lastResult.looser = looser;
    this.lastResult.winner =
      this.players.find((p) => p.id != looser.id) ?? null;
    for (const player of this.players) {
      player.ready = false;
    }
  }

  getLastResultFormatted() {
    return {
      winner: this.lastResult.winner.id,
      looser: this.lastResult.looser.id,
    };
  }

  removePlayer(player) {
    this.players = this.players.filter((p) => {
      return p.id !== player.id;
    });
  }

  /**
   * @returns Random timer for gaming room
   */
  getRandomTimer() {
    return Math.floor(Math.random() * 6) + 2;
  }

  getGamePlayer(player) {
    return game.players.find((p) => p.id === player.id);
  }
}
const game = new Game();

module.exports = {
  STATUS_WAITING,
  STATUS_FIGHTING,
  STATUS_ZERO,
  game,
  Game,
};
