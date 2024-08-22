import { NextRequest, NextResponse } from 'next/server';
import TenantService from '@/services/tenant_service';
import dbConnect from '@/utils/db_connect_util';
import { authMiddleware } from '@/middlewares/auth_middleware';
import { ExtendedNextRequest } from '@/types/extended_next_request';
import { validateModelData } from '@/utils/validation_util';
import TenantModel from '@/models/tenant_model';

export async function POST(req: ExtendedNextRequest) {
  await dbConnect();
  const tenantService = new TenantService();
  
  const isAuthenticated = await authMiddleware(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }
    
   
  
    const tenantData = { 
      ...await req.json(),
      user_id: user_id, // Attach user ID to tenant data
    };
    const passExist =await TenantModel.findOne({passport_no:tenantData.passport_no})
    if(passExist){
      return NextResponse.json({ error: 'passport no already exist to someone' }, { status: 400 });
    }
    //

      // check if user input data correct and data type

    const modelName = 'Tenant'; 
    const validationError = await validateModelData(modelName, tenantData);

    if (validationError) {
      return NextResponse.json({
        error: 'Bad Request',
        message: validationError,
      }, { status: 400 });
    }

    const newTenant = await tenantService.createTenant(tenantData);
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}


/*
 get relevant Tenant data to show user and then user 
 select that data to fill relavant form connected to Tenant
 */

 
 export async function GET(req: ExtendedNextRequest) {
  await dbConnect();
  const tenant_service=new TenantService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
  
    const fetched_Tenant_data = await tenant_service.fetchTenants(user_id); // Save Tenant to database
    return NextResponse.json(fetched_Tenant_data, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
 
export async function PUT(req: ExtendedNextRequest) {
  await dbConnect();
  const tenant_service=new TenantService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    const passport_no = req.nextUrl.searchParams.get('passport_no');

    if (!passport_no) {
      return NextResponse.json({ error: 'Passport number is required' }, { status: 400 });
  }
  const updatedData = {
    ...await req.json(),
    user_id: user_id, // Attach user ID to property data    // req.body is not valid in Next.js API routes, use req.json() instead
  };
  
  
    const updateData = await tenant_service.updateTenantByPassportNo(user_id, passport_no,updatedData);
    return NextResponse.json(updateData, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: ExtendedNextRequest) {
  await dbConnect();
  const tenant_service=new TenantService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    const passport_no = req.nextUrl.searchParams.get('passport_no');

    if (!passport_no) {
      return NextResponse.json({ error: 'Passport number is required' }, { status: 400 });
  }
  
    const deleteTenant = await tenant_service.deleteTenant(user_id, passport_no);
    return NextResponse.json(deleteTenant, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}