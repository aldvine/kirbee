module.exports.Player = class Player {
  constructor(id) {
    this.id = id;
    this.victory = 0;
    this.defeat = 0;
    this.ready = false;
    this.room = null;
  }

  setRoom(room) {
    this.room = room;
  }

  isReady() {
    return this.ready;
  }
  getRoom() {
    return this.room;
  }
  getScore() {
    return {
      id: this.id,
      victory: this.victory,
      defeat: this.defeat,
    };
  }
};
