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
    if (game.playerIsInGame(player)) {
      socket.emit("error", { message: "already in game" });
    } else {
      // add user in game if game not full
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

  // user send is ready
  // start a game if users are ready
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

  // a user send fight action
  socket.on("fight", () => {
    try {
      const player = getPlayerInGame(socket);
      if (game.isFighting()) {
        fightAction(game, player, true);
      } else if (game.isWaiting()) {
        clearTimeout(game.timeout);
        fightAction(game, player, false);
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
        clearTimeout(game.timeout);
        fightAction(game, player, false);
      }
      game.removePlayer(player);
      delete clients[socket.id];
    } catch (error) {
      console.log(socket.id, error.message);
    }
  });
});

const fightAction = (game, player, win) => {
  game.setStatus(STATUS_ZERO);
  game.setLastResult(player, win);
  io.to(game.room).emit("result", game.getLastResultFormatted());
};

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
  const inGame = game.playerIsInGame(player);
  if (!inGame) {
    const message = "you are not in game";
    socket.emit("error", { message });
    throw new Error(message);
  }
  return player;
};
