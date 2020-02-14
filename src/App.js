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
    this.interval = 0
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
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = 0
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
    this.speaker.speak(['attention'])
    this.interval = setTimeout(() => {
      this.reset()
      this.timer = new Timer(this.workPhaseTick)
      this.speaker.speak(['fire'])
    }, 3000)
  }
  startRestPhase() {
    this.reset()
    this.setState({
      phase: 'rest',
      indicator: '00:00',
    })
    this.speaker.speak(['rest'])
    this.timer = new Timer(this.restPhaseTick)
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
      this.speaker.speak(['stop-fire'])
      setTimeout(() => {
        this.startRestPhase()
      }, 1000)
    }
  }
  restPhaseTick(second) {
    this.setIndicator(second)
    if (second === 10) {
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
        <hr className="divider" />
        <ul className="rules">
          <li>
            На каждые 5 выстрелов отводится 2,5 минуты. После 5-и выстрелов стрелок обязан поднять
            руку и отчетливо сообщить судье «Стрельбу закончил». Более 5-и выстрелов в отведённые
            2,5 не засчитываются, даже при поражении мишени. За этим обязан следить как сам стрелок
            так и линейный регистратор попаданий. Сбитые мишени при этом записываются как промахи.
          </li>
          <li>
            По истечении 2,5 минут судья дает команду «Стоп Огонь!» и «Отдых». Если все стрелки
            сделали положенные 5 выстрелов раньше 2,5 минут, судья может дать команду раньше. После
            данной команды дается 30 секунд на отдых и перезарядку магазина. Если стрелок сообщил,
            что «стрельбу закончил» раньше отведенного времени, он может положить оружие на стол и
            перезарядить магазин.{' '}
          </li>
          <li>
            По истечении 30 секунд после команды для отдыха подается команда “Огонь” на следующую
            серию мишеней.
          </li>
          <li>
            Во время своей смены стрелок не имеет право покидать свое место стрельбы, садиться и
            облокачиваться на предметы или конструкции, вплоть до команды судьи «Конец смены!».
          </li>
          <li>
            <a
              href="https://www.ataman-team.ru/rules/pravila-siluetnoj-strelbyi.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Все правила
            </a>
          </li>
        </ul>
      </div>
    )
  }
}
export default App
