import { ExpenseRepository } from '../repositories/expense_repository';
import { IExpenses } from '@/types/models_types/expenses_type';
export class ExpenseService {
  private ExpenseRepository: ExpenseRepository;

  constructor() {
    this.ExpenseRepository = new ExpenseRepository();
  }

  async addNewExpense(ExpenseData: IExpenses): Promise<IExpenses> {
    return await this.ExpenseRepository.create(ExpenseData);
  }
 
  // Update a Expense by Expense number and user ID
  async updateExpense(userId: string, receiptNo: string, updateData: Partial<IExpenses>): Promise<IExpenses | null> {
    const updatedExpense = await this.ExpenseRepository.updateExpenseByreceiptAndUserId(userId, receiptNo, updateData);

    if (!updatedExpense) {
      throw new Error("Expense not found or could not be updated.");
    }

    return updatedExpense;
  }

  
  // Delete a Expense by Expense number and user ID
  async deleteExpense(userId: string, receiptNo: string): Promise<IExpenses | null> {
    const deletedExpense = await this.ExpenseRepository.deleteExpenseByreceiptAndUserId(userId,receiptNo);

    if (!deletedExpense) {
      throw new Error("Expense not found or could not be deleted.");
    }

    return deletedExpense;
  }

  
}

export default ExpenseService