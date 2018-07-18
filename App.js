import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import TimeSettingComponent from './TimeSettingComponent.js'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      runtime: 0,
      busyTime: 1,
      breakTime: 1
    }
    
    this.buttonText = 'start pomodoro'
    this.pomodoroActive = false
    this.buttonStyle = 'blue'
    this.timerThreshold = this.state.busyTime
  }

  // make changes to UI and start the timer
  startPomodoro() {
    this.timerThreshold = this.state.busyTime
    // set update to 1s interval
    this.interval = setInterval(this.incrementTimer, 1000)
    this.pomodoroActive = true
  }

  // terminate the timer and change the UI
  stopPomodoro() {
    clearInterval(this.interval)
    this.buttonText = 'start pomodoro'
    this.buttonStyle = 'blue'
    this.pomodoroActive = false
    this.timerThreshold = this.state.busyTime
    this.setState({ runtime: 0 })
  }

  // pomodoro on a break
  setPomodoroBreakState() {
    this.buttonText = 'cancel breaktime'
    this.buttonStyle = 'red'
    this.activeTimerType = timerType.breakTimer
    this.timerThreshold = this.state.breakTime
  }

  // pomodoro as busy
  setPomodoroBusyState() {
    this.buttonText = 'take a break'
    this.buttonStyle = 'green'
    this.activeTimerType = timerType.busyTimer
    this.timerThreshold = this.state.busyTime
  }

  // switches between break, active, and vice-versa
  switchPomodoroState() {
    if (this.pomodoroActive) {
      if (this.activeTimerType == timerType.busyTimer) {
        this.setPomodoroBreakState()
      } else {
        this.setPomodoroBusyState()
      }
    } else {
      this.startPomodoro()
      this.setPomodoroBusyState()
    }

    this.setState({runtime: 0})
  }

  // handle timer incrementing within the app state
  incrementTimer = () => {
    // check if the time ran out, and switch pomodoro state    
    if (this.state.runtime >= this.timerThreshold * 60) {
      this.switchPomodoroState()
    }
    
    this.setState(prevState => ({
      runtime: prevState.runtime + 1
    }))
  }

  // will be passed to TimeSettingComponenet in order to lift the state up
  handleBusyTimeChange = (minutes) => {
    this.setState({ busyTime: minutes })
  }
  
  // will be passed to TimeSettingComponenet in order to lift the state up
  handleBreakTimeChange = (minutes) => {
    this.setState({ breakTime: minutes })
  }

  render() {
    // elapsed minutes
    let m = Math.floor(this.state.runtime / 60)
    // elapsed seconds
    let s = (this.state.runtime % 60)

    return (
      <View style={styles.container}>
        <TimeSettingComponent 
          text='keep BUSY for' 
          minutes={this.state.busyTime} 
          onSettingsChange={this.handleBusyTimeChange} />

        <TimeSettingComponent 
          text='then take a BREAK for' 
          minutes={this.state.breakTime} 
          onSettingsChange={this.handleBreakTimeChange} />

        <Button color={this.buttonStyle} title={this.buttonText} onPress={() => this.switchPomodoroState()} />

        <Text style={styles.timer}>
          {('00' + m).slice(-2) + ':' + ('00' + s).slice(-2)}
        </Text>
        
        {this.pomodoroActive && <Button color='grey' title='cancel session' onPress={() => this.stopPomodoro()} />}
        {/* <TimerComponent seconds={this.state.runtime} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 62
  },
});

const timerType = {
  busyTimer: 1,
  breakTimer: 2
}