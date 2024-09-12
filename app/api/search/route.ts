import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db_connect_util';
import Property from '@/models/property_model';
import Tenant from '@/models/tenant_model';
import Rent from '@/models/rent_model';
import Expense from '@/models/expense_model';
import SectionModel from '@/models/section_model';
import { ExtendedNextRequest } from '@/types/extended_next_request';
import { authMiddleware } from '@/middlewares/auth_middleware';

export async function GET(req: ExtendedNextRequest) {
  await dbConnect();

  const isAuthenticated = await authMiddleware(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    // Extract search parameters from URL
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('word');
    const categories = searchParams.getAll('categories');
  
    if (!searchTerm || typeof searchTerm !== 'string') {
      return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
    }

    // Prepare an empty object to collect search results
    const result: any = {};

    // Define the text search query with user_id filter
    const searchQuery = { 
      $text: { $search: searchTerm }, 
      user_id: user_id 
    };


    // Conditional search based on specified categories
    if (categories.includes('properties')) {
      const properties = await Property.find(searchQuery);
      result.properties = properties;
    }
    if (categories.includes('sections')) {
      const sections = await SectionModel.find(searchQuery);
      result.sections = sections;
    }
    if (categories.includes('tenants')) {
      const tenants = await Tenant.find(searchQuery);
      result.tenants = tenants;
    }
    if (categories.includes('rents')) {
      const rents = await Rent.find(searchQuery);
      result.rents = rents;
    }
    if (categories.includes('expenses')) {
      const expenses = await Expense.find(searchQuery);
      result.expenses = expenses;
    }

    // If no specific categories are provided, search all collections
    if (categories.length === 0) {
      const [properties, tenants, rents, expenses, sections] = await Promise.all([
        Property.find(searchQuery),
        Tenant.find(searchQuery),
        Rent.find(searchQuery),
        Expense.find(searchQuery),
        SectionModel.find(searchQuery)
      ]);

      result.properties = properties;
      result.tenants = tenants;
      result.rents = rents;
      result.expenses = expenses;
      result.sections = sections;
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
