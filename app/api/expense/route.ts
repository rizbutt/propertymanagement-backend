import { NextRequest, NextResponse } from 'next/server';
import ExpenseService from '@/services/expense_service';
import dbConnect from '@/utils/db_connect_util';
import { authMiddleware } from '@/middlewares/auth_middleware';
import { ExtendedNextRequest } from '@/types/extended_next_request';
import { validateModelData } from '@/utils/validation_util';

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
