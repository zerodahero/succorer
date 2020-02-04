<template>
  <q-page padding>
    <q-card class="q-pa-lg main-card" flat>
      <q-btn icon="arrow_back" :to="{name: 'index'}" flat class="float-right" />

      <div class="text-h4">Settings</div>

      <q-separator />

      <q-card-section>
        <q-input
          v-model="topic"
          type="text"
          label="Topic for reminders"
        />

        <q-list>
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox v-model="polarity" val="affirmative" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Affirmative</q-item-label>
              <q-item-label caption>Provides positive reminders that suggest you engage in the topic.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox v-model="polarity" val="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Negative</q-item-label>
              <q-item-label caption>Provides negative reminders that suggest you not engage in not doing the topic.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-toggle
          label="Insults?"
          v-model="insults"
        />
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
const _ = require('lodash')

export default {
  name: 'Settings',
  data () {
    return {
      polarity: [],
      insults: true,
      topic: ''
    }
  },
  watch: {
    polarity (newVal, oldVal) {
      this.debouncedSave('polarity', newVal)
    },
    insults (newVal, oldVal) {
      this.debouncedSave('insults', newVal)
    },
    topic (newVal, oldVal) {
      this.debouncedSave('topic', newVal)
    }
  },
  methods: {
    saveSetting (key, val) {
      this.$q.localStorage.set(key, val)
    }
  },
  created () {
    this.debouncedSave = _.debounce(this.saveSetting, 300)

    const models = ['topic', 'insults', 'polarity']
    models.forEach(element => {
      if (this.$q.localStorage.has(element)) {
        this[element] = this.$q.localStorage.getItem(element)
      }
    })
  }
}
</script>
