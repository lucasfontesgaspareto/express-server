import { Router } from 'express'
import { controllerHandler as ch } from './../utils/functions'
import { getUser, postUser } from './../controllers/user'

const router = new Router()

router.get('/users/:username', ch(getUser, req => [req.params]))
router.post('/users', ch(postUser, req => [req.body]))

export default router