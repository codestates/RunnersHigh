// 로그인
const { user } = require('../../models')
const { signAccessToken, sendAccessToken } = require('../../functions/token')
module.exports = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).send({ message: '모든 정보가 필요합니다' })
  }
  const userInfo = await user.findOne({
    where: {
      email: email,
      password: password
    }
  })
  if (!userInfo) {
    res.status(400).send({ message: '로그인 정보가 일치하지 않습니다' })
  } else {
    delete userInfo.dataValues.password
    const accessToken = signAccessToken(userInfo.dataValues)
    sendAccessToken(res, accessToken, userInfo.id)
  }
}
