Page({
  data: {
    floatingHearts: []
  },

  onLoad() {
    this.createFloatingHearts()
  },

  createFloatingHearts() {
    const hearts = []
    for (let i = 0; i < 10; i++) {
      hearts.push({
        id: i,
        left: Math.random() * 100 + '%',
        delay: Math.random() * 3 + 's',
        size: (Math.random() * 10 + 10) + 'px'
      })
    }
    this.setData({ floatingHearts: hearts })
  },

  goToGuessNumber() {
    wx.navigateTo({
      url: '/pages/guess-number/guess-number'
    })
  },

  goToGuessColor() {
    wx.navigateTo({
      url: '/pages/guess-color/guess-color'
    })
  }
})
