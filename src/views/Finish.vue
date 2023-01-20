<template>
    <ion-page>
        <ion-content :fullscreen="true" scroll-y="false">
            <div id="finish">
                <div class="content">
                    You have passed this level!

                    <div class="buttons">
                        <div>
                            <a class="button" href="/levels">Choice level</a>
                        </div>
                        <div v-if="this.nextLevelId">
                            <a class="button" :href="'/levels/' + this.nextLevelId">
                                Next level
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<style>
    #finish {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        background: black;
        align-items: center;
    }

    #finish .content {
        display: flow-root;
        box-sizing: content-box;
        margin-left: auto;
        margin-right: auto;
    }

    #finish .content .buttons {
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        list-style: none;
        margin-left: -15px;
        text-align: center!important;
    }

    #finish .content .buttons div {
        flex: 1;
        padding-left: 15px;
    }

</style>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { IonContent, IonPage, useBackButton } from '@ionic/vue'
  import { Level as LevelStorage } from '@/models/storage/Level'
  import { Level } from '@/store/types'

  export default defineComponent({
    name: 'Finish',
    mounted() {
      useBackButton(10, () => {
        this.$router.push({ name: 'Levels' })
      });
    },
    computed: {
      nextLevelId() {
        const nextLevelId = LevelStorage.getLastCompletedLevelId() + 1
        const nextLevel = this.$store.state.levels.find((level: Level) => level.id == nextLevelId)
        return nextLevel ? nextLevel.id : null
      }
    },
    components: {
      IonContent,
      IonPage
    }
  })
</script>