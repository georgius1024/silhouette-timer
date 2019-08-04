class Speaker {
  constructor() {
    this.tracks = [
      '0',
      '1',
      '10',
      '100',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '1h',
      '1m',
      '1s',
      '2',
      '20',
      '200',
      '2h',
      '2m',
      '2s',
      '3',
      '30',
      '300',
      '4',
      '40',
      '400',
      '5',
      '50',
      '500',
      '5h',
      '5m',
      '5s',
      '6',
      '60',
      '600',
      '7',
      '70',
      '700',
      '8',
      '80',
      '800',
      '9',
      '90',
      '900',
      'passed',
      'remained',
      'start',
      'stop',
      'time-is-over',
      'zhgi-mochi',
      'pause',
      'resume',
      'rest',
      'bagpipes',
      '1f',
      '2f',
      'ave1',
      'ave2',
      'odna',
    ]
    this.currentTrack = 0
    this.currentSequence = []
    this.memesEnabled = true
  }
  shutUp() {
    this.tracks.forEach(track => {
      const e = document.getElementById('track_' + track)
      e['pause']()
      e['currentTime'] = 0
    })
  }
  speak(speech) {
    this.shutUp()
    this.currentTrack = 0
    this.currentSequence = speech.map(e => {
      switch (e) {
      case 'finish':
        if (this.memesEnabled) {
          return 'time-is-over'
        } else {
          return 'stop'
        }
      case 'start':
        if (this.memesEnabled) {
          return 'zhgi-mochi'
        } else {
          return 'start'
        }
      default:
        return e
      }
    })
    this.nextWord()
  }
  speakQuantity(prefix, qty, units) {
    const speech = []
    if (prefix) {
      speech.push(prefix)
    }
    if (qty > 20) {
      const dd = Math.floor(qty / 10)
      const mm = qty % 10
      if (dd) {
        speech.push(String(dd * 10))
      }
      switch (mm) {
      case 0:
        if (units) {
          speech.push('5' + units)
        }
        break
      default:
        speech.push(String(mm))
        if (units) {
          speech.push('5' + units)
        }
        break
      case 1:
        speech.push(String(mm) + 'f')
        if (units) {
          speech.push('1' + units)
        }
        break
      case 2:
        speech.push(String(mm) + 'f')
        if (units) {
          speech.push('2' + units)
        }
        break
      case 3:
      case 4:
        speech.push(String(mm))
        if (units) {
          speech.push('2' + units)
        }
        break
      }
    } else if (qty >= 10) {
      speech.push(String(qty))
      if (units) {
        speech.push('5' + units)
      }
    } else {
      switch (qty) {
      default:
        speech.push(String(qty))
        if (units) {
          speech.push('5' + units)
        }
        break
      case 1:
        speech.push(String(qty) + 'f')
        if (units) {
          speech.push('1' + units)
        }
        break
      case 2:
        speech.push(String(qty) + 'f')
        if (units) {
          speech.push('2' + units)
        }
        break
      case 3:
      case 4:
        speech.push(String(qty))
        if (units) {
          speech.push('2' + units)
        }
        break
      }
    }
    this.speak(speech)
  }
  minutesPassed(minutes) {
    this.speakQuantity('passed', minutes, 'm')
  }
  minutesRemained(minutes) {
    this.speakQuantity('remained', minutes, 'm')
  }
  secondsPassed(seconds) {
    this.speakQuantity('passed', seconds, 's')
  }
  secondsRemained(seconds) {
    this.speakQuantity('remained', seconds, 's')
  }
  secondsLastDozen(seconds) {
    this.speakQuantity('', seconds, '')
  }
  nextWord() {
    if (this.currentTrack < this.currentSequence.length) {
      const currentTrack = this.currentSequence[this.currentTrack]
      const e = document.getElementById('track_' + currentTrack)
      console.log('track_' + currentTrack, 'speak')
      e['muted'] = false
      e['play']().catch(() => null)
      this.currentTrack++
    }
  }
  ended() {
    this.nextWord()
  }
  preload() {
    this.tracks.forEach(track => {
      const audio = document.createElement('audio')
      audio.setAttribute('id', 'track_' + track)
      audio['style'].display = 'none'
      audio['controls'] = false
      audio['src'] = 'phrases/' + track + '.mp3'
      audio['muted'] = true
      document.body.appendChild(audio)
      audio['play']().catch(() => null)

      audio.addEventListener('ended', this.ended.bind(this))
    })
  }
}

export default Speaker
