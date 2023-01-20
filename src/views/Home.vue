<template>
    <ion-page>
        <ion-content :fullscreen="true" scroll-y="false">
            <settings></settings>

            <div id="home">
                <div class="margin_bottom">
                    <a @click="() => router.push('/levels')" class="button">Play</a>
                </div>

                <div>
                    <a @click="openSettings" class="button background_none">Settings</a>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<style>
    ion-content {
        position: relative;
        --background: none;
        background: url('../../public/resources/images/index_bg.jpg') no-repeat fixed center;
        background-size: cover
    }

    html, body {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        position: relative;
    }
</style>

<script lang="ts">
  import { IonContent, IonPage } from '@ionic/vue'
  import { defineComponent } from 'vue'
  import { useRouter } from 'vue-router'
  import Settings from '@/views/gui/Settings.vue'

  export default defineComponent({
    name: 'Home',
    components: {
      IonContent,
      IonPage,
      Settings
    },
    methods: {
      openSettings () {
        this.$store.commit('SET_SETTINGS_OPEN', true)
      }
    },
    setup () {
      const router = useRouter()
      return { router }
    },
  })
</script>