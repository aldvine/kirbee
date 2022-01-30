const { Player, CHARACTER_KIRBY, CHARACTER_KNIGHT } = require("./Player");

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
      ? CHARACTER_KNIGHT
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

  /**
   * set last result of winner,
   * increment game stats for players
   * set the ready state of players
   * @param {Player} player
   * @param {boolean} win
   */
  setLastResult(player, win) {
    if (win) {
      player.addVictory();
      this.lastResult.winner = player;
      const looser = this.players.find((p) => p.id != player.id) ?? null;
      if (looser) {
        looser.addDefeat();
        this.lastResult.looser = looser;
      }
    } else {
      player.addDefeat();
      this.lastResult.looser = player;
      const winner = this.players.find((p) => p.id != player.id) ?? null;
      if (winner) {
        winner.addVictory();
        this.lastResult.winner = winner;
      }
    }

    for (const player of this.players) {
      player.setReady(false);
    }
  }

  /**
   * Get formatted result for clients
   */
  getLastResultFormatted() {
    return {
      winner: this.lastResult.winner.id,
      looser: this.lastResult.looser.id,
    };
  }

  /**
   * Remove player in game
   */
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

  /**
   * Return the player if is in the game
   * @param {Player} player
   * @returns
   */
  playerIsInGame(player) {
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
