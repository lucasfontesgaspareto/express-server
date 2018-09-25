import mongoose from 'mongoose'
import { validateUsername } from './validate'

const Schema = mongoose.Schema
const types = mongoose.Schema.Types

const userSchema = new Schema({
  username: { 
    type: types.String, 
    unique: true,
    validate: [{ validator: validateUsername, msg: 'usernameInvalid' }],
  },
}, { timestamps: true })

export default mongoose.model('User', userSchema)