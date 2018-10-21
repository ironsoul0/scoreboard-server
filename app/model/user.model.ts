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
  email: string,
  name: {
    first: string,
    middle?: string,
    last?: string,
  },
  role: string,
  password: string,
}

export interface IUser extends Document {
  email: string,
  name: {
    first: string,
    middle?: string,
    last?: string,
  },
  role: string,
  hash: string,
  blocked: boolean,
  verified: boolean,
  verificationURL: string,
  token?: string,
  created: Date,
}

export const UserSchema = new Schema({
  email: { type: String, required: 'Enter username', unique: true },
  name: {
    first: { type: String, requred: 'Enter first name' },
    middle: { type: String },
    last: { type: String },
  },
  role: {
    type: String,
    enum: Roles,
    requred: 'Enter role',
  },
  hash: String,
  token: String,
  blocked: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  verificationURL: String,
  created: Date,
})

UserSchema.pre<IUser>('init', function() {
  if (this.isNew) {
    this.created = new Date()
  }
})

export const User = model<IUser>('user', UserSchema)
