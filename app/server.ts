import bodyParser from 'body-parser'
import express, {Application} from 'express'
import mongoose from 'mongoose'
import { Competition, ICompetition } from './model/competition.model'
import { competitionRouter } from './router/competition.router'
import { taskRouter} from './router/task.router'

(async () => {
  const app: Application = express()
  app.use(bodyParser.json())
  app.use('/competition', competitionRouter)
  app.use('/competition/task', taskRouter)
  await mongoose.connect('mongodb://localhost:27017/test')

  const port = process.env.PORT || 8080
  app.listen(port, () => {
    console.log('Listening on port ' + port)
  })
})()

