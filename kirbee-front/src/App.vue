<template>
  <div class="App" id="app">
    <div class="game">
      <div class="demo-scene">
        <p>{{ status }}</p>
        <button @click="ping">Ping</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

const socket = io(`${location.protocol}//${location.hostname}:3006`);

export default {
  name: 'App',

  data () {
    return {
      status: 'connecting...'
    }
  },

  mounted () {
      socket.on('connect', () => {
        this.status = 'connected';
      });
      socket.on('disconnect', () => {
        this.status = 'disconnected';
      });
      socket.on('reconnect', () => {
        this.status = 'connected';
      });
      socket.on('pong', () => {
        console.log('pong received !');
      });
  },

  methods: {
    ping () {
      socket.emit('ping');
    }
  }
}
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