<template>
    <ion-page>
        <ion-content :fullscreen="true" scroll-y="false">
            <div id="levels">
                <div class="grid_level">
                    <template v-for="level in this.$store.state.levels" :key="level.id">
                        <a class="item" :href="'/levels/' + level.id" v-if="this.levelOpen(level.id)">
                            {{ level.id }}
                        </a>

                        <div class="item close" v-else>
                            <img src="../../public/resources/images/levels/lock.png">
                        </div>
                    </template>
                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<style>
    ion-content {
        --background: none;
        background: url('../../public/resources/images/index_bg.jpg') no-repeat fixed center;
        background-size: cover;
        height: 100%;
        width: 100%;
        position: relative;
    }
</style>

<script lang="ts">
  import { IonContent, IonPage, useBackButton } from '@ionic/vue'
  import { defineComponent } from 'vue'
  import { Level as LevelStorage } from '@/models/storage/Level'

  export default defineComponent({
    name: 'Home',
    mounted () {
      useBackButton(10, () => {
        this.$router.push({ name: 'Home' })
      })

      this.setSize()
      window.addEventListener('resize', () => {
        this.setSize()
      }, true)
    },
    methods: {
      setSize () {
        const width = window.innerWidth / 10
        const levels = document.getElementsByClassName('item')
        for (let i = 0; i < levels.length; i++) {
          const level = levels[i] as HTMLElement
          level.style.width = width + 'px'
          level.style.height = width + 'px'
          level.style.lineHeight = width + 'px'
        }
      },
      levelOpen (levelId: string | number) {
        if (levelId == 1) {
          return true
        }

        return !!LevelStorage.checkCompletedLevelId(Number(levelId) - 1);
      }
    },
    components: {
      IonContent,
      IonPage,
    }
  })
</script>