import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../../middlewares/auth_middleware';
import PropertyHistoryService from '../../../../../services/property_history';
import dbConnect from '../../../../../utils/db_connect_util';
import { ExtendedNextRequest } from '../../../../../types/extended_next_request';

export async function GET(req: ExtendedNextRequest, { params }: { params: { propertyNo: string } }) {
  await dbConnect();
  const isAuthenticated = await authMiddleware(req); // Pass request to authMiddleware

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = req.user?.id; // Extract user ID from authenticated user

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const { propertyNo } = params;

    try {
      const history = await PropertyHistoryService.getPropertyHistory(propertyNo, userId);
      return NextResponse.json({ history }, { status: 200 });
    } catch (error) {
      console.error('Error fetching property history:', error);
      return NextResponse.json({ error: 'Failed to fetch property history' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
