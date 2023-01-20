<template>
    <div id="keys">
        <div v-for="key in this.$store.state.level.keys" v-bind:key="key.id" class="key"
             :class="{taken_away: key.status }" :style="{width: this.keysSize + 'px', height: this.keysSize + 'px'}">

        </div>
    </div>
</template>

<style>
    #keys {
        height: 100%;
        width: 60%;
        display: flex;
        justify-content: center;
    }

    #top_bar .key {
        margin-left: 1%;
        margin-right: 1%;
        border-radius: 100%;
        border: 1px solid grey;
        -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
        -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
        box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    }

    #top_bar .taken_away {
        background: #e9ff00;
        animation: active 1s normal forwards ease-in-out;
    }

    @keyframes active {
        0%   { transform: scale(1); }
        30%  { transform: scale(1.5); }
        100%  { transform: scale(1); }
    }
</style>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    mounted () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.setSize()
        }, 2000)
      })

      window.addEventListener('resize', () => {
        this.setSize()
      })
    },
    methods: {
      setSize (): void {
        const keysBar = document.getElementById('keys') as HTMLElement
        this.keysSize = keysBar.offsetHeight / 1.3
      }
    },
    data () {
      return {
        keysSize: 0
      }
    }
  })
</script>