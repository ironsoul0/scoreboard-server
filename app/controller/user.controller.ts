import bcrypt from 'bcrypt-nodejs'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { IUser, IUserRegisterData, User } from '../model/user.model'
function generateHash(password: string, salt: string): string {
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

function checkHash(password: string, hash: string, salt: string): boolean {
  return bcrypt.compareSync(password + salt, hash)
}

function generateSalt(): string {
  return bcrypt.genSaltSync()
}

function generateToken(payload: object): string {
  const key = fs.readFileSync('.secret').toString()
  const token = jwt.sign(payload, key, {
    algorithm: 'RS256',
    expiresIn: '1d',
  })
  return token
}

export async function register(data: IUserRegisterData) {
  if (data.role !== 'Jury' && data.role !== 'Competitor') {
    throw { code: 400, message: `Cannot register user ${data.username} with role ${data.role}` }
  }
  if (data.password == null || data.username == null || data.name == null || data.name.first == null) {
    throw { code: 400, message: `Cannot register user ${data.username}, malformed request` }
  }
  if (data.password.length < 8) {
    throw { code: 400, message: `Cannot register user ${data.username}, password is too short` }
  }
  if (data.username.length < 6) {
    throw { code: 400, message: `Cannot register user ${data.username}, username is too short` }
  }
  const ifUserWasRegisteredBefore = await User.findOne({ username: data.username })
  if (ifUserWasRegisteredBefore) {
    throw { code: 400, message: `Cannot register user ${data.username}, user already exists` }
  }
  const salt = generateSalt()
  const hash = generateHash(data.password, salt)

  let user = await User.create({
    username: data.username,
    name: data.name,
    role: data.role,
    hash,
    salt,
    blocked: false,
    token: generateToken({ username: data.username, name: data.name, role: data.role }),
  } as IUser)
  const token = generateToken({ username: data.username, name: data.name, role: data.role })
  user.token = token

  user = await user.save()
  return { token }
}

export async function login(username: string, password: string) {
  let user = await User.findOne({ username })
  if (!user) {
    throw { code: 400, message: `Incorrent username or password` }
  }

  const hash = user.hash
  const salt = user.salt

  if (checkHash(password, hash, salt)) {
    const token = generateToken({ username: user.username, name: user.name, role: user.role })
    user.token = token
    user = await user.save()
    return { token }
  } else {
    throw { code: 400, message: `Incorrent username or password` }
  }
}
