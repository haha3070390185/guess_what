App({
  onLaunch() {
    console.log('猜什么小程序启动')
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'guess-what-cloud',
        traceUser: true,
      })
    }
  },
  
  globalData: {
    userInfo: null,
    openId: null
  },
  
  getOpenId() {
    return new Promise((resolve, reject) => {
      if (this.globalData.openId) {
        resolve(this.globalData.openId)
        return
      }
      
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          this.globalData.openId = res.result.openid
          resolve(res.result.openid)
        },
        fail: err => {
          console.error('获取openId失败', err)
          reject(err)
        }
      })
    })
  }
})
