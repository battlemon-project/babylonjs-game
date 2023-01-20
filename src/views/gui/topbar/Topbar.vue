<template>
    <div id="top_bar" class="no_focus_game">
        <div id="menu_button">
            <div class="menu_button" @click="openMenu"></div>
        </div>
        <keys></keys>
        <mapButton></mapButton>
    </div>
</template>

<script>
  import Keys from '@/views/gui/topbar/Keys'
  import MapButton from '@/views/gui/topbar/MapButton'

  export default {
    components: { Keys, MapButton },
    methods: {
      openMenu() {
        this.$store.commit('SET_OPEN_MENU', true)
      }
    }
  }
</script>