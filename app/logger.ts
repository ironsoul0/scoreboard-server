import chalk from 'chalk'
import moment from 'moment'

export function log(message: string) {
  console.log(`${chalk.bgBlue(moment.now().toString())}: ${message}`)
}

export function error(message: string) {
  console.log(`${chalk.bgRed(moment.now().toString())}: ${message}`)
}
