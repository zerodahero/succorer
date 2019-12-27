<template>
  <q-page padding>
    <q-card class="q-pa-lg q-ma-lg">

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

export default {
  name: 'Index',
  data () {
    return {
      timer: null,
      interval: 20,
      variability: 0,
      isRunning: false
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
      this.restartTimer()
    },
    variability (val, oldVal) {
      this.restartTimer()
    }
  },
  methods: {
    notify () {
      let myNotification = new Notification('Title', {
        body: 'Lorem Ipsum Dolor Sit Amet'
      })

      myNotification.onclick = () => {
        console.log('Notification clicked')
      }
    },
    notifyCron () {
      clearTimeout(this.timer)
      this.isRunning = true
      this.timer = setTimeout(() => {
        this.notify()
        this.notifyCron()
      }, this.getTimerTime())
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
    getTimerTime () {
      return (this.interval * 1000 * 60)
    }
  },
  created () {
    this.notifyCron()
  }
}
</script>
