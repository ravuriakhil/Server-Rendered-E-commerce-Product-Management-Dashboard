import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/User';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(req: NextRequest): Promise<IUser | null> {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return null;
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');

    return user;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUserFromCookies(cookieHeader: string | null): Promise<IUser | null> {
  try {
    if (!cookieHeader) {
      return null;
    }

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const token = cookies['token'];

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return null;
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');

    return user;
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: (req: NextRequest, user: IUser) => Promise<Response>) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser(req);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(req, user);
  };
}

export function requireAdmin(handler: (req: NextRequest, user: IUser) => Promise<Response>) {
  // Since all users are admins, this is just an alias for requireAuth
  return requireAuth(handler);
}

export function requireAdminWithParams<T extends Record<string, string>>(
  handler: (req: NextRequest, context: { params: T }) => Promise<Response>
) {
  return async (req: NextRequest, context: { params: T }) => {
    const user = await getCurrentUser(req);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return handler(req, context);
  };
}

