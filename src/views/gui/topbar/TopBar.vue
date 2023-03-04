<template>
    <div id="top_bar" class="no_focus_game">
        <div id="menu_button">
            <div class="menu_button" @click="openMenu"></div>
        </div>

        <div id="wallet_suiet"></div>
    </div>
</template>

<script>
  import MountWallet from '../WalletSuiet'

  export default {
    mounted () {
      MountWallet()
    },
    methods: {
      openMenu() {
        this.$store.commit('SET_OPEN_MENU', true)
      }
    }
  }
</script>