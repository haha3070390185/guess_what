Page({
  data: {
    gamePhase: 'start', // start, setup, guessing, result
    targetNumber: null,
    guessNumber: '',
    minRange: 1,
    maxRange: 100,
    currentMin: 1,
    currentMax: 100,
    guessHistory: [],
    attempts: 0,
    setupNumber: '',
    showHint: false,
    hintMessage: '',
    hintType: ''
  },

  onLoad() {
    this.resetGame()
  },

  resetGame() {
    this.setData({
      gamePhase: 'start',
      targetNumber: null,
      guessNumber: '',
      minRange: 1,
      maxRange: 100,
      currentMin: 1,
      currentMax: 100,
      guessHistory: [],
      attempts: 0,
      setupNumber: '',
      showHint: false,
      hintMessage: '',
      hintType: ''
    })
  },

  startSetup() {
    this.setData({
      gamePhase: 'setup'
    })
  },

  onSetupInput(e) {
    const value = e.detail.value
    if (/^\d*$/.test(value)) {
      this.setData({
        setupNumber: value
      })
    }
  },

  confirmNumber() {
    const num = parseInt(this.data.setupNumber)
    const { minRange, maxRange } = this.data

    if (!num && num !== 0) {
      this.showHint('请输入数字哦~', 'error')
      return
    }

    if (num < minRange || num > maxRange) {
      this.showHint(`数字需要在 ${minRange} - ${maxRange} 之间哦~`, 'error')
      return
    }

    this.setData({
      targetNumber: num,
      gamePhase: 'guessing',
      setupNumber: ''
    })

    wx.vibrateShort()
  },

  onGuessInput(e) {
    const value = e.detail.value
    if (/^\d*$/.test(value)) {
      this.setData({
        guessNumber: value
      })
    }
  },

  makeGuess() {
    const guess = parseInt(this.data.guessNumber)
    const { targetNumber, currentMin, currentMax, guessHistory, attempts } = this.data

    if (!guess && guess !== 0) {
      this.showHint('请输入数字哦~', 'error')
      return
    }

    if (guess < currentMin || guess > currentMax) {
      this.showHint(`数字需要在 ${currentMin} - ${currentMax} 之间哦~`, 'error')
      return
    }

    const newAttempts = attempts + 1
    let newMin = currentMin
    let newMax = currentMax
    let hintMessage = ''
    let hintType = ''

    if (guess === targetNumber) {
      hintMessage = `🎉 恭喜你！猜对了！用了 ${newAttempts} 次~`
      hintType = 'success'
      wx.vibrateShort()
      
      const history = [...guessHistory, {
        number: guess,
        result: 'correct',
        attempt: newAttempts
      }]

      this.setData({
        guessHistory: history,
        attempts: newAttempts,
        gamePhase: 'result',
        showHint: true,
        hintMessage,
        hintType,
        guessNumber: ''
      })
      return
    } else if (guess < targetNumber) {
      hintMessage = '猜小了哦~ 再试试！'
      hintType = 'low'
      newMin = Math.max(currentMin, guess + 1)
    } else {
      hintMessage = '猜大了哦~ 再试试！'
      hintType = 'high'
      newMax = Math.min(currentMax, guess - 1)
    }

    const history = [...guessHistory, {
      number: guess,
      result: guess < targetNumber ? 'low' : 'high',
      attempt: newAttempts
    }]

    this.setData({
      guessHistory: history,
      attempts: newAttempts,
      currentMin: newMin,
      currentMax: newMax,
      showHint: true,
      hintMessage,
      hintType,
      guessNumber: ''
    })

    setTimeout(() => {
      this.setData({
        showHint: false
      })
    }, 2000)
  },

  showHint(message, type) {
    this.setData({
      showHint: true,
      hintMessage: message,
      hintType: type
    })

    if (type !== 'success') {
      setTimeout(() => {
        this.setData({
          showHint: false
        })
      }, 2000)
    }
  },

  playAgain() {
    this.resetGame()
  },

  goBack() {
    wx.navigateBack()
  }
})
