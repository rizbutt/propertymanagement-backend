
import { ITenant } from '@/types/models_types/tenant_type';
import mongoose, { Schema, Model } from 'mongoose';


const TenantSchema: Schema = new Schema<ITenant>({
    name: { type: String, required: true },
    building_no: { type: String, required: true },
    building_name:{type: String, required:true},
    monthly_rent: { type: Number, required: true },
    security: { type: Number, required: true },
    passport_no: { type: String, required: true ,unique:true},
    building_address: { type: String, required: true },
    contact_no: { type: String, required: true },
    sectionName:{type: [String] ,required:true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  TenantSchema.index({
    name: 'text',
    building_no:'text' ,
    building_name:'text',
    monthly_rent: 'text',
    security: 'text',
    passport_no: 'text',
    building_address: 'text',
    contact_no: 'text',
    sectionName:'text'
  })
  
const TenantModel= mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);

export default TenantModel as Model<ITenant>