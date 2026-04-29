Page({
  data: {
    gamePhase: 'start',
    colors: [
      { id: 'red', name: '热情红', color: '#FF4777', light: '#FFE6F0', isDisabled: false, isWrong: false },
      { id: 'pink', name: '浪漫粉', color: '#FF6B9D', light: '#FFD4E5', isDisabled: false, isWrong: false },
      { id: 'purple', name: '神秘紫', color: '#9C27B0', light: '#F3E5F5', isDisabled: false, isWrong: false },
      { id: 'blue', name: '深邃蓝', color: '#2196F3', light: '#E3F2FD', isDisabled: false, isWrong: false },
      { id: 'cyan', name: '清新青', color: '#00BCD4', light: '#E0F7FA', isDisabled: false, isWrong: false },
      { id: 'green', name: '自然绿', color: '#4CAF50', light: '#E8F5E9', isDisabled: false, isWrong: false },
      { id: 'yellow', name: '明亮黄', color: '#FFC107', light: '#FFFDE7', isDisabled: false, isWrong: false },
      { id: 'orange', name: '活力橙', color: '#FF9800', light: '#FFF3E0', isDisabled: false, isWrong: false },
      { id: 'coral', name: '珊瑚色', color: '#FF6B6B', light: '#FFEBEE', isDisabled: false, isWrong: false },
      { id: 'teal', name: '蓝绿色', color: '#26A69A', light: '#E0F2F1', isDisabled: false, isWrong: false },
      { id: 'amber', name: '琥珀色', color: '#FFB300', light: '#FFF8E1', isDisabled: false, isWrong: false },
      { id: 'rose', name: '玫瑰红', color: '#E91E63', light: '#FCE4EC', isDisabled: false, isWrong: false }
    ],
    targetColor: null,
    guessHistory: [],
    attempts: 0,
    showHint: false,
    hintMessage: '',
    hintType: '',
    resultMessage: '',
    hasHistory: false,
    previewColors: [],
    colorsCount: 0
  },

  onLoad() {
    this.resetGame()
  },

  resetGame() {
    const colors = this.getResetColors()
    const previewColors = colors.slice(0, 6)
    
    this.setData({
      gamePhase: 'start',
      targetColor: null,
      colors: colors,
      guessHistory: [],
      attempts: 0,
      showHint: false,
      hintMessage: '',
      hintType: '',
      resultMessage: '',
      hasHistory: false,
      previewColors: previewColors,
      colorsCount: colors.length
    })
  },

  getResetColors() {
    return [
      { id: 'red', name: '热情红', color: '#FF4777', light: '#FFE6F0', isDisabled: false, isWrong: false },
      { id: 'pink', name: '浪漫粉', color: '#FF6B9D', light: '#FFD4E5', isDisabled: false, isWrong: false },
      { id: 'purple', name: '神秘紫', color: '#9C27B0', light: '#F3E5F5', isDisabled: false, isWrong: false },
      { id: 'blue', name: '深邃蓝', color: '#2196F3', light: '#E3F2FD', isDisabled: false, isWrong: false },
      { id: 'cyan', name: '清新青', color: '#00BCD4', light: '#E0F7FA', isDisabled: false, isWrong: false },
      { id: 'green', name: '自然绿', color: '#4CAF50', light: '#E8F5E9', isDisabled: false, isWrong: false },
      { id: 'yellow', name: '明亮黄', color: '#FFC107', light: '#FFFDE7', isDisabled: false, isWrong: false },
      { id: 'orange', name: '活力橙', color: '#FF9800', light: '#FFF3E0', isDisabled: false, isWrong: false },
      { id: 'coral', name: '珊瑚色', color: '#FF6B6B', light: '#FFEBEE', isDisabled: false, isWrong: false },
      { id: 'teal', name: '蓝绿色', color: '#26A69A', light: '#E0F2F1', isDisabled: false, isWrong: false },
      { id: 'amber', name: '琥珀色', color: '#FFB300', light: '#FFF8E1', isDisabled: false, isWrong: false },
      { id: 'rose', name: '玫瑰红', color: '#E91E63', light: '#FCE4EC', isDisabled: false, isWrong: false }
    ]
  },

  startSetup() {
    this.setData({
      gamePhase: 'setup'
    })
  },

  selectTargetColor(e) {
    const colorId = e.currentTarget.dataset.id
    const color = this.data.colors.find(function(c) {
      return c.id === colorId
    })
    
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
    const { targetColor, guessHistory, attempts, colors } = this.data
    const guessedColor = colors.find(function(c) {
      return c.id === colorId
    })

    if (!guessedColor) return

    if (guessedColor.isDisabled) return

    const newAttempts = attempts + 1
    let hintMessage = ''
    let hintType = ''

    const updatedColors = colors.map(function(c) {
      if (c.id === colorId && guessedColor.id !== targetColor.id) {
        return {
          ...c,
          isDisabled: true,
          isWrong: true
        }
      }
      return c
    })

    if (guessedColor.id === targetColor.id) {
      hintMessage = `🎉 恭喜你！猜对了！用了 ${newAttempts} 次~`
      hintType = 'success'
      wx.vibrateShort()
      
      const historyItem = {
        color: guessedColor,
        result: 'correct',
        resultText: '✓ 正确',
        attempt: newAttempts
      }

      const history = [...guessHistory, historyItem]

      this.setData({
        colors: updatedColors,
        guessHistory: history,
        attempts: newAttempts,
        gamePhase: 'result',
        showHint: true,
        hintMessage,
        hintType,
        hasHistory: true,
        resultMessage: this.getResultMessage(newAttempts)
      })
      return
    } else {
      hintMessage = `不是「${guessedColor.name}」哦~ 再试试！`
      hintType = 'wrong'
    }

    const historyItem = {
      color: guessedColor,
      result: 'wrong',
      resultText: '✗ 错误',
      attempt: newAttempts
    }

    const history = [...guessHistory, historyItem]

    this.setData({
      colors: updatedColors,
      guessHistory: history,
      attempts: newAttempts,
      showHint: true,
      hintMessage,
      hintType,
      hasHistory: true
    })

    setTimeout(function() {
      this.setData({
        showHint: false
      })
    }.bind(this), 1500)
  },

  getResultMessage(attempts) {
    if (attempts <= 2) {
      return '💕 你们真有默契！'
    } else if (attempts <= 4) {
      return '💗 还不错哦~'
    } else {
      return '💖 再接再厉！'
    }
  },

  playAgain() {
    this.resetGame()
  },

  goBack() {
    wx.navigateBack()
  }
})
