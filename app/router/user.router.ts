import { Router } from 'express'
import { checkToken, login, register, verifyEmail } from '../controller/user.controller'
import { error, log } from '../logger'
export const userRouter = Router()

userRouter.get('/verify/:email/:bytes', async (req, res) => {
  try {
    const data = await verifyEmail(req.params.email, req.params.bytes)
    res.send('<body><h1>Redirecting you to the site</h1></body>')
  } catch (e) {
    res.status(400).send(e)
  }
})

userRouter.post('/register', async (req, res) => {
  try {
    const data = await register(req.body)
    res.status(200).send(data)
  } catch (e) {
    error(e)
    res.status(400).send(e)
  }
})

userRouter.post('/login', async (req, res) => {
  try {
    const data = await login(req.body.email, req.body.password)
    res.status(200).send(data)
  } catch (e) {
    error(e)
    res.status(400).send(e)
  }
})
