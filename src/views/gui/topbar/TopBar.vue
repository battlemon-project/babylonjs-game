<template>
    <div id="top_bar" class="no_focus_game">
        <div id="menu_button">
            <div class="menu_button" @click="openMenu"></div>
        </div>
    </div>
</template>

<script>

  export default {
    methods: {
      openMenu() {
        this.$store.commit('SET_OPEN_MENU', true)
      }
    }
  }
</script>