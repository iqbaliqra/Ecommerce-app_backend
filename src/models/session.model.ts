import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  valid: { type: Boolean, default: true },
  userAgent: { type: String },
}, { timestamps: true });

export const SessionModel = mongoose.model<ISession>('Session', sessionSchema);
