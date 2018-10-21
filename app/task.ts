import mongoose, { Document, Model, model, Schema, Types } from 'mongoose'

export interface ITask extends Types.Subdocument {
  title: string
  url?: string
  text?: string
}

export const TaskSchema = new Schema({
  title: String,
  url: { type: String, required: false },
  text: { type: String, required: false },
})
