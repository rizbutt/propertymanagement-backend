import { NextRequest, NextResponse } from 'next/server';
import RentService from '@/services/rent_service';
import dbConnect from '@/utils/db_connect_util';
import { authMiddleware } from '@/middlewares/auth_middleware';
import { ExtendedNextRequest } from '@/types/extended_next_request';
import { validateModelData } from '@/utils/validation_util';
import RentModel from '@/models/rent_model';

export async function POST(req: ExtendedNextRequest) {
  await dbConnect();
  const rentService = new RentService();
  
  const isAuthenticated = await authMiddleware(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }
    
   
  
    const RentData = { 
      ...await req.json(),
      user_id: user_id, // Attach user ID to Rent data
    };
    const tenantExist =await RentModel.findOne({tenant_name:RentData.tenant_name})
    if(tenantExist){
      return NextResponse.json({ error: 'tenant name already exists' }, { status: 400 });
    }
    //
      // check if user input data correct and data type

    const modelName = 'Rent'; 
    const validationError = await validateModelData(modelName, RentData);

    if (validationError) {
      return NextResponse.json({
        error: 'Bad Request',
        message: validationError,
      }, { status: 400 });
    }

    const newRent = await rentService.addNewRent(RentData);
    return NextResponse.json(newRent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}


export async function GET(req: ExtendedNextRequest) {
  await dbConnect();
  const rent_service=new RentService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    //check if this property exist
    const rentExist = await RentModel.findOne({ user_id:user_id });
    if (!rentExist) {
      return NextResponse.json({ error: 'rents does not exist' }, { status: 404});
    }

    
    const fetched_property_data = await rent_service.fetchRents(user_id); // Save property to database
    return NextResponse.json(fetched_property_data, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


export async function PUT(req: ExtendedNextRequest) {
  await dbConnect();
  const rent_service=new RentService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    const tenantName = req.nextUrl.searchParams.get('tenant_name');

    if (!tenantName) {
      return NextResponse.json({ error: 'tenant_name number is required' }, { status: 400 });
  }
  const updatedData = {
    ...await req.json(),
    user_id: user_id, // Attach user ID to rent data    // req.body is not valid in Next.js API routes, use req.json() instead
  };
  
  
    const updateData = await rent_service.updateRentBytenantName(user_id, tenantName,updatedData);
    return NextResponse.json(updateData, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: ExtendedNextRequest) {
  await dbConnect();
  const rent_service=new RentService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    const tenantName = req.nextUrl.searchParams.get('tenant_name');
    if (!tenantName) {
      return NextResponse.json({ error: 'tenantName number is required' }, { status: 400 });
  }
  
    const deleterent = await rent_service.deleteRent(user_id, tenantName);
    return NextResponse.json(deleterent, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}