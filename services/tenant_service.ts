import { TenantData } from '@/types/tenant_data_type';
import TenantRepository from '../repositories/tenant_repository';

import { ITenant } from '@/types/models_types/tenant_type';

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
