import { UserModel, IUser } from '../models/user.model';
import { SessionModel} from '../models/session.model';
import { signAccessToken } from '../utils/jwt.utils';
import mongoose from 'mongoose';
export async function registerUser(
  name:string,
  email: string,
  password: string,
  role: 'user' | 'admin' = 'user'
): Promise<IUser> {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new Error('Email already in use');
  const user = new UserModel({name,email, password, role });
  await user.save();
  return user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: IUser; accessToken: string; sessionId: string }> {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');


  const session = await SessionModel.create({
    userId: user._id,
    valid: true,
    userAgent: 'web-client',
  });


  const sessionId = session._id as mongoose.Types.ObjectId;

  const accessToken = signAccessToken({
    userId: user._id,
    role: user.role,
    sessionId: sessionId,
  });

  return {
    user,
    accessToken,
    sessionId: sessionId.toString(),
  };
}

export async function logoutUser(sessionId: string) {
  await SessionModel.findByIdAndUpdate(sessionId, { valid: false });
}

export async function getUserById(userId: string) {
  return UserModel.findById(userId);
}