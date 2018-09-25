import express from 'express'
import { controllerHandler as ch } from './../utils/functions'
import { getUser, postUser } from './../controllers/user'

const router = express.Router()

router.get('/users/:username', ch(getUser, (req, res) => [req.params]))
router.post('/users', ch(postUser), (req, res) => [req.body])

export default router