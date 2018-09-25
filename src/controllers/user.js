import { findUser, createUser } from './../service/user'

export const getUser = async (payload) => {
  return await findUser(payload)
}

export const postUser = async (payload) => {
  return await createUser(payload)
}