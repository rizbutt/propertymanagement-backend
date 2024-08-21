import PropertyModel from '@/models/property_model';
import { PropertyRepository } from '../repositories/property_repository';
import { IProperty } from '@/types/models_types/property_type';
import { PropertyData } from '@/types/perperty_data_type';
export class PropertyService {
  private propertyRepository: PropertyRepository;

  constructor() {
    this.propertyRepository = new PropertyRepository();
  }

  async addNewProperty(propertyData: IProperty): Promise<IProperty> {
    return await this.propertyRepository.create(propertyData);
  }


 //fetching all properties data of that user with his id

 // fetching propertyNo/Building No, property._id , Building_name,Building_address

   /*
    for each function for fetching property required data 
    *id
    *propertyNo/Building No
    *Building_name
    *Building_address
   */

 async FetchingUserPropertiesData(userId: string): Promise<IProperty[]> {
  const allProperty = await this.propertyRepository.getAllPropertiesOfSpecificUser(userId);

   console.log(allProperty)
  return allProperty;
}

  // Update a property by property number and user ID
  async updateProperty(userId: string, propertyNo: string, updateData: Partial<IProperty>): Promise<IProperty | null> {
    const updatedProperty = await this.propertyRepository.updatePropertyByNumberAndUserId(userId, propertyNo, updateData);

    if (!updatedProperty) {
      throw new Error("Property not found or could not be updated.");
    }

    return updatedProperty;
  }

  
  // Delete a property by property number and user ID
  async deleteProperty(userId: string, propertyNo: string): Promise<IProperty | null> {
    const deletedProperty = await this.propertyRepository.deletePropertyByNumberAndUserId(userId, propertyNo);

    if (!deletedProperty) {
      throw new Error("Property not found or could not be deleted.");
    }

    return deletedProperty;
  }



  
}

export default PropertyService