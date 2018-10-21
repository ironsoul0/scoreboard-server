import { Router } from 'express'
import { create, get, getAll, remove, update } from '../controller/competition.controller'
export const competitionRouter = Router()

competitionRouter.get('/', async (req, res) => {
  try {
    const competitions = await getAll()
    res.status(200).send(competitions)
  } catch (e) {
    res.status(400).send(e)
  }
})
competitionRouter.get('/id', async (req, res) => {
  try {
    const competition = await get(req.body.id)
    res.status(200).send(competition)
  } catch (e) {
    res.status(400).send(e)
  }
})
competitionRouter.post('/', async (req, res) => {
  try {
    const competition = await create(req.body.data)
    res.status(200).send(competition)
  } catch (e) {
    res.status(400).send(e)
  }
})
competitionRouter.put('/', async (req, res) => {
  try {
    const competition = await update(req.body.data)
    res.status(200).send(competition)
  } catch (e) {
    res.status(400).send(e)
  }
})
competitionRouter.delete('/', async (req, res) => {
  try {
    const competition = await remove(req.body.id)
    res.status(200).send(competition)
  } catch (e) {
    res.status(400).send(e)
  }
})
