const { Player } = require("./Player");
const rooms = [];
module.exports.rooms = rooms;

const STATUS_WAITING = "waiting";
const STATUS_FIGHTING = "fighting";
const STATUS_ZERO = "ZERO"; // en attente de demarrage du jeu
module.exports = {
  STATUS_WAITING,
  STATUS_FIGHTING,
  STATUS_ZERO,
};

let lastId = 1;
const LIMIT_PLAYERS = 2;
module.exports.Room = class Room {
  constructor() {
    this.id = Number.toString(++lastId);
    this.players = [];
    this.status = false;
    this.lastResult = { winner: null, looser: null };
  }

  addPlayer(player) {
    this.players.push(player);
  }

  ready() {
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
    this.lastResult.looser = this.players.find((p) => p.id != winner.id);
  }

  setLooser(looser) {
    this.lastResult.looser = looser;
    this.lastResult.winner = this.players.find((p) => p.id != looser.id);
  }

  getLastResult() {
    return this.lastResult;
  }

  /**
   * @returns Random timer for gaming room
   */
  static getRandomTimer() {
    return Math.floor(Math.random() * 6) + 2;
  }

  /**
   * get a room from id
   * @param {*} id
   */
  static getRoom(id) {
    return rooms.find((r) => r.id == id);
  }

  /**
   * add a player in free room
   * @param {Player} player
   * @returns
   */
  static addPlayerInRoom(player) {
    const room = rooms.find((r) => r.players.length < LIMIT_PLAYERS);
    if (room) {
      room.addPlayer(player);
      return room;
    } else {
      const newRoom = new Room();
      newRoom.addPlayer(player);
      rooms.push(newRoom);
      return newRoom;
    }
  }
};
