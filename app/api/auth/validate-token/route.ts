
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ isValid: false, message: 'Token is required' }, { status: 400 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return NextResponse.json({ isValid: true }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ isValid: false, message: 'Invalid or expired token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ isValid: false, message: 'Invalid request' }, { status: 400 });
  }
}
