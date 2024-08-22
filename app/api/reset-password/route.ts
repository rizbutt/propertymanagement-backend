import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/user_model';
import bycrypt from 'bcrypt';
import crypto from 'crypto'
import dbConnect from '@/utils/db_connect_util';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { token, newPassword } = await req.json();

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Token is invalid or has expired' }, { status: 400 });
    }

    // Hash the new password
    const saltRounds = 10; // Number of rounds for bcrypt
    const hashedPassword = await bycrypt.hash(newPassword, saltRounds);
    console.log(newPassword)
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Error in reset-password API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
