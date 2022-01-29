const { Player } = require("./models/Player");
const {
  Game,
  game,
  STATUS_WAITING,
  STATUS_FIGHTING,
  STATUS_ZERO,
} = require("./models/Game");
const io = require("socket.io")(3006, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const clients = {};

io.on("connection", function (socket) {
  console.log("client connect - ", socket.id);
  clients[socket.id] = new Player(socket);
  socket.on("join", () => {
    const player = clients[socket.id];
    if (game.getGamePlayer(player)) {
      socket.emit("error", { message: "already in game" });
    } else {
      const playerGame = game.addPlayer(player);
      if (!playerGame) {
        socket.emit("full");
        return;
      } else {
        socket.join(game.room);
        socket.emit("joined", player.character);
      }
    }
  });

  // pret
  socket.on("ready", () => {
    try {
      const player = getPlayerInGame(socket);

      if (player.isReady()) {
        socket.emit("error", { message: "already Ready" });
        return;
      }
      player.setReady(true);

      if (game.readyForStart() && !(game.isFighting() || game.isWaiting())) {
        const timer = game.getRandomTimer();
        game.setStatus(STATUS_WAITING);
        io.to(game.room).emit("waiting");
        game.timeout = setTimeout(() => {
          game.setStatus(STATUS_FIGHTING);
          io.to(game.room).emit("fighting");
        }, timer * 1000);
      }
    } catch (error) {
      console.log(socket.id, error.message);
    }
  });

  // action de combat
  socket.on("fight", () => {
    try {
      const player = getPlayerInGame(socket);
      if (game.isFighting()) {
        game.setStatus(STATUS_ZERO);
        game.setWinner(player);
        io.to(game.room).emit("result", game.getLastResultFormatted());
      } else if (game.isWaiting()) {
        game.setStatus(STATUS_ZERO);
        clearTimeout(game.timeout);
        game.setLooser(player);
        io.to(game.room).emit("result", game.getLastResultFormatted());
      } else {
        socket.emit("error", { message: "action not possible" });
      }
    } catch (error) {
      console.log(socket.id, error.message);
    }
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("client reconnect - ", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("client disconnect - ", socket.id);
    try {
      const player = getPlayerInGame(socket);
      if (game.isWaiting() || game.isFighting()) {
        game.setStatus(STATUS_ZERO);
        clearTimeout(game.timeout);
        game.setLooser(player);
        io.to(game.room).emit("result", game.getLastResultFormatted());
      }
      game.removePlayer(player);

      delete clients[socket.id];
    } catch (error) {
      console.log(socket.id, error.message);
    }
  });
});

/**
 * Retourne le contexte du joueur
 */
const getPlayerInGame = (socket) => {
  const player = clients[socket.id];
  if (!player) {
    const message = "player does not exist";
    socket.emit("error", { message });
    throw new Error(message);
  }
  const inGame = game.getGamePlayer(player);
  if (!inGame) {
    const message = "you are not in game";
    socket.emit("error", { message });
    throw new Error(message);
  }
  return player;
};
