import SectionService from '@/services/section_service';
import { ExtendedNextRequest } from '@/types/extended_next_request';
import dbConnect from '@/utils/db_connect_util';
import { authMiddleware } from '@/middlewares/auth_middleware';
import { NextResponse } from 'next/server';
import { validateModelData } from '@/utils/validation_util';

export async function POST(req: ExtendedNextRequest) {
    await dbConnect(); // Connect to the database

    const isAuthenticated = await authMiddleware(req); // Authenticate the user

    if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user_id = req.user?.id; // Extract user ID from authenticated user

        if (!user_id) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
        } 
        // Parse and attach user ID to section data
    const sectionData = { 
            ...(await req.json()), // Use req.json() to parse the request body
            user_id: user_id, // Attach user ID to section data
     };
     console.log(sectionData)
        
     // check if user input data correct and data type

    const modelName = 'Section'; 
    const validationError = await validateModelData(modelName, sectionData);

    if (validationError) {
      return NextResponse.json({
        error: 'Bad Request',
        message: validationError,
      }, { status: 400 });
    }

        const sectionService = new SectionService(); // Create a new instance of SectionService
        const newSection = await sectionService.createAndDistributeSection(sectionData); // Create a new section

        return NextResponse.json(newSection, { status: 201 }); // Respond with the created section
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}


/*
 get relevant propertyNo data of sections present to show user 
 and then user in future wanna create an other section from
 existing one or new.
 */

 
 export async function GET(req: ExtendedNextRequest) {
    await dbConnect();
    const section_service=new SectionService()
  
    const isAuthenticated = await authMiddleware(req);
  
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const user_id = req.user?.id; // Extract user ID from authenticated user
  
      if (!user_id) {
        return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
      } 
      
      // Extract property_no from query parameters instead of body
      const property_no = req.nextUrl.searchParams.get('property_no');

      if (!property_no) {
          return NextResponse.json({ error: 'Property number is required' }, { status: 400 });
      }
    
      const fetched_property_data = await section_service.fetchSectionsByPropertyNo(property_no,user_id); // Save property to database
      return NextResponse.json(fetched_property_data, { status: 200 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }
  
  
  
  