<template>
    <div id="top_bar" class="no_focus_game">
        <div id="menu_button">
            <div class="menu_button" @click="openMenu"></div>
        </div>

      <meta-mask></meta-mask>
    </div>
</template>

<script>
  import MetaMask from '@/views/gui/topbar/MetaMask'

  export default {
    components: {
      MetaMask
    },
    methods: {
      openMenu() {
        this.$store.commit('SET_OPEN_MENU', true)
      }
    }
  }
</script>