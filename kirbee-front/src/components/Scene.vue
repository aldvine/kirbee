<template>
  <div>
    <!-- default template -->
    <div v-if="!getPlayerCharacter" class="scene">
      <template>
        <img src="/images/kirby/kirby_start.png" class="character" />

        <img src="/images/knight/knight_start.png" class="character" />
      </template>
    </div>
    <div v-else>
      <div class="pokemon-style">
        <div class="pokemon-enemy">
          <div class="box-info">
            <span>{{ getEnemyCharacter.name }} Lvl 5</span>
            <span class="inline"
              ><label style="margin-right:5px">PV</label>
              <progress max="100" :value="result === 'winner' ? 0 : 100"
            /></span>
          </div>
          <img
            :src="getEnemyImage"
            class="pokemon-character"
            :class="{ 'img-reverse': imgReverse }"
          />
        </div>

        <div class="img-fight">
          <img src="/images/action-mark.png" v-show="readyFoFight" />
        </div>

        <div class="pokemon-player">
          <img
            :src="getPlayerImage"
            class="pokemon-character"
            :class="{ 'img-reverse': imgReverse }"
          />
          <div class="box-info">
            <span>{{ getPlayerCharacter.name }} Lvl 5</span>
            <span class="inline"
              ><label style="margin-right:5px">PV</label>
              <progress max="100" :value="result === 'loser' ? 0 : 100"
            /></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Character,
  CHARACTER_KIRBY,
  CHARACTER_KNIGHT,
} from "../models/Character.js";
export default {
  props: {
    playerCharacter: {
      type: String,
      default: null,
    },
    result: {
      type: String,
      default: null,
    },
    /**
     * Print the "!"
     */
    readyFoFight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      kirby: null,
      knight: null,
    };
  },

  computed: {
    getPlayerImage() {
      if (!this.result) {
        return this.getPlayerCharacter.getStartImage();
      } else if (this.result === "winner") {
        return this.getPlayerCharacter.getWinImage();
      } else {
        return this.getPlayerCharacter.getLoseImage();
      }
    },

    getEnemyImage() {
      if (!this.result) {
        return this.getEnemyCharacter.getStartImage();
      } else if (this.result === "winner") {
        return this.getEnemyCharacter.getLoseImage();
      } else {
        return this.getEnemyCharacter.getWinImage();
      }
    },

    getPlayerCharacter() {
      if (!this.playerCharacter) {
        return null;
      }
      return this.playerCharacter === CHARACTER_KIRBY
        ? this.kirby
        : this.knight;
    },
    getEnemyCharacter() {
      if (!this.playerCharacter) {
        return null;
      }
      return this.playerCharacter === CHARACTER_KIRBY
        ? this.knight
        : this.kirby;
    },
    imgReverse() {
      return this.playerCharacter && this.playerCharacter === CHARACTER_KNIGHT
        ? true
        : false;
    },
  },

  mounted() {
    this.kirby = new Character(
      "KIRBY",
      "/images/kirby/kirby_start.png",
      "/images/kirby/kirby_win.png",
      "/images/kirby/kirby_lose.png"
    );
    this.knight = new Character(
      "KNIGHT",
      "/images/knight/knight_start.png",
      "/images/knight/knight_win.png",
      "/images/knight/knight_lose.png"
    );
  },
};
</script>

<style scoped>
.scene {
  display: flex;

  justify-content: space-around;
}

.character {
  width: 70px;
  height: auto;
}

.img-fight {
  height: 60px;
}
.img-fight img {
  width: 60px;
  height: auto;
}

progress {
  box-shadow: 0 0 0 2px black;
  margin-top: 4px;
  height: 12px;
  border-radius: 20px;
  background: transparent;
  width: 100%;
  overflow: hidden;
}
progress::-webkit-progress-value {
  background: black;
}
progress::-webkit-progress-bar {
  background: transparent;
}

.inline {
  display: flex;
}

.box-info {
  padding: 0.5rem;
  text-align: left;
  flex-grow: 1;
  max-width: 300px;
  max-height: 60px;
  border-radius: 10px;
  border-style: solid;
  border-color: black;
  background: rgba(255, 255, 255, 0.2);
}
.pokemon-style {
  display: flex;
  flex-direction: column;
}
.pokemon-style .pokemon-player {
  display: flex;
  justify-content: left;
}
.pokemon-style .pokemon-player .pokemon-character {
  transform: translate(20px, -10px);
  height: 100px;
  width: auto;
}

.pokemon-style .pokemon-player .pokemon-character.img-reverse {
  -webkit-transform: scaleX(-1);
  transform: translate(20px, -10px) scaleX(-1);
}

.pokemon-style .pokemon-player .box-info {
  margin-left: auto;
  transform: translateY(35px);
  margin-bottom: 5px;
  margin-right: 5px;
  border-width: 0 5px 5px 0;
}
.pokemon-style .pokemon-enemy {
  display: flex;
  justify-content: right;
}
.pokemon-style .pokemon-enemy .pokemon-character {
  transform: translate(-10px, -20px);
  height: 100px;
  width: auto;
}

.pokemon-style .pokemon-enemy .pokemon-character.img-reverse {
  -webkit-transform: translate(-10px, -20px) scaleX(-1);
  transform: translate(-10px, -20px) scaleX(-1);
}

.pokemon-style .pokemon-enemy .box-info {
  margin-right: auto;
  margin-bottom: 5px;
  margin-left: 5px;
  border-width: 0 0 5px 5px;
}

.scene .ready-fight {
  background: url(/images/action-mark.png) center center;
}
</style>
