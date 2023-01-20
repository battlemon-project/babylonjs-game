<template>
    <div id="controller">
        <div id="controller_box_move"></div>
        <div id="controller_box_rotate"></div>
    </div>
</template>

<style>
    #controller {
        padding: 0;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
    }

    #controller_box_move, #controller_box_rotate {
        position: relative;
        flex: 1;
        animation: bounceIn 3s;
    }

    @keyframes bounceIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
</style>

<script lang="ts">
  import { defineComponent } from 'vue'
  import * as nipples from 'nipplejs'
  import ControllerJoystick from '@/models/playerSelf/ControllerJoystick'

  export default defineComponent({
    name: 'Controller',
    mounted () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.initJoystick()

        }, 2000)
      })
    },
    methods: {
      initJoystick() {
        const controller = new ControllerJoystick(this.$store)

        this.$nextTick(() => {
          const optionsRotate = controller.getOptionsRotate()
          const joystickRotate = nipples.create(optionsRotate)

          joystickRotate.on('start', () => {
            controller.rotateStart()
          })

          joystickRotate.on('move', (evt, data) => {
            if (typeof data.direction == 'undefined') {
              return false
            }

            controller.rotateMove(data.direction.angle)
          })

          joystickRotate.on('end', () => {
            controller.rotateEnd()
          })

          const optionsMove = controller.getOptionsMove()
          const joystickMove = nipples.create(optionsMove)

          joystickMove.on('start', () => {
            controller.moveStart()
          })

          joystickMove.on('move', (evt, data) => {
            if (typeof data.direction == 'undefined') {
              return false
            }

            controller.moveMove(data.direction.angle)
          })

          joystickMove.on('end', () => {
            controller.moveEnd()
          })
        })
      }
    }
  })

</script>