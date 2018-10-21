import bcrypt from 'bcrypt-nodejs'
import crypto from 'crypto'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import validator from 'validator'
import { IUser, IUserRegisterData, User } from '../model/user.model'

const pass = fs.readFileSync('.gmailsecret').toString()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'scoreboard.noreply@gmail.com',
    pass,
  },
})
function generateHash(password: string): string {
  const hash = bcrypt.hashSync(password)
  return hash
}

function checkHash(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

function generateToken(payload: object): string {
  const key = fs.readFileSync('.secret').toString()
  const token = jwt.sign({ data: payload }, key, {
    algorithm: 'HS512',
    expiresIn: 60 * 60 * 24,
  })
  return token
}

export async function register(data: IUserRegisterData) {
  if (data.role !== 'Jury' && data.role !== 'Competitor') {
    throw { code: 400, message: `Cannot register user ${data.email} with role ${data.role}` }
  }
  if (data.password == null || data.email == null || data.name == null || data.name.first == null) {
    throw { code: 400, message: `Cannot register user ${data.email}, malformed request` }
  }
  if (data.password.length < 8) {
    throw { code: 400, message: `Cannot register user ${data.email}, password is too short` }
  }
  if (!validator.isEmail(data.email)) {
    throw { code: 400, message: `Cannot register user ${data.email}, malformed email` }
  }
  const ifUserWasRegisteredBefore = await User.findOne({ email: data.email })
  if (ifUserWasRegisteredBefore != null) {
    throw { code: 400, message: `Cannot register user ${data.email}, user already exists` }
  }
  const hash = generateHash(data.password)

  let user = await User.create({
    email: data.email,
    name: data.name,
    role: data.role,
    hash,
    blocked: false,
    verified: false,
    verificationURL: `http://localhost:8080/account/verify/${data.email}/${crypto.randomBytes(32).toString('hex')}`,
    token: generateToken({ email: data.email, name: data.name, role: data.role }),
  })
  const token = generateToken({ email: data.email, name: data.name, role: data.role })
  user.token = token

  user = await user.save()

  await sendVerificationMail(data.email, token)
  return { token }
}

export async function login(email: string, password: string) {
  let user = await User.findOne({ email })
  if (!user) {
    throw { code: 400, message: `Incorrent email or password` }
  }

  const hash = user.hash

  if (checkHash(password, hash)) {
    const token = generateToken({ email: user.email, name: user.name, role: user.role })
    user.token = token
    user = await user.save()
    return { token, verified: user.verified }
  } else {
    throw { code: 400, message: `Incorrent email or password` }
  }
}

export async function checkToken(email: string, token: string) {
  const user = await User.findOne({ email })
  if (!user) {
    throw { code: 400, message: `Incorrent email or password` }
  }

  return user.token === token
}

export async function sendVerificationMail(email: string, token: string) {
  const user = await User.findOne({ email })
  if (!user) {
    throw { code: 400, message: `Incorrent email or password` }
  }
  if (!checkToken(email, token)) {
    throw { code: 400, message: `Incorrent email or password` }
  }

  await transporter.sendMail({
    from: 'scoreboard.noreply@gmail.com',
    to: user.email,
    subject: 'Verify your account on Scoreboard',
    html: `
      <h2>Hey! Welcome to Scoreboard!</h2>
      <p>Before starting, you need to verify your email address. Please, do so by clicking link below.</p>
      <a href="${user.verificationURL}">Here!</a>
    `,
  })
}

export async function verifyEmail(email: string, bytes: string) {
  const user = await User.findOne({ email })
  if (!user) {
    throw { code: 400, message: `Incorrent email or password` }
  }
  const uri: string[] = user.verificationURL.split('/')
  if (uri[uri.length - 1] === bytes) {
    user.verified = true
    await user.save()
    return { verified: true }
  }
  throw { code: 400, message: 'Incorrect bytes' }
}
