import { NextRequest, NextResponse } from 'next/server';
import ExpenseService from '@/services/expense_service';
import dbConnect from '@/utils/db_connect_util';
import { authMiddleware } from '@/middlewares/auth_middleware';
import { ExtendedNextRequest } from '@/types/extended_next_request';
import { validateModelData } from '@/utils/validation_util';
import ExpenseModel from '@/models/expense_model';

export async function POST(req: ExtendedNextRequest) {
  await dbConnect();
  const expenseService = new ExpenseService();
  
  const isAuthenticated = await authMiddleware(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }
    
   
  
    const ExpenseData = { 
      ...await req.json(),
      user_id: user_id, // Attach user ID to Expense data
    };

    const expenseExist =await ExpenseModel.findOne({receipt_no:ExpenseData.receipt_no})
    if(expenseExist){
      return NextResponse.json({ error: 'receipt_no must be unique already assign to someone' }, { status: 400 });
    }
    
      // check if user input data correct and data type

    const modelName = 'Expense'; 
    const validationError = await validateModelData(modelName, ExpenseData);

    if (validationError) {
      return NextResponse.json({
        error: 'Bad Request',
        message: validationError,
      }, { status: 400 });
    }

    const newExpense = await expenseService.addNewExpense(ExpenseData);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(req: ExtendedNextRequest) {
  await dbConnect();
  const expense_service=new ExpenseService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    const receipt_no = req.nextUrl.searchParams.get('receipt_no');

    if (!receipt_no) {
      return NextResponse.json({ error: 'receipt number is required' }, { status: 400 });
  }
  const updatedData = {
    ...await req.json(),
    user_id: user_id, // Attach user ID to property data    // req.body is not valid in Next.js API routes, use req.json() instead
  };
  
  
    const updateData = await expense_service.updateExpense(user_id, receipt_no,updatedData);
    return NextResponse.json(updateData, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: ExtendedNextRequest) {
  await dbConnect();
  const expense_service=new ExpenseService()

  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user_id = req.user?.id; // Extract user ID from authenticated user

    if (!user_id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    } 
    
    const receipt_no = req.nextUrl.searchParams.get('receipt_no');

    if (!receipt_no) {
      return NextResponse.json({ error: 'receipt number is required' }, { status: 400 });
  }
  
    const deleteProperty = await expense_service.deleteExpense(user_id, receipt_no);
    return NextResponse.json(deleteProperty, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}