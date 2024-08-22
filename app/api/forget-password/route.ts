import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/user_model'; // Adjust the import path as needed
import { sendResetEmail } from '@/utils/send_email_util'; // Adjust the import path as needed
import dbConnect from '@/utils/db_connect_util';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email } = await req.json();

    // Find the user by email
    const user = await UserModel.findOne({ email }) as typeof UserModel.prototype & { createPasswordResetToken: () => string };

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate a reset token using the schema method
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // Send the reset email
    await sendResetEmail(user.email, resetToken);

    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in forget-password API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
