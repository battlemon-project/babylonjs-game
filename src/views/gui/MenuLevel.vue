<template>
    <div id="menu" class="modal no_focus_game" v-show="this.$store.state.level.isMenuOpen">
        <div class="container">
            <div class="content">
                <div class="title margin_bottom">Menu</div>

                <ion-list>
                    <ion-item>
                        <a @click="openSettings">Settings</a>
                    </ion-item>
                    <ion-item>
                        <a href="/home">Exit</a>
                    </ion-item>
                </ion-list>

                <div class="button_bar">
                    <a @click="closeMenu" class="button">Close</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { IonList, IonItem } from '@ionic/vue'

  export default defineComponent({
    components: { IonList, IonItem },
    methods: {
      closeMenu() {
        this.$store.commit('SET_OPEN_MENU', false)
      },
      openSettings() {
        this.$store.commit('SET_SETTINGS_OPEN', true)
      }
    }
  })
</script>