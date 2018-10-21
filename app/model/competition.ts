import { Double } from 'bson'
import { Document, Model, model, Schema, Types } from 'mongoose'
import { ITask, TaskSchema } from './task.model'

export interface IRound {
  start: Date
  end: Date
}
export interface ICompetition extends Document {
  name: string
  description: string
  location: string
  rounds: IRound[]
  tasks: Array<Types.DocumentArray<ITask>>
}

export const CompetitionSchema = new Schema({
  name: {type: String, required: 'Enter name'},
  description: {type: String, required: 'Enter description'},
  location: {type: String, required: 'Enter location'},
  rounds: { type: [{ _id: false, start: Date, end: Date }], default: [] },
  tasks: {type: [[TaskSchema]], default: []},
})

CompetitionSchema.pre<ICompetition>('save', function() {
  const rounds = this.rounds.length
  if (this.tasks.length > rounds) {
    this.tasks = this.tasks.slice(0, rounds)
  } else if (this.tasks.length < rounds) {
    for (let i = 0; i < rounds - this.tasks.length + 1; i++) {
      this.tasks.push(new Types.DocumentArray<ITask>())
    }
  }
})

export const Competition = model<ICompetition>('competition', CompetitionSchema)
