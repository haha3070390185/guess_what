const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  const { gameType, targetNumber, targetColor, attempts, success } = event

  try {
    const result = await db.collection('gameRecords').add({
      data: {
        _openid: openid,
        gameType: gameType,
        targetNumber: targetNumber || null,
        targetColor: targetColor || null,
        attempts: attempts,
        success: success,
        createTime: db.serverDate()
      }
    })

    return {
      success: true,
      data: result,
      message: '保存成功'
    }
  } catch (err) {
    console.error('保存游戏记录失败', err)
    return {
      success: false,
      error: err,
      message: '保存失败'
    }
  }
}
