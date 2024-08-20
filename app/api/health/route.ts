// app/api/health/route.ts 

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db_connect_util';

export async function GET() {
  let dbConnection = false;

  try {
    await dbConnect();
    dbConnection = true;
  } catch (error) {
    dbConnection = false;
  }

  // Format the current date and time
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-US', { hour12: true });
  const formattedDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return NextResponse.json(
    {
      status: 'The server is running',
      time: formattedTime,  // e.g., "10:20:30 AM"
      date: formattedDate,  // e.g., "August 13, 2024"
      dbConnection,         // Indicates if the database connection is successful
    },
    { status: 200 }
  );
}
