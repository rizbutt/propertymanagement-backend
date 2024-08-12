// utils/validation.ts
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
 
  //  validting the schema fields
import Property from '../models/property_model';
import Tenant from '../models/tenant_model';
import User from  '../models/user_model'
import Rent from '@/models/rent_model';
import Expense from '@/models/expense_model';
import Section from '@/models/section_model'

export async function validateModelData(modelName: string, data: Record<string, any>): Promise<string | null> {
  try {
    switch (modelName) {
      case 'Property':
        const property = new Property(data);
        await property.validate(); // Validates the data based on the Property schema
        break;
      case 'User':
        const user=new User(data);
        await user.validate(); // Validates the data based on the User schema
      case 'Tenant':
        const tenant = new Tenant(data);
        await tenant.validate(); // Validates the data based on the Tenant schema
        break;
      case 'Rent':
        const rent = new Rent(data);
        await rent.validate(); // Validates the data based on the Tenant schema
        break;
      case 'Expense':
        const expense = new Expense(data);
        await expense.validate(); // Validates the data based on the Tenant schema
        break;
      case 'Section':
        const section = new Section(data);
        await section.validate(); // Validates the data based on the Tenant schema
        break;              
      default:
        return `Unknown model: ${modelName}`;
    }
    return null; // Validation passed
  } catch (error) {
    if (error instanceof Error) {
      return `Validation error: ${error.message}`;
    }
    return 'Unknown validation error';
  }
}