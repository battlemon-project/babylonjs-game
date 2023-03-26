<template>
    <div id="menu" class="modal no_focus_game" v-show="this.$store.state.level.isMenuOpen">
        <div class="container">
            <div class="content">
                <div class="title margin_bottom">Menu</div>

                <div>
                    <div>
                        <a @click="openSettings">Settings</a>
                    </div>
                    <div>
                        <a href="/home">Exit</a>
                    </div>
                </div>

                <div class="button_bar">
                    <a @click="closeMenu" class="button">Close</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
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