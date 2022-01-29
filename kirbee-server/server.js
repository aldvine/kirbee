const { Player } = require("./models/Player");
const {
  Room,
  STATUS_WAITING,
  STATUS_FIGHTING,
  STATUS_ZERO,
} = require("./models/Room");
const io = require("socket.io")(3006, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  console.log("client connect - ", socket.id);
  const player = new Player(socket.id);

  // rejoins le jeu
  socket.on("join", () => {
    const room = Room.addPlayerInRoom(player);
    player.setRoom(room);
    socket.join(room.id);
    console.log("client reconnect - ", socket.id);
  });

  // pret
  socket.on("ready", () => {
    player.ready = true;
    if (player.room.ready()) {
      const timer = Room.getRandomTimer();
      player.room.setStatus(STATUS_WAITING);
      io.to(player.room.id).emit("waiting");
      setTimeout(() => {
        player.room.setStatus(STATUS_FIGHTING);
        socket.to(player.room.id).emit("fighting");
      }, timer * 1000);
    }
    console.log("client reconnect - ", socket.id);
  });

  // action de combat
  socket.on("fight", () => {
    player.room.setStatus(STATUS_ZERO);
    if (player.room.isFighting()) {
      io.to(player.room.id);
      player.room.setWinner(player);
      socket.emit("result", player.room.getLastResult());
    } else if (player.room.isWaiting()) {
      player.room.setWinner(player);
      io.to().emit("result", player.room.getLastResult());
    }
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("client reconnect - ", socket.id);
  });

  socket.on("disconnect", () => {
    socket.leave(player.room.id);
    console.log("client disconnect - ", socket.id);
  });

  socket.on("ping", () => {
    console.log("ping received");
    socket.emit("pong");
  });
});
