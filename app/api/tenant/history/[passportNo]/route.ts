import { NextResponse } from 'next/server';
import { authMiddleware } from '../../../../../middlewares/auth_middleware';
import TenantHistoryService from '../../../../../services/tenant_history_service';
import dbConnect from '../../../../../utils/db_connect_util';
import { ExtendedNextRequest } from '../../../../../types/extended_next_request';

export async function GET(req: ExtendedNextRequest, { params }: { params: { passportNo: string } }) {
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

    const passportNo = params.passportNo; // Extract passportNo from request parameters

    try {
      const history = await TenantHistoryService.getTenantHistoryByPassportNo(passportNo, userId);
      return NextResponse.json({ history }, { status: 200 });
    } catch (error) {
      console.error('Error fetching tenant history:', error);
      return NextResponse.json({ error: 'Failed to fetch tenant history' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
