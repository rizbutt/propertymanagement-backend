import { TenantData } from '@/types/tenant_data_type';
import TenantRepository from '../repositories/tenant_repository';

import { ITenant } from '@/types/models_types/tenant_type';
import TenantModel from '@/models/tenant_model';

class TenantService {
  private tenantRepository: TenantRepository;

  constructor() {
    this.tenantRepository = new TenantRepository();
  }
  // for creating or add new Tenant
  async createTenant(tenant_data: ITenant): Promise<ITenant> {
    return this.tenantRepository.create(tenant_data);
  }

  //get all tenant with that user with his id who added them prev
  /*
  return all tenant name list to tenant get api and then
  user will select specific name from list of tenants list 
  */

  async fetchTenants(userId: string): Promise<ITenant[]>{
    const allTenants =await this.tenantRepository.fetchAllTenants(userId);
   
    return allTenants;
  }

   // Update a Tenant by property number and user ID
   async updateTenantByPassportNo(userId: string, passportNo: string, updateData: Partial<ITenant>): Promise<ITenant | null> {
    const updatedTenant = await this.tenantRepository.updateTenantByPassportAndUserId(userId, passportNo, updateData);

    if (!updatedTenant) {
      throw new Error("Tenant not found or could not be updated.");
    }

    return updatedTenant;
  }


  // // Method to remove a sectionName from a tenant's record by passport number and user ID
  // async removeSectionName(
  //   userId: string,
  //   passportNo: string,
  //   sectionToRemove: string
  // ): Promise<ITenant | null> {
  //   try {
  //     const updatedTenant = await TenantModel.findOneAndUpdate(
  //       { user_id: userId, passport_no: passportNo },
  //       { $pull: { sectionName: sectionToRemove } }, // Remove the specific sectionName
  //       { new: true } // Return the updated document
  //     );

  //     if (!updatedTenant) {
  //       throw new Error('Tenant not found');
  //     }

  //     return updatedTenant;
  //   } catch (error) {
  //     console.error('Error removing section:', error);
  //     throw new Error('Failed to remove section');
  //   }
  // }


  // Delete a Tenant by property number and user ID
  async deleteTenant(userId: string, passportNo: string): Promise<ITenant | null> {
    const deletedTenant = await this.tenantRepository.deleteTenantByPassportAndUserId(userId, passportNo);

    if (!deletedTenant) {
      throw new Error("Property not found or could not be deleted.");
    }
    return deletedTenant;
}
}
export default TenantService;
