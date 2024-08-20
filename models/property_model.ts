import { IProperty } from "@/types/models_types/property_type";

import mongoose, { Model, Schema } from "mongoose";

const PropertySchema: Schema = new Schema<IProperty>({
    propertyNo: { type: String,required:true,unique:true }, // Property number
    ownerName: { type: String }, // Owner name
    address: { type: String }, // Address
    property_name:{type: String}, //property Name
    property_type:{type:String,enum:['Villa','Building','Commercial']},
    contractDuration: {
      from: { type: Date }, // Contract start date
      to: { type: Date }, // Contract end date
    },
    totalAmount: { type: Number }, // Total rent to be paid
    NoOfInstalments: 
      {
       type: Number  // Rent instalment amount
      },
    bills: [
        {
          type: { type: String }, // Type of bill (water/gas/electric)
          accountNo: { type: String }, // Bill account number
        },
      ] ,   
  
    ownership_type: { type: String, required: true, enum: ['Owned', 'Rented'] },
    user_document: { 
      data: { type: Buffer }, // Binary data for the file
      contentType: { type: String }, // MIME type of the file
    },
    buildingDetails: {
      name:{ type: String, required:true},
      address: { type: String,required:true},
      rooms: { type: Number,required:true},
      kitchens: { type: Number,required:true },
      lobbies: { type: Number,required:true },
      bathrooms: { type: Number,required:true },
      bedrooms:{type: Number, required:true},
      additionalFeatures: { type: String },
    },
    building_images: [{
      data: { type: Buffer,required:true },
      contentType: { type: String }, // MIME type of the file
      description: { type: String }
    }], // Storing Base64 strings
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const PropertyModel= mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

  export default PropertyModel as Model<IProperty>