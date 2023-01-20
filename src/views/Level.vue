<template>
    <ion-page>
        <div id="level">
            <canvas id="canvas"></canvas>
<!--            <controller v-if="!this.$store.state.level.loading" />-->
            <topbar/>
            <MapLevel/>
            <Battery/>
            <MenuLevel/>
            <Settings/>

           <div id="loading_overlay" v-if="this.$store.state.level.loading">
                <div id="loading_overlay_text">Loading...</div>
            </div>

            <LevelPreview/>
        </div>
    </ion-page>
</template>

<style scoped>
    #canvas {
        border: 0;
        outline: none;
    }

    #level {
        position: relative;
    }

    #app, #canvas, #level, html, body {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }

    #loading_overlay {
        background: black;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1000;
        top: 0;
        left: 0;
    }

    #loading_overlay_text {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        margin-top: -20px;
        text-align: center;
        color: #3dc2ff;
        font-size: 20px;
    }
</style>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Game from '../models/Game'
  // import Controller from '@/views/gui/Controller.vue'
  import Topbar from '@/views/gui/topbar/Topbar.vue'
  import MapLevel from '@/views/gui/MapLevel.vue'
  import Battery from '@/views/gui/Battery.vue'
  import LevelPreview from '@/views/LevelPreview.vue'
  import MenuLevel from '@/views/gui/MenuLevel.vue'
  import Settings from '@/views/gui/Settings.vue'
  import { IonPage } from '@ionic/vue';
  import { mapGetters } from 'vuex'

  export default defineComponent({
    name: 'Level',
    mounted (): void {
      this.$nextTick(() => {
        this.$store.commit('SET_LEVEL', this.$route.params.id)
        const game = new Game()
        game.init()
      })
    },
    computed: {
      ...mapGetters([
            'finish'
        ])
    },
    watch: {
      finish(value) {
        if (value) {
          window.location.href = '/finish'
        }
      }
    },
    components: {
      // Controller,
      Topbar,
      MapLevel,
      IonPage,
      Battery,
      LevelPreview,
      MenuLevel,
      Settings
    }
  })
</script>