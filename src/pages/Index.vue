<template>
  <q-page padding>
    <q-card class="q-pa-lg main-card" flat>
      <q-btn icon="settings" :to="{name: 'settings'}" flat class="float-right" />

      <q-input
        v-model.number="interval"
        type="number"
        label="Reminder Interval (minutes)"
        borderless
      />
      <q-slider
        v-model.number="interval"
        :min="1"
        :max="300"
        color="primary"
      />

      <q-input
        v-model.number="variability"
        type="number"
        label="Variability (minutes)"
        borderless
      />
      <q-slider
        v-model.number="variability"
        :min="0"
        :max="interval"
        color="warning"
      />

      <q-separator />

      <div class="q-pa-sm">
        You will be notified every:
        <div class="text-center">
          {{ interval | humanMinutes }}
          <span v-show="variability > 0">
            &#177; {{ variability | humanMinutes }}
          </span>
        </div>
      </div>

      <q-separator />

      <q-card-section class="text-center q-mt-sm q-mb-none q-py-none">
        Timer is
        <span v-if="isRunning" class="text-weight-bold">running</span>
        <span v-else class="text-weight-bold">stopped</span>
      </q-card-section>

      <q-card-actions align="stretch" vertical>
        <q-btn class="" color="primary" @click="startTimer" :disable="isRunning" >Start</q-btn>
        <q-btn class="" color="negative" outline @click="stopTimer" :disable="!isRunning">Stop</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
let pluralize = require('pluralize')
import randomInsult from 'src/dictionaries/insults'
import randomMessage from 'src/dictionaries/messages'

export default {
  name: 'Index',
  data () {
    return {
      timer: null,
      interval: 20,
      variability: 0,
      isRunning: false,
      isIdle: false,
      polarity: ['affirmative'],
      topic: 'Posture',
      insults: false
    }
  },
  filters: {
    humanMinutes (val) {
      if (val < 60) {
        return val + ' ' + pluralize('minute', val)
      }
      let hours = Math.floor(val / 60)
      let minutes = val % 60

      return hours + ' ' + pluralize('hour', hours) + ' ' + minutes + ' ' + pluralize('minute', minutes)
    }
  },
  watch: {
    interval (val, oldVal) {
      this.saveLocalKey('interval', val)
      this.restartTimer()
    },
    variability (val, oldVal) {
      this.saveLocalKey('variability', val)
      this.restartTimer()
    }
  },
  methods: {
    saveLocalKey (key, val) {
      if (Number.isInteger(val)) {
        this.$q.localStorage.set(key, val)
      }
    },
    notify () {
      let myNotification = new Notification(this.getTopic(), {
        body: this.getMessage()
      })

      myNotification.onclick = () => {
        console.log('Notification clicked')
      }
    },
    notifyCron () {
      clearTimeout(this.timer)
      this.isRunning = true
      if (this.isActive()) {
        this.timer = setTimeout(() => {
          this.notify()
          this.notifyCron()
        }, this.getTimerTime())
      } else {
        this.timer = setTimeout(() => {
          this.notifyCron()
        }, this.getTimerTime(0.5))
      }
    },
    restartTimer () {
      this.stopTimer()
      this.startTimer()
    },
    stopTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.isRunning = false
    },
    startTimer () {
      this.notifyCron()
    },
    getTimerTime (adjustment = 1) {
      if (this.variability === 0) {
        return (this.interval * 1000 * 60)
      }

      let max = this.interval + this.variability
      let min = this.interval - this.variability
      let time = Math.floor(Math.random() * (max - min + 1)) + min

      return (time * 1000 * 60) * adjustment
    },
    isActive () {
      return this.$q.electron.remote.powerMonitor.getSystemIdleState(1) === 'active'
    },
    getTopic () {
      return this.topic
    },
    getMessage () {
      let msg = randomMessage(this.getTopic(), this.polarity) + this.getInsult()
      return msg.charAt(0).toUpperCase() + msg.slice(1)
    },
    getInsult () {
      if (!this.insults) {
        return ''
      }

      return randomInsult()
    }
  },
  created () {
    ['interval', 'variability', 'topic', 'insults', 'polarity'].forEach(element => {
      if (this.$q.localStorage.has(element)) {
        this[element] = this.$q.localStorage.getItem(element)
      }
    })
    // if (this.$q.localStorage.has('interval')) {
    //   this.interval = this.$q.localStorage.getItem('interval')
    // }
    // if (this.$q.localStorage.has('variability')) {
    //   this.variability = this.$q.localStorage.getItem('variability')
    // }

    this.notifyCron()
  }
}
</script>

<style lang="stylus">
.main-card
  background-color rgba(255, 255, 255, 1)
</style>
