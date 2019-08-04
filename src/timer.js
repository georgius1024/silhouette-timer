class Timer {
  constructor(callback, interval = 100) {
    this.callback = callback
    this.handle = setInterval(this.tick.bind(this), interval)
    this.reset()
  }
  reset() {
    this.start = new Date().valueOf()
    this.lastTick = this.start
  }
  tick() {
    this.currentTick = new Date().valueOf() - this.start
    const lastSecond = Math.floor(this.lastTick / 1000)
    const currentSecond = Math.floor(this.currentTick / 1000)
    if (currentSecond !== lastSecond && this.callback) {
      this.callback(currentSecond)
    }
    this.lastTick = this.currentTick
  }
  stop() {
    clearInterval(this.handle)
  }
}

export default Timer
