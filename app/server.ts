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
    log(`Initializing`)
    const app: Application = express()
    app.use(bodyParser.json())
    app.use((req, res, next) => {
      log(`Requested: ${chalk.yellow(req.method)} ${chalk.blue(req.url)}`,
          `By: ${chalk.green(req.ip)}`,
          `Payload: ${chalk.cyan(JSON.stringify(req.body))}`,
          `Cookies: ${chalk.cyan(req.rawHeaders.toString())}`)
      next()
    })
    app.use('/competition', competitionRouter)
    app.use('/competition/task', taskRouter)

    log(`Connecting to MongoDB at ${chalk.blue(mongooseurl)}`)
    await mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true})
    log(`Connected to MongoDB at ${chalk.blue(mongooseurl)}`)

    const port = process.env.PORT || 8080
    app.listen(port, () => {
      log(`Initialization complete`)
      log(`Listening at port ${chalk.blue(port.toString())}`)
    })
  } catch (e) {
    error(e)
  }
})()
