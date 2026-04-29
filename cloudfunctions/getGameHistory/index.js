const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  const { gameType, limit = 20 } = event

  try {
    let query = db.collection('gameRecords').where({
      _openid: openid
    })

    if (gameType) {
      query = query.where({
        gameType: gameType
      })
    }

    const result = await query
      .orderBy('createTime', 'desc')
      .limit(limit)
      .get()

    const totalResult = await db.collection('gameRecords').where({
      _openid: openid,
      ...(gameType ? { gameType } : {})
    }).count()

    const successCountResult = await db.collection('gameRecords').where({
      _openid: openid,
      success: true,
      ...(gameType ? { gameType } : {})
    }).count()

    return {
      success: true,
      data: {
        records: result.data,
        total: totalResult.total,
        successCount: successCountResult.total,
        totalCount: totalResult.total
      },
      message: '获取成功'
    }
  } catch (err) {
    console.error('获取游戏历史失败', err)
    return {
      success: false,
      error: err,
      message: '获取失败'
    }
  }
}
