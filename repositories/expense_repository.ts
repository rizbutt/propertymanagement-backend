import ExpenseModel from '../models/expense_model';
import Expense from '../models/expense_model';
import { IExpenses } from '@/types/models_types/expenses_type';

export class ExpenseRepository {
  async create(ExpenseData: IExpenses): Promise<IExpenses> {
    const expense = new Expense(ExpenseData);
    
    return await expense.save();
  }

 
   //update Expense by passoport unique and user id
   async updateExpenseByreceiptAndUserId(userId: string, receiptNo: string, updateData: Partial<IExpenses>): Promise<IExpenses | null> {
    return await ExpenseModel.findOneAndUpdate(
      { user_id: userId, receipt_no: receiptNo },
      { $set: updateData },
      { new: true } // Return the updated document
    );
  }
  
  
  //delete Expense by receipt no
  async deleteExpenseByreceiptAndUserId(userId: string, receipt_no: string): Promise<IExpenses | null> {
    return await ExpenseModel.findOneAndDelete({
      user_id: userId,
      receipt_no: receipt_no
    });
  }
}