
import TenantModel from '../models/tenant_model';
import Tenant from '../models/tenant_model';
import { ITenant } from '@/types/models_types/tenant_type';

class TenantRepository {
  async create(tenant_data: ITenant): Promise<ITenant> {
    const newTenant = new Tenant(tenant_data);
    await newTenant.save();
    return newTenant;
  }

 // fetching all tenants data  rent  to tenant  service
  async fetchAllTenants(user_id: string): Promise<ITenant[]> {
    return await Tenant.find({ user_id: user_id }).populate('user_id').exec();
  }
   //update tenant by passoport unique and user id
  async updateTenantByPassportAndUserId(userId: string, passportNo: string, updateData: Partial<ITenant>): Promise<ITenant | null> {
    return await TenantModel.findOneAndUpdate(
      { user_id: userId, passport_no: passportNo },
      { $set: updateData },
      { new: true } // Return the updated document
    );
  }
  
  
  //delete tenant by passport no
  async deleteTenantByPassportAndUserId(userId: string, passport_no: string): Promise<ITenant | null> {
    return await TenantModel.findOneAndDelete({
      user_id: userId,
      passport_no: passport_no
    });
  }
}

export default TenantRepository;
