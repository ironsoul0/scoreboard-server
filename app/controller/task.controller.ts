import { ObjectId } from 'bson'
import { Competition, ICompetition } from '../model/competition.model'
import { ITask } from '../model/task.model'

export async function create(id: ObjectId, round: number, data: ITask): Promise<ITask[]> {
  let competition = await Competition.findById(id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${id} was not found` }
  }
  if (competition.rounds.length < round || round < 0) {
    throw { code: 400, message: `Round ${round} exceeds bounds of [0, ${competition.rounds.length - 1}]` }
  }
  const push: any = {}
  push[`tasks.${round}`] = data
  competition = await Competition.findByIdAndUpdate(id, { $push: push }, { new: true }) as ICompetition
  return competition.tasks[round]
}

export async function get(id: ObjectId): Promise<ITask[][]> {
  let competition = await Competition.findById(id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${id} was not found` }
  }
  competition.populate('tasks')
  competition = await competition.execPopulate()
  return competition.tasks
}

export async function update(id: ObjectId, round: number, data: ITask): Promise<ITask[]> {
  let competition = await Competition.findById(id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${id} was not found` }
  }
  if (competition.rounds.length < round || round < 0) {
    throw { code: 400, message: `Round ${round} exceeds bounds of [0, ${competition.rounds.length - 1}]` }
  }
  const task = competition.tasks[round].id(data._id)
  if (!task) {
    throw { code: 404, message: `Task with id ${data._id} was not found` }
  }
  const index = competition.tasks[round].indexOf(task)
  competition.tasks[round].set(index, data)
  competition = await competition.save()

  return competition.tasks[round]
}

export async function remove(id: ObjectId, round: number, data: ObjectId): Promise<ITask[]> {
  let competition = await Competition.findById(id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${id} was not found` }
  }
  if (competition.rounds.length < round || round < 0) {
    throw { code: 400, message: `Round ${round} exceeds bounds of [0, ${competition.rounds.length - 1}]` }
  }
  const task = competition.tasks[round].id(data)
  if (!task) {
    throw { code: 404, message: `Task with id ${data} was not found` }
  }
  const index = competition.tasks[round].indexOf(task)
  competition.tasks[round].splice(index, 1)
  competition = await competition.save()

  return competition.tasks[round]
}
