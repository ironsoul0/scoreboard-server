import { unix } from 'moment'
import { Document, Model, model, Schema, Types } from 'mongoose'
import { ITask, TaskSchema } from './task.model'

export const Roles: string[] = [
  'SupervisorAdmin',
  'ProfilerAdmin',
  'Jury',
  'Competitor',
]

export interface IUserRegisterData {
  username: string,
  name: {
    first: string,
    middle?: string,
    last?: string,
  },
  role: string,
  password: string,
}

export interface IUser extends Document {
  username: string,
  name: {
    first: string,
    middle?: string,
    last?: string,
  },
  role: string,
  hash: string,
  salt: string,
  blocked: boolean,
  token?: string,
  created: Date,
}

export const UserSchema = new Schema({
  username: {type: String, required: 'Enter username'},
  name: {
    first: {type: String, requred: 'Enter first name'},
    middle: {type: String},
    last: {type: String},
  },
  role: {
    type: String,
    enum: Roles,
    requred: 'Enter role',
  },
  hash: String,
  salt: String,
  token: String,
  blocked: {type: Boolean, default: false},
  created: {type: Date, required: 'Enter created time'},
})

UserSchema.pre<IUser>('init', function() {
  if (this.isNew) {
    this.created = new Date()
  }
})

export const User = model<IUser>('user', UserSchema)
