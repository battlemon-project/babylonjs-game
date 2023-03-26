<template>
    <div id="settings" class="modal no_focus_game" v-show="this.$store.state.settings.open">
            <div class="container">
                <div class="content">
                    <div class="title margin_bottom">Settings</div>

                    <div class="list">
                            <div v-for="(field, index) in this.fields" :key="index">
                                <label>{{ field.name }}</label>
                                <input type="checkbox" @update:modelValue="(value) => { saveField(field.name, value) }"
                                              :modelValue="field.value">
                            </div>
                    </div>

                    <div class="button_bar">
                        <a @click="close" class="button">Close</a>
                    </div>
                </div>
            </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'game-home',
    computed: {
      fields(): any {
        return this.$store.getters.settingFields
      }
    },
    methods: {
      saveField (name: string, value: boolean) {
        this.$store.commit('SET_SETTING_FIELD_VALUE', {name, value})
      },
      close () {
        this.$store.commit('SET_SETTINGS_OPEN', false)
      }
    },
    data: function () {
      return {
        soundEnable: true
      }
    }
  })
</script>