import bodyParser from 'body-parser'
import chalk from 'chalk'
import express, { Application } from 'express'
import mongoose from 'mongoose'
import { error, log } from './logger'
import { competitionRouter } from './router/competition.router'
import { taskRouter } from './router/task.router'

const mongooseurl = 'mongodb://localhost:27017/test';

(async () => {
  try {
    const app: Application = express()
    app.use(bodyParser.json())
    app.use('/competition', competitionRouter)
    app.use('/competition/task', taskRouter)
    log(`Connecting to Mongoose at ${chalk.blue(mongooseurl)}`)
    await mongoose.connect('mongodb://localhost:27017/test')
    log(`Connected to Mongoose at ${chalk.blue(mongooseurl)}`)

    const port = process.env.PORT || 8080
    app.listen(port, () => {
      log(`Listening at port ${chalk.blue(port.toString())}`)
    })
  } catch (e) {
    error(e)
  }
})()
