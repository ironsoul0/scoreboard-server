import { Request, Response, Router } from 'express'
import jwt from 'express-jwt'
import _ from 'lodash'
import { error } from '../logger'
import { secret } from '../secret'

export enum RequestMethod {
  GET,
  POST,
  PUT,
  DELETE,
}
export interface IUserPayload {
  email: string,
  name: {
    first: string,
    middle?: string,
    last?: string,
  },
  role: string,
  verified: boolean,
}
export interface IRequest {
  method: RequestMethod,
  path: string,
  authRequired: boolean,
  verification: {
    body: string[],
    user: (user: IUserPayload) => Promise<boolean>,
    beforeAction: (body: any, user: IUserPayload) => Promise<boolean>,
  },
  action: (body: any, user: IUserPayload) => Promise<any>,
}

export function checkBody(body: any, params: string[]): boolean {
  for (const param of params) {
    if (!_.has(body, param)) {
      return false
    }
  }
  return true
}
export function createRouter(requests: IRequest[]): Router {
  const router = Router()
  requests.forEach((request) => {
    const handler = async (req: Request, res: Response) => {
      try {
        const bodyValid = checkBody(req.body, request.verification.body)
        if (!bodyValid) {
          throw { code: 400, message: 'Malformed request body' }
        }
        if (request.authRequired) {
          if (req.user === null) {
            throw { code: 400, message: 'Check JWT token' }
          }
          if (!req.user.data.verified) {
            throw { code: 400, message: 'User is not verified' }
          }
          const userValid = await request.verification.user(req.user.data)
          if (!userValid) {
            throw { code: 400, message: 'User is not verified' }
          }
        }
        const valid = await request.verification.beforeAction(req.body, (req.user) ? req.user.data : null)
        if (!valid) {
          throw { code: 400, message: 'Invalid request, probably not allowed' }
        }

        const actionResponse = await request.action(req.body, (req.user) ? req.user.data : null)
        res.status(200).send(actionResponse)
      } catch (e) {
        error(e)
        res.status(400).send(JSON.stringify(e))
      }
    }

    if (request.method === RequestMethod.GET) {
      router.get(request.path, jwt({ secret: secret.jwt, credentialsRequired: request.authRequired }), handler)
    } else if (request.method === RequestMethod.POST) {
      router.post(request.path, jwt({ secret: secret.jwt, credentialsRequired: request.authRequired }), handler)
    } else if (request.method === RequestMethod.PUT) {
      router.put(request.path, jwt({ secret: secret.jwt, credentialsRequired: request.authRequired }), handler)
    } else if (request.method === RequestMethod.DELETE) {
      router.delete(request.path, jwt({ secret: secret.jwt, credentialsRequired: request.authRequired }), handler)
    }
  })
  return router
}
