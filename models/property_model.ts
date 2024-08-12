import { IProperty } from "@/types/models_types/property_type";
import mongoose, { Model, Schema } from "mongoose";

const PropertySchema: Schema = new Schema<IProperty>({
    propertyNo: { type: String, required: true }, // Property number
    ownerName: { type: String, required: true }, // Owner name
    address: { type: String, required: true }, // Address
    property_type:{type:String,enum:['Villa','Building','Commercial'], required:true},
    contractDuration: {
      from: { type: Date, required: true }, // Contract start date
      to: { type: Date, required: true }, // Contract end date
    },
    totalRent: { type: Number, required: true }, // Total rent to be paid
    rentInstalments: [
      {
        dueDate: { type: Date, required: true }, // Rent instalment due date
        amount: { type: Number, required: true }, // Rent instalment amount
      },
    ],
    billsToPay: { type: Boolean }, // Bills to be paid flag
    paymentMethod: { type: String, enum: ['Cash', 'Cheque'] }, // Rent payment method
    billsAccounts: [
      {
        type: { type: String }, // Type of bill (water/gas/electric)
        accountNo: { type: String }, // Bill account number
      },
    ],
    ownership_type: { type: String, required: true, enum: ['Owned', 'Rented'] },
    user_document: { 
      data: { type: Buffer }, // Binary data for the file
      contentType: { type: String }, // MIME type of the file
    },
    rentDetails: {
      rentAgreement: { type: String },
      rentAmount: { type: Number },
      rentTenure: { type: Number },
      rentStartDate: { type: Date },
    },
    buildingDetails: {
      name:{ type: String, required: true },
      address: { type: String, required: true },
      rooms: { type: Number, required: true },
      kitchens: { type: Number, required: true },
      lobbies: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
      additionalFeatures: { type: String },
    },
    building_images: [{
      data: { type: Buffer, required: true },
      description: { type: String }
    }], // Storing Base64 strings
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const PropertyModel= mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

  export default PropertyModel as Model<IProperty>