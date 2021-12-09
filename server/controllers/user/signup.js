// 회원가입
const { user } = require('../../models')
const bcrypt = require('bcrypt')
module.exports = async (req, res) => {
  const { email, nickname, password } = req.body
  if (!email || !nickname || !password) {
    res.status(422).send({ message: '이메일, 비밀번호, 닉네임 정보가 필요합니다' })
  }

  try {
    const userInfo = await user.findOne({
      where: {
        email: email
      }
    })
    if (!userInfo) {
      const hashPassword = await bcrypt.hashSync(password, 10)
      await user.create({
        email: email,
        password: hashPassword,
        nickname: nickname,
        social_type: 'local',
        image_url: 'https://runnershigh-1.s3.ap-northeast-2.amazonaws.com/1639037178613.jpg'
      })
      res.status(201).send({ message: '회원가입 성공' })
    } else {
      res.status(409).send({ message: '이미존재하는 이메일 입니다' })
    }
  } catch (error) {
    console.log(error)
  }
}
