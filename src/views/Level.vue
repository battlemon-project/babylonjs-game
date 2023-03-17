<template>
    <ion-page>
        <div id="level">
            <canvas id="canvas"></canvas>
            <TopBar/>
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
        background: -webkit-gradient(linear,left top,left bottom,from(#035161),to(#010024));
        background: -webkit-linear-gradient(top,#035161 0,#010024 100%);
        background: -o-linear-gradient(top,#035161 0,#010024 100%);
        background: linear-gradient(180deg,#035161 0,#010024 100%);
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
  import TopBar from '@/views/gui/topbar/TopBar.vue'
  import LevelPreview from '@/views/LevelPreview.vue'
  import MenuLevel from '@/views/gui/MenuLevel.vue'
  import Settings from '@/views/gui/Settings.vue'
  import { IonPage } from '@ionic/vue';
  import { mapGetters } from 'vuex'

  export default defineComponent({
    name: 'Level',
    mounted (): void {
      this.$nextTick(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const level = urlParams.get('level')
        this.$store.commit('SET_LEVEL', level ? level : 1)
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
      TopBar,
      IonPage,
      LevelPreview,
      MenuLevel,
      Settings
    }
  })
</script>