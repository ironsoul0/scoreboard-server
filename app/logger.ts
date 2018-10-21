import chalk from 'chalk'
import moment from 'moment'

export function log(...message: string[]) {
  const unix = moment.now().toString()
  let spacing = ''
  for (let i = 0; i < unix.length + 2; i++) {
    spacing += ' '
  }
  message.forEach((msg, i) => {
    if (i === 0) {
      console.log(`${chalk.bgWhite(unix)}: ${msg}`)
    } else {
      console.log(`${spacing}${msg}`)
    }
  })
}

export function error(message: string) {
  console.log(`${chalk.bgRed(moment.now().toString())}: ${message}`)
}
