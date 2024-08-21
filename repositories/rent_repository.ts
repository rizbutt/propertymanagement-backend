import RentModel from '../models/rent_model';
import Rent from '../models/rent_model';
import { IRent } from '@/types/models_types/rent_type';

export class RentRepository {
  async create(RentData: IRent): Promise<IRent> {
    const rent = new Rent(RentData);
    
    return await rent.save();
  }

   
   //update Rent by passoport unique and user id
   async updateRentBytenantNamedUserId(userId: string, tenantName: string, updateData: Partial<IRent>): Promise<IRent | null> {
    return await RentModel.findOneAndUpdate(
      { user_id: userId, tenant_name: tenantName },
      { $set: updateData },
      { new: true } // Return the updated document
    );
  }
  
  
  //delete Rent by tenantNameo
  async deleteRentBytenantNamedUserId(userId: string, tenantName: string): Promise<IRent | null> {
    return await RentModel.findOneAndDelete({
      user_id: userId,
      tenant_name: tenantName
    });
  }
}