import User from './../models/User'

export const findUser = payload => {
  return User.find({ username: payload.username }).exec()
}

export const createUser = payload => {
  return User.create({ username: payload.username }).exec()
}