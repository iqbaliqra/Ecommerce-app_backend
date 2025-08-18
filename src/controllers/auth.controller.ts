import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response) {
  try {
    const { name,email, password, role } = req.body;
    const user = await authService.registerUser(name,email, password, role);
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, accessToken, sessionId } = await authService.loginUser(email, password);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ user: { id: user._id, email: user.email, role: user.role ,token:accessToken}, sessionId });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const sessionId = req.body.sessionId || req.cookies.sessionId;
    if (!sessionId) return res.status(400).json({ error: 'Session id missing' });
    await authService.logoutUser(sessionId);
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
