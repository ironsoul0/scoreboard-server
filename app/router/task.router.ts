import { Router } from 'express'
import { create, get, remove, update } from '../controller/task.controller'
import { error, log } from '../logger'
export const taskRouter = Router()

taskRouter.get('/', async (req, res) => {
  try {
    const tasks = await get(req.body.id)
    res.status(200).send(tasks)
  } catch (e) {
    error(e)
    res.status(400).send(e)
  }
})
taskRouter.post('/', async (req, res) => {
  try {
    const tasks = await create(req.body.id, req.body.round, req.body.data)
    res.status(200).send(tasks)
  } catch (e) {
    error(e)
    res.status(400).send(e)
  }
})
taskRouter.put('/', async (req, res) => {
  try {
    const tasks = await update(req.body.id, req.body.round, req.body.data)
    res.status(200).send(tasks)
  } catch (e) {
    error(e)
    res.status(400).send(e)
  }
})
taskRouter.delete('/', async (req, res) => {
  try {
    const tasks = await remove(req.body.id, req.body.round, req.body.data)
    res.status(200).send(tasks)
  } catch (e) {
    error(e)
    res.status(400).send(e)
  }
})
