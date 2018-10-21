import bodyParser from 'body-parser'
import express, {Application} from 'express'
import mongoose from 'mongoose'
import { Competition, ICompetition } from './competition'
import { competitionRouter } from './competition.router'

(async () => {
  const app: Application = express()
  app.use(bodyParser.json())
  app.use('/competition', competitionRouter)
  await mongoose.connect('mongodb://localhost:27017/test')

  const port = process.env.PORT || 8080
  app.listen(port, () => {
    console.log('Listening on port ' + port)
  })

})()
