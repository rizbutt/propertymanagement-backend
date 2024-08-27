import RentModel from '../models/rent_model';
import Rent from '../models/rent_model';
import { IRent } from '@/types/models_types/rent_type';

export class RentRepository {
  async create(RentData: IRent): Promise<IRent> {
    const rent = new Rent(RentData);
    
    return await rent.save();
  }

  // fetching all rents data  rent  to tenant  service
  async fetchAllTenants(user_id: string): Promise<IRent[]> {
    return await RentModel.find({ user_id: user_id }).populate('user_id').exec();
  } 

   //update Rent by passoport unique and user id

   
   async updateRentBytenantNamedUserId(userId: string, tenantName: string, updateData: Partial<IRent>): Promise<IRent | null> {
    const tenantNameRegex = new RegExp(`^${tenantName}$`, 'i');
    return await RentModel.findOneAndUpdate(
      { user_id: userId, tenant_name:  tenantNameRegex },
      { $set: updateData },
      { new: true } // Return the updated document
    );
  }
  
  
  //delete Rent by tenantNameo
  async deleteRentBytenantNamedUserId(userId: string, tenantName: string): Promise<IRent | null> {
    const tenantNameRegex = new RegExp(`^${tenantName}$`, 'i');
    return await RentModel.findOneAndDelete({
      user_id: userId,
      tenant_name: tenantNameRegex
    });
  }
}