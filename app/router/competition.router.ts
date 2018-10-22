import { create, get, getAll, getRaw, remove, update, getDetailed } from '../controller/competition.controller'
import { createRouter, IRequest, IUserPayload, RequestMethod } from './base.router'

const requests: IRequest[] = [
  {
    method: RequestMethod.GET,
    path: '/',
    authRequired: false,
    verification: {
      body: [],
      user: async (user) => true,
      beforeAction: async (body, user) => true,
    },
    action: async (body, user) => {
      const competitions = await getAll()
      return competitions
    },
  },
  {
    method: RequestMethod.GET,
    path: '/id',
    authRequired: false,
    verification: {
      body: ['id'],
      user: async (user) => true,
      beforeAction: async (body, user) => true,
    },
    action: async (body, user) => {
      const competition = await get(body.id)
      return competition
    },
  },
  {
    method: RequestMethod.POST,
    path: '/',
    authRequired: true,
    verification: {
      body: ['data.name', 'data.description', 'data.rounds', 'data.location'],
      user: async (user: IUserPayload) => (user.role === 'Jury' || user.role === 'SupervisorAdmin'),
      beforeAction: async (body, user) => true,
    },
    action: async (body, user) => {
      const competition = await create(body.data, user)
      return competition
    },
  },
  {
    method: RequestMethod.PUT,
    path: '/',
    authRequired: true,
    verification: {
      body: ['data.name', 'data.description', 'data.rounds', 'data.location', 'data._id'],
      user: async (user: IUserPayload) => (user.role === 'Jury' || user.role === 'SupervisorAdmin'),
      beforeAction: async (body, user) => {
        const competition = await getRaw(body.data._id)
        return (competition.juries.indexOf(user.email) !== -1)
      },
    },
    action: async (body, user) => {
      const competition = await update(body.data)
      return competition
    },
  },
  {
    method: RequestMethod.DELETE,
    path: '/',
    authRequired: true,
    verification: {
      body: ['id'],
      user: async (user: IUserPayload) => (user.role === 'Jury' || user.role === 'SupervisorAdmin'),
      beforeAction: async (body, user) => {
        const competition = await getRaw(body.id)
        return (competition.creator === user.email)
      },
    },
    action: async (body, user) => {
      const competition = await remove(body.id)
      return competition
    },
  },
  {
    method: RequestMethod.GET,
    path: '/detailed',
    authRequired: true,
    verification: {
      body: ['id'],
      user: async (user: IUserPayload) => (user.role === 'Jury' || user.role === 'SupervisorAdmin'),
      beforeAction: async (body, user) => {
        const competition = await getRaw(body.id)
        return (competition.creator === user.email)
      },
    },
    action: async (body, user) => {
      const competition = await getDetailed(body.id, user)
      return competition
    },
  },
]

export const competitionRouter = createRouter(requests)
