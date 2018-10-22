import { ObjectId } from 'bson'
import { Competition, ICompetition } from '../model/competition.model'
import { IUserPayload } from '../router/base.router'

export async function create(data: ICompetition, user: IUserPayload): Promise<ICompetition> {
  const set = {
    name: data.name,
    description: data.description,
    location: data.location,
    rounds: data.rounds,
    creator: user.email,
    juries: [user.email],
  }
  let competition = new Competition(set)
  competition = await competition.save()
  return {
    _id: competition._id,
    name: competition.name,
    description: competition.description,
    location: competition.location,
    rounds: competition.rounds,
  } as ICompetition
}

export async function get(id: ObjectId): Promise<ICompetition> {
  const competition = await Competition.findById(id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${id} was not found` }
  }
  return {
    _id: competition._id,
    name: competition.name,
    description: competition.description,
    location: competition.location,
    rounds: competition.rounds,
  } as ICompetition
}

export async function getRaw(id: ObjectId): Promise<ICompetition> {
  const competition = await Competition.findById(id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${id} was not found` }
  }
  return competition
}

export async function getDetailed(id: ObjectId, user: IUserPayload): Promise<ICompetition> {
  const competition = await Competition.findById(id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${id} was not found` }
  }
  return {
    _id: competition._id,
    name: competition.name,
    description: competition.description,
    location: competition.location,
    rounds: competition.rounds,
    creator: competition.creator,
    juries: competition.juries,
  } as ICompetition
}

export async function getAll(): Promise<ICompetition[]> {
  const competitions = await Competition.find({}, { tasks: 0, juries: 0, creator: 0 })
  return competitions
}

export async function update(data: ICompetition): Promise<ICompetition> {
  let competition = await Competition.findById(data._id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${data._id} was not found` }
  }
  competition.name = data.name || competition.name
  competition.description = data.description || competition.description
  competition.location = data.location || competition.location
  competition.rounds = data.rounds || competition.rounds
  competition = await competition.save()
  return {
    _id: competition._id,
    name: competition.name,
    description: competition.description,
    location: competition.location,
    rounds: competition.rounds,
  } as ICompetition
}

export async function remove(id: ObjectId): Promise<ICompetition> {
  const competition = await Competition.findByIdAndRemove(id)
  if (!competition) {
    throw { code: 404, message: `Competition with id ${id} was not found` }
  }
  return {
    _id: competition._id,
    name: competition.name,
    description: competition.description,
    location: competition.location,
    rounds: competition.rounds,
  } as ICompetition
}
