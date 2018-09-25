import User from './../models/User'

export const findUser = (payload) => {
  if (payload.username) {
    return User.findOne({ username: payload.username })
  }
  
  return User.find()
}

export const createUser = (payload) => {
  return User.create({ username: payload.username })
}