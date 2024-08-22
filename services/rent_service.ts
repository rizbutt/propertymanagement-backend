import { RentRepository } from '../repositories/rent_repository';
import { IRent } from '@/types/models_types/rent_type';
export class RentService {
  private RentRepository: RentRepository;

  constructor() {
    this.RentRepository = new RentRepository();
  }

  async addNewRent(RentData: IRent): Promise<IRent> {
    return await this.RentRepository.create(RentData);
  }
 
    // Update a property by property number and user ID
    async updateRentBytenantName(userId: string, tenantName: string, updateData: Partial<IRent>): Promise<IRent | null> {
      const updatedRent = await this.RentRepository.updateRentBytenantNamedUserId(userId, tenantName, updateData);
  
      if (!updatedRent) {
        throw new Error("tenantName not found or could not be updated.");
      }
  
      return updatedRent;
    }
  
  
    // Delete a rent by property number and user ID
    async deleteRent(userId: string, tenantName: string): Promise<IRent | null> {
      const deletedRent = await this.RentRepository.deleteRentBytenantNamedUserId(userId, tenantName);
  
      if (!deletedRent) {
        throw new Error("tenantName not found or could not be deleted.");
      }
      return deletedRent;
  }
  
}

export default RentService