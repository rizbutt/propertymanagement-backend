import { authMiddleware } from "@/middlewares/auth_middleware";
import PropertyModel from "@/models/property_model";
import { ReportService } from "@/services/report_service";
import { ExtendedNextRequest } from "@/types/extended_next_request";
import dbConnect from "@/utils/db_connect_util";
import { NextResponse } from "next/server";

export async function GET(req: ExtendedNextRequest) {
  await dbConnect();
  const report_service = new ReportService();

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    // Extract query parameters
    const propertyNo = req.nextUrl.searchParams.get('propertyNo');
    const period = req.nextUrl.searchParams.get('period');
    const year = req.nextUrl.searchParams.get('year');
    const month = req.nextUrl.searchParams.get('month');

    // Validate required parameters
    if (!propertyNo || !period || !year) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (period === 'monthly' && !month) {
      return NextResponse.json({ error: 'Month is required for monthly reports' }, { status: 400 });
    }

    //propertyNo check if exists
    const propertyExist =await PropertyModel.findOne({propertyNo:propertyNo})
    if(!propertyExist){
      return NextResponse.json({ error: 'PropertyNo not exists' }, { status: 400 });
    }
    // Generate the report
    const fetched_report_data = await report_service.generateReportByMonthlyOrYearly(
      propertyNo,
      user_id,
      period as 'monthly' | 'yearly', // Cast to expected type
      parseInt(year), // Convert to number
      month ? parseInt(month) : undefined // Convert to number if month is provided
    );

    return NextResponse.json(fetched_report_data, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
