import { Request, Response } from 'express'
import { error, log } from '../logger'

export async function noPermissions(user: any): Promise<boolean> {
  return true
}
export async function anyBody(body: any): Promise<boolean> {
  return true
}
export async function handle(req: Request, res: Response,
                             bodyValidation: (body: any) => Promise<boolean>,
                             userValidation: (user: any) => Promise<boolean>,
                             action: (body: any) => any): Promise<any> {
  const userValid = await userValidation(req.user)
  if (!userValid) {
    res.status(400).send({code: 400,
      message: 'Wasn\'t able to validate the user credentials. Probably you don\'t have rights to access this API.'})
  }
  const bodyValid = await bodyValidation(req.body)
  if (!bodyValid) {
    res.status(400).send({code: 400, message: 'Malformed request body'})
  }
  try {
    const result = await action(req.body)
    res.status(200).send(result)
  } catch (e) {
    error(e)
    res.status(400).send(e)
  }
}
