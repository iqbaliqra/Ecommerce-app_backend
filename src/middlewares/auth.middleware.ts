import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import { SessionModel } from '../models/session.model';

export async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token' });

    const decoded = verifyAccessToken(token) as any;
    if (!decoded) return res.status(401).json({ error: 'Unauthorized: Invalid token' });

    const session = await SessionModel.findById(decoded.sessionId);
    if (!session || !session.valid) return res.status(401).json({ error: 'Session invalid or expired' });

    const role = decoded.role === 'user' || decoded.role === 'admin' ? decoded.role : 'user';

    req.user = {
      userId: decoded.userId,
      role,
      sessionId: decoded.sessionId
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
