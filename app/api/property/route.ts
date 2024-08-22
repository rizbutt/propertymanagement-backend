import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db_connect_util';
import  { PropertyService } from '@/services/property_service';
import { authMiddleware } from '@/middlewares/auth_middleware';
import { ExtendedNextRequest } from '@/types/extended_next_request';
import { validateModelData } from '@/utils/validation_util';
import PropertyModel from '@/models/property_model';

export async function POST(req: ExtendedNextRequest) {
  await dbConnect();
  const property_service=new PropertyService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    

    const propertyData = { 
      ...await req.json(), // req.body is not valid in Next.js API routes, use req.json() instead
      user_id: user_id, // Attach user ID to property data
    };
    console.log(propertyData.propertyNo)

    const propertyExist =await PropertyModel.findOne({propertyNo:propertyData.propertyNo})
    if(propertyExist){
      return NextResponse.json({ error: 'PropertyNo already exists' }, { status: 400 });
    }
    // check if user input data correct and data type

    const modelName = 'Property'; 
    const validationError = await validateModelData(modelName, propertyData);

    if (validationError) {
      return NextResponse.json({
        error: 'Bad Request',
        message: validationError,
      }, { status: 400 });
    }

    const property = await property_service.addNewProperty(propertyData); // Save property to database
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/*
 get relevant property data to show user and then user 
 select that data to fill relavant form connected to property
 */

 
export async function GET(req: ExtendedNextRequest) {
  await dbConnect();
  const property_service=new PropertyService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
  
    const fetched_property_data = await property_service.FetchingUserPropertiesData(user_id); // Save property to database
    return NextResponse.json(fetched_property_data, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/*
 get relevant property data to show user and then user 
 select that data to fill relavant form connected to property
 */

 
export async function PUT(req: ExtendedNextRequest) {
  console.log('enter PUT')
  await dbConnect();
  const property_service=new PropertyService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    const property_no = req.nextUrl.searchParams.get('property_no');
    
    if (!property_no) {
      return NextResponse.json({ error: 'Property number is required' }, { status: 400 });
  }

  const updatedData = {
    ...await req.json(),
    user_id: user_id, // Attach user ID to property data    // req.body is not valid in Next.js API routes, use req.json() instead
  };
  
    
    const updatedProperty = await property_service.updateProperty(user_id, property_no, updatedData);
    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


/*
 get relevant property data to show user and then user 
 select that data to fill relavant form connected to property
 */

 
 export async function DELETE(req: ExtendedNextRequest) {
  await dbConnect();
  const property_service=new PropertyService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    const property_no = req.nextUrl.searchParams.get('property_no');

    if (!property_no) {
      return NextResponse.json({ error: 'Property number is required' }, { status: 400 });
  }
  
    const deleteProperty = await property_service.deleteProperty(user_id, property_no);
    return NextResponse.json(deleteProperty, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
