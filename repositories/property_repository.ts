import PropertyModel from '../models/property_model';
import Property from '../models/property_model';
import { IProperty } from '@/types/models_types/property_type';

export class PropertyRepository {
  async create(propertyData: IProperty): Promise<IProperty> {
    const property = new Property(propertyData);
    
    return await property.save();
  }


  //getting all properties data of that user 
  async getAllPropertiesOfSpecificUser(user_id: string): Promise<IProperty[]> {
    return await Property.find({ user_id: user_id }).populate('user_id').exec();
  }
  
  /// Update a property by property number and user ID
  async updatePropertyByNumberAndUserId(userId: string, propertyNo: string, updateData: Partial<IProperty>): Promise<IProperty | null> {
    return await PropertyModel.findOneAndUpdate(
      { user_id: userId, propertyNo: propertyNo },
      { $set: updateData },
      { new: true } // Return the updated document
    );
  }
  
  // Delete a property by property number and user ID
  async deletePropertyByNumberAndUserId(userId: string, propertyNo: string): Promise<IProperty | null> {
    return await PropertyModel.findOneAndDelete({
      user_id: userId,
      propertyNo: propertyNo
    });
  }



   

}

