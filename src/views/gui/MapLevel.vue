<template>
  <div id="map_level" class="no_focus_game" v-show="this.isOpen">
    <div class="map_container">
      <div id="map">
        <div class="map_img_container">
          <div v-if="!mapRewardedAdOpened" id="map_rewarded_preview">
            Лабиринт достаточно небольшой и его можно пройти без карты, но если вы всё же решили
            воспользоваться ей, вам нужно один раз посмотреть рекламный ролик.
            Карта сохранится на весь уровень.

            <div class="button" @click="openRewardedAd" v-if="!mapRewardedAdLoad">
              open
            </div>

            <div v-else>
              <img src="/resources/images/spinner.svg">
            </div>
          </div>
          <template v-else>
            <img id="map_img" :src="this.urlMap" @click="(e) => { moveTo(e) }">
            <div id="map_cursor">
              <div id="map_cursor_img"></div>
            </div>
          </template>
        </div>
      </div>
      <button id="map_button_close" @click="close()">close</button>
    </div>
  </div>
</template>

<style>
#map_level {
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  position: absolute;
  z-index: 10;
}

#map_level .map_img_container {
  height: 100%;
  width: 100%;
  position: relative;
}

#map_level #map_cursor {
  position: absolute;
  z-index: 2;
  width: 6%;
  height: 6%;
  margin-left: -3%;
  margin-top: -3%;
}

#map_level #map_cursor_img {
  background-image: url("/public/resources/images/level/minimap_label.png");
  background-size: cover;
  width: 100%;
  height: 100%;
  animation-duration: 1s;
  animation-name: center-animate;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes center-animate {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}

#map_level .map_container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-color: rgba(101, 173, 255, 0.4);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}

#map {
  height: 100%;
  background: black;
  width: 50%;
}

#map_img {
  width: 100%;
  height: 100%;
}

#map_button_close {
  position: absolute;
  top: 0;
  right: 0;
}

#map_rewarded_preview {
  width: 100%;
  height: 100%;
  color: white;
  padding: 5%;
  box-sizing: border-box;
}

#map_rewarded_preview .button {
  width: 100%;
  margin-top: 10%
}
</style>

import { defineComponent } from 'vue'

<script lang="ts">
import { defineComponent } from 'vue'
import Teleport from '@/models/mehanics/Teleport'
import { Vector3 } from '@babylonjs/core'

export default defineComponent({
  computed: {
    urlMap () {
      return '/resources/graphics/levels/level_' + this.$store.state.level.levelId + '/map.png'
    },
    isOpen () {
      return this.$store.state.level.isMapOpen
    },
  },
  watch: {
    isOpen () {
      const mapElement = document.getElementById('map') as HTMLElement
      mapElement.style.width = window.innerHeight + 'px'

      if (this.mapRewardedAdOpened) {
        this.setLabel()
      }
    },
  },
  methods: {
    openRewardedAd: async function () {
      this.mapRewardedAdLoad = true
    },
    close () {
      this.$store.commit('MAP_TOGGLE')
    },
    setLabel () {
      const lowerFloorSize = this.$store.state.level.lowerFloorSize

      if (lowerFloorSize) {
        const cursorElement = document.getElementById('map_cursor') as HTMLElement
        const player = this.$store.getters.getPlayerById(this.$store.state.player.id)
        const playerPosition = player.move.syncData.position
        const playerRotation = player.move.syncData.rotation

        const x = playerPosition.x
        const z = playerPosition.z

        const mapSize = window.innerHeight / 2
        const meterInPx = window.innerHeight / lowerFloorSize.height

        const xPx = Math.abs((x * meterInPx) + mapSize)
        const zPx = Math.abs((z * meterInPx) - mapSize)

        cursorElement.style.top = zPx + 'px'
        cursorElement.style.left = xPx + 'px'

        const angle = playerRotation.y / (Math.PI / 180)
        cursorElement.style.transform = 'rotate(' + angle + 'deg)'
      }
    },
    moveTo (e: MouseEvent) {
      const lowerFloorSize = this.$store.state.level.lowerFloorSize
      const mapSizePart = lowerFloorSize.width / 2
      const pxInMeter = lowerFloorSize.height / window.innerHeight
      const offsetX = e.offsetX
      const offsetY = e.offsetY

      let xM = -((offsetX * pxInMeter) + mapSizePart)
      if (offsetX * pxInMeter > mapSizePart) {
        xM = ((offsetX * pxInMeter) - mapSizePart)
      }

      let zM = Math.abs((offsetY * pxInMeter) - mapSizePart)
      if (offsetY * pxInMeter > mapSizePart) {
        zM =  -((offsetY * pxInMeter) - mapSizePart)
      }

      const teleport = new Teleport(this.$store.state.player.id)
      teleport.run(new Vector3(xM, 10, zM))
      this.setLabel()
    }
  },
  data () {
    return {
      mapRewardedAdOpened: true,
      mapRewardedAdLoad: false
    }
  }
})
</script>