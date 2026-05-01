import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// TODO: Implement full JWT verification middleware
// export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET!);
//     (req as any).user = payload;
//     next();
//   } catch {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// TODO: Add requireRole(role: string) middleware for NGO admin / field officer / auditor

export {};
