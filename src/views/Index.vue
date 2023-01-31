<template>
  <EthosConnectProvider>
    <ion-page>
      <ion-content :fullscreen="true" scroll-y="false">
        <AddressWidget />
        <canvas id="canvas"></canvas>
      </ion-content>
    </ion-page>
  </EthosConnectProvider>
</template>

<style>
  #canvas {
    background: linear-gradient(180deg,#035161 0,#010024 100%);
    height: 100vh;
    width: 100vw;
  }
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    background: black;
    align-items: center;
  }

  .content {
    display: flow-root;
    box-sizing: content-box;
    margin-left: auto;
    margin-right: auto;
  }
</style>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Hub from '../models/Hub'

  
  export default defineComponent({
    name: 'Hub',
    mounted (): void {
      this.$nextTick(() => {
        this.$store.commit('SET_HUB_STATUS', 'start')
        const hub = new Hub()
        hub.init()
      })
    }
  })
</script>