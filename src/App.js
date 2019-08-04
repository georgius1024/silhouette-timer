import React, { Component } from 'react'
import Timer from './utils/timer'
import Speaker from './utils/speaker'
import './App.scss'
import _padStart from 'lodash.padstart'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      indicator: '00:00',
      phase: 'stop',
    }
    this.startWorkPhase = this.startWorkPhase.bind(this)
    this.startRestPhase = this.startRestPhase.bind(this)
    this.workPhaseTick = this.workPhaseTick.bind(this)
    this.restPhaseTick = this.restPhaseTick.bind(this)
    this.stopAll = this.stopAll.bind(this)
    this.speaker = new Speaker()
  }
  componentDidMount() {
    this.speaker.preload()
  }
  componentWillUnmount() {
    this.reset()
  }
  reset() {
    if (this.timer) {
      this.timer.stop()
      this.timer = null
    }
  }
  stopAll(e) {
    this.reset()
    this.setState({
      phase: 'stop',
      indicator: '00:00',
    })
    this.speaker.speak(['stop'])
  }
  startWorkPhase() {
    this.reset()
    this.setState({
      phase: 'work',
      indicator: '00:00',
    })
    this.timer = new Timer(this.workPhaseTick)
    this.speaker.speak(['start'])
  }
  startRestPhase() {
    this.reset()
    this.setState({
      phase: 'rest',
      indicator: '00:00',
    })
    this.timer = new Timer(this.restPhaseTick)
    if (this.speaker.memesEnabled) {
      this.speaker.speak(['rest', 'bagpipes'])
    } else {
      this.speaker.speak(['rest'])
    }
  }
  setIndicator(second) {
    const minutes = Math.floor(second / 60)
    const seconds = second % 60
    const indicator = `${_padStart(minutes, 2, '0')}:${_padStart(seconds, 2, '0')}`
    this.setState({
      indicator,
    })
  }
  workPhaseTick(second) {
    this.setIndicator(second)
    switch (second) {
      case 30:
        this.speaker.speak(['passed', '30', '5s'])
        break
      case 60:
        this.speaker.speak(['passed', 'odna', '1m'])
        break
      case 90:
        this.speaker.speak(['remained', 'odna', '1m'])
        break
      case 120:
        this.speaker.speak(['remained', '30', '5s'])
        break
      case 130:
        this.speaker.speak(['remained', '20', '5s'])
        break
      default:
        if (second >= 140 && second < 150) {
          this.speaker.speak([150 - second])
        }
        break
    }
    if (second >= 150) {
      this.reset()
      this.speaker.speak(['stop'])
      setTimeout(() => {
        this.startRestPhase()
      }, 1000)
    }
  }
  restPhaseTick(second) {
    this.setIndicator(second)
    if (second === 10 && !this.speaker.memesEnabled) {
      this.speaker.speak(['remained', '20', '5s'])
    }
    if (second === 20) {
      this.speaker.speak(['remained', '10', '5s'])
    }
    if (second === 25) {
      this.speaker.speak(['remained', '5', '5s'])
    }
    if (second >= 30) {
      this.reset()
      this.speaker.speak(['stop'])
      setTimeout(() => {
        this.startWorkPhase()
      }, 1000)
    }
  }
  render() {
    const phase =
      this.state.phase === 'work' ? 'Стреляем' : this.state.phase === 'rest' ? 'Отдыхаем' : 'Стоп'

    return (
      <div className="App">
        <div className={'indicator ' + this.state.phase}>
          <div className="phase">{phase}</div>
          <div className="time">{this.state.indicator}</div>
        </div>
        <button
          onClick={this.startWorkPhase}
          className={'work-button ' + (this.state.phase === 'work' ? 'active' : '')}
        >
          Стреляем
        </button>
        <button
          onClick={this.startRestPhase}
          className={'rest-button ' + (this.state.phase === 'rest' ? 'active' : '')}
        >
          Отдыхаем
        </button>
        <button
          onClick={this.stopAll}
          className={'stop-button ' + (this.state.phase === '' ? 'active' : '')}
        >
          Стоп
        </button>
      </div>
    )
  }
}
export default App
