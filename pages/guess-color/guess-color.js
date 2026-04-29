Page({
  data: {
    gamePhase: 'start', // start, setup, guessing, result
    colors: [
      { id: 'red', name: '热情红', color: '#FF4777', light: '#FFE6F0' },
      { id: 'pink', name: '浪漫粉', color: '#FF6B9D', light: '#FFD4E5' },
      { id: 'purple', name: '神秘紫', color: '#9C27B0', light: '#F3E5F5' },
      { id: 'blue', name: '深邃蓝', color: '#2196F3', light: '#E3F2FD' },
      { id: 'cyan', name: '清新青', color: '#00BCD4', light: '#E0F7FA' },
      { id: 'green', name: '自然绿', color: '#4CAF50', light: '#E8F5E9' },
      { id: 'yellow', name: '明亮黄', color: '#FFC107', light: '#FFFDE7' },
      { id: 'orange', name: '活力橙', color: '#FF9800', light: '#FFF3E0' },
      { id: 'coral', name: '珊瑚色', color: '#FF6B6B', light: '#FFEBEE' },
      { id: 'teal', name: '蓝绿色', color: '#26A69A', light: '#E0F2F1' },
      { id: 'amber', name: '琥珀色', color: '#FFB300', light: '#FFF8E1' },
      { id: 'rose', name: '玫瑰红', color: '#E91E63', light: '#FCE4EC' }
    ],
    targetColor: null,
    guessHistory: [],
    attempts: 0,
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
      targetColor: null,
      guessHistory: [],
      attempts: 0,
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

  selectTargetColor(e) {
    const colorId = e.currentTarget.dataset.id
    const color = this.data.colors.find(c => c.id === colorId)
    
    if (color) {
      this.setData({
        targetColor: color,
        gamePhase: 'guessing'
      })
      wx.vibrateShort()
    }
  },

  makeGuess(e) {
    const colorId = e.currentTarget.dataset.id
    const { targetColor, guessHistory, attempts } = this.data
    const guessedColor = this.data.colors.find(c => c.id === colorId)

    if (!guessedColor) return

    const newAttempts = attempts + 1
    let hintMessage = ''
    let hintType = ''

    if (guessedColor.id === targetColor.id) {
      hintMessage = `🎉 恭喜你！猜对了！用了 ${newAttempts} 次~`
      hintType = 'success'
      wx.vibrateShort()
      
      const history = [...guessHistory, {
        color: guessedColor,
        result: 'correct',
        attempt: newAttempts
      }]

      this.setData({
        guessHistory: history,
        attempts: newAttempts,
        gamePhase: 'result',
        showHint: true,
        hintMessage,
        hintType
      })
      return
    } else {
      hintMessage = `不是「${guessedColor.name}」哦~ 再试试！`
      hintType = 'wrong'
    }

    const history = [...guessHistory, {
      color: guessedColor,
      result: 'wrong',
      attempt: newAttempts
    }]

    this.setData({
      guessHistory: history,
      attempts: newAttempts,
      showHint: true,
      hintMessage,
      hintType
    })

    setTimeout(() => {
      this.setData({
        showHint: false
      })
    }, 1500)
  },

  playAgain() {
    this.resetGame()
  },

  goBack() {
    wx.navigateBack()
  }
})
