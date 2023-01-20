<template>
    <div id="settings" class="modal no_focus_game" v-show="this.$store.state.settings.open">
            <div class="container">
                <div class="content">
                    <div class="title margin_bottom">Settings</div>

                    <div class="list">
                        <ion-list>
                            <ion-item lines="full" v-for="(field, index) in this.fields" :key="index">
                                <ion-label>{{ field.name }}</ion-label>
                                <ion-checkbox slot="end" @update:modelValue="(value) => { saveField(field.name, value) }"
                                              :modelValue="field.value">
                                </ion-checkbox>
                            </ion-item>
                        </ion-list>
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
  import { IonCheckbox, IonLabel, IonList, IonItem } from '@ionic/vue'

  export default defineComponent({
    name: 'Home',
    components: {
      IonCheckbox,
      IonLabel,
      IonList,
      IonItem,
    },
    computed: {
      fields() {
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