<template>
    <div id="battery">
        <div class="battery_box">
            <div class="charge" :style="{height: batteryCharge + '%'}"></div>
        </div>
    </div>

    <div id="sprint_effect" :style="{opacity: batteryCharge}"></div>
</template>

<style>
    #battery {
        position: absolute;
        z-index: 1;
        right: 2%;
        top: 50%;
        margin-top: -10%;
        height: 20%;
        width: 2%;
        border: 1px solid grey;

    }

    #battery .battery_box {
        position: relative;
        height: 100%;
        width: 100%;
    }

    #battery .charge {
        width: 100%;
        background: #2dd36f;
        height: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        -webkit-transition: height 0.5s;
        transition: height 0.5s;
    }

    #sprint_effect {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 150px 15px rgba(6, 255, 45, 0.4) inset;
      animation: sprintEffect 2s infinite;
      -webkit-transition: opacity 2s;
      transition: opacity 2s;
    }

    @keyframes sprintEffect {
      0% {
        box-shadow: 0 0 150px 15px rgba(6, 255, 45, 0.3) inset;
      }

      50% {
        box-shadow: 0 0 110px 15px rgba(6, 255, 45, 0.2) inset;
      }

      100% {
        box-shadow: 0 0 150px 15px rgba(6, 255, 45, 0.3) inset;
      }
    }
</style>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    computed: {
      batteryCharge: function () {
        return this.$store.state.level.batteryCharge
      }
    }
  })
</script>