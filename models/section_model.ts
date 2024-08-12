import { ISection } from "@/types/models_types/section_types"
import mongoose,{ Model, Schema } from "mongoose"

        
        
 const SectionSchema: Schema=new Schema<ISection>({ 
        property_no:{type: String,required:true},
        sectionName: { type: String,required:true}, 
        sectionType: { type: String, enum: ['Shared', 'Single'],required:true },
        rooms: { type: Number,required:true },
        kitchens: { type: Number,required:true},
        bathrooms: { type: Number,required:true },
        bedrooms:{type: Number, required:true},
        lobbies: { type: Number,required:true },
        user_id:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
  } );     

  const SectionModel= mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);

  export default SectionModel as Model<ISection>;