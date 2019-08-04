import React, { Component } from 'react'
import Timer from './timer'
import './App.scss'
import _padStart from 'lodash.padstart'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      indicator: '00:00',
      phase: '',
    }
    this.startWorkPhase = this.startWorkPhase.bind(this)
    this.startRestPhase = this.startRestPhase.bind(this)
    this.workPhaseTick = this.workPhaseTick.bind(this)
    this.restPhaseTick = this.restPhaseTick.bind(this)
    this.stopAll = this.stopAll.bind(this)
  }
  stopAll() {
    if (this.timer) {
      this.timer.stop()
    }
    this.setState({
      phase: '',
      indicator: '00:00',
    })
    console.log('stop all')
  }
  startWorkPhase() {
    this.stopAll()
    this.setState({
      phase: 'work',
    })
    this.timer = new Timer(this.workPhaseTick)
    console.log('start work')
  }
  startRestPhase() {
    this.stopAll()
    this.setState({
      phase: 'rest',
    })
    this.timer = new Timer(this.restPhaseTick)
    console.log('start rest')
  }
  setIndicator(second) {
    const minutes = Math.floor(second / 60)
    const seconds = second % 60
    const indicator = `${_padStart(minutes, 2, '0')}:${_padStart(
      seconds,
      2,
      '0'
    )}`
    this.setState({
      indicator,
    })
    console.log(indicator)
  }
  workPhaseTick(second) {
    this.setIndicator(second)
    if (second >= 5) {
      this.startRestPhase()
    }
  }
  restPhaseTick(second) {
    this.setIndicator(second)
    if (second >= 5) {
      this.stopAll()
    }
  }
  render() {
    return (
      <div className="App">
        <div className={'indicator ' + this.state.phase}>
          {this.state.indicator}
        </div>
        <button
          onClick={this.startWorkPhase}
          className={'work-button ' + this.state.phase}
        >
          Work
        </button>
        <button
          onClick={this.startRestPhase}
          className={'rest-button ' + this.state.phase}
        >
          Rest
        </button>
      </div>
    )
  }
}
export default App
/*
import React, { useEffect, useState } from 'react'
import Timer from './timer'
function App() {
  const [second, setSecond] = useState(0)
  const [indicator, setIndicator] = useState(0)
  const [workPhase, setWorkPhase] = useState(undefined)

  useEffect(() => {
    const timer = new Timer(setSecond)
    return () => timer.stop()
  }, [workPhase])

  useEffect(() => {
    let minutes, seconds
    if (workPhase === true) {
      if (seconds >= 5) {
        setWorkPhase(undefined)
      }
    } else if (workPhase === false) {
      if (seconds >= 5) {
        setWorkPhase(undefined)
      }
    } else {
      minutes = Math.floor(second / 60)
      seconds = second % 60
      setIndicator(`${minutes}:${seconds}`)
      console.log(`${minutes}:${seconds}`)
    }
  }, [second])

  function startWorkPhase() {
    setWorkPhase(true)
  }
  function startRestPhase() {
    setWorkPhase(false)
  }
  return (
    <div className="App">
      <div className="indicator">{indicator}</div>
      <button onClick={startWorkPhase}>Work</button>
      <button onClick={startRestPhase}>Rest</button>
    </div>
  )
}

export default App
*/
