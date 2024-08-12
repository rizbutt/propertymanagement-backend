import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db_connect_util';
import { authMiddleware } from '@/middlewares/auth_middleware';
import { ExtendedNextRequest } from '@/types/extended_next_request';
import { DashboardService } from '@/services/dashboard_service';

export async function GET(req: ExtendedNextRequest) {
    await dbConnect();
    const dashboard_service=new DashboardService()
  
    const isAuthenticated = await authMiddleware(req);
  
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const user_id = req.user?.id; // Extract user ID from authenticated user
  
      if (!user_id) {
        return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
      } 

      const fetched_dashboard_metrics = await dashboard_service.getDashboardData(user_id); 

      return NextResponse.json(fetched_dashboard_metrics, { status: 200 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  }