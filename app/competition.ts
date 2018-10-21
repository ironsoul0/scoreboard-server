import { Document, Model, model, Schema } from 'mongoose'
import { ITask, TaskSchema } from './task'
export interface ICompetitionLock {
  description: boolean
  tasks: boolean
  competitors: boolean
}

export interface ICompetition extends Document {
  name: string
  description: string
  location: string
  rounds: Array<{ start: Date, end: Date }>
  lock: ICompetitionLock
  tasks: ITask[]
}

export const CompetitionSchema = new Schema({
  name: {type: String, required: 'Enter name'},
  description: {type: String, required: 'Enter description'},
  location: {type: String, required: 'Enter location'},
  rounds: { type: [{ start: Date, end: Date }], default: [] },
  lock: {
    type: { description: Boolean, tasks: Boolean, competitors: Boolean },
    default: { description: false, tasks: false, competitors: false },
  },
  tasks: {
    type: [TaskSchema],
    default: [],
  },
})

export const Competition = model<ICompetition>('competition', CompetitionSchema)
