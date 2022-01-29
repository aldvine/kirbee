<template>
  <div class="App" id="app">
    <div class="game">
      <div class="demo-scene">
        <p v-if="character">{{ character }}</p>
        <p>{{ status }}</p>
        <button v-if="!state.joined" @click="join">
          Join
        </button>
        <button
          v-if="
            !state.ready && state.joined && !(state.waiting || state.fighting)
          "
          @click="ready"
        >
          ready
        </button>
        <button v-if="state.waiting || state.fighting" @click="fight">
          fight
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

const socket = io(`${location.protocol}//${location.hostname}:3006`);

export default {
  name: "App",

  data() {
    return {
      status: "connecting...",
      character: null,
      state: {
        joined: false,
        ready: false,
        waiting: false,
        fighting: false,
      },
    };
  },

  mounted() {
    socket.on("connect", () => {
      this.status = "connected";
    });
    socket.on("joined", (character) => {
      this.status = "Waiting for player";
      this.character = character;
      this.state.joined = true;
    });
    socket.on("waiting", () => {
      this.status = "wait";
      this.state.waiting = true;
    });
    socket.on("fighting", () => {
      console.log("fighting");
      this.status = "fight";
      this.state.waiting = false;
      this.state.fighting = true;
    });
    socket.on("result", (result) => {
      this.state.ready = false;
      this.state.waiting = false;
      this.state.fighting = false;
      if (result.winner === socket.id) {
        this.status = "Win !";
      } else {
        this.status = "KO !";
      }
    });
    socket.on("disconnect", () => {
      this.status = "disconnected";
      this.resetState();
    });
    socket.on("reconnect", () => {
      this.status = "connected";
    });

    socket.on("error", (error) => {
      console.log(error.message);
    });
  },

  methods: {
    resetState() {
      this.state = {
        joined: false,
        ready: false,
        waiting: false,
        fighting: false,
      };
    },
    join() {
      socket.emit("join");
    },
    fight() {
      socket.emit("fight");
    },
    ready() {
      socket.emit("ready");
      this.state.ready = true;
    },
  },
};
</script>

<style scoped>
.App {
  width: 100%;
  height: 100%;
  background: url(/images/background.png) center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game {
  width: 512px;
  max-width: 90%;
  height: 444px;
  max-height: 90%;
  background: url(/images/background.png) center center;
  box-shadow: 0 0 9px rgb(0 0 0 / 60%), 0 0 0 9999px rgb(255 255 255 / 40%);
  border-radius: 5px;
  overflow: hidden;
}

.demo-scene {
  height: 100%;
  padding: 0.7rem;
  text-align: center;
  color: white;
}

.demo-scene p {
  margin-bottom: 2rem;
}
</style>
