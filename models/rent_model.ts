import { IRent } from "@/types/models_types/rent_type";
import mongoose,{ Model, Schema } from "mongoose";


const RentSchema: Schema=new Schema<IRent>({
    building_no:{type:String,required:true},
    building_name:{type:String,required:true},
    building_address:{type:String,required:true},
    tenant_name:{type:String,required:true,unique:true},
    room_no:{type:Number,required:true},
    collection_date:{type:Date,required:true},
    dues:{type:Number,required:true},
    notes:{type:String},
    user_id:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const RentModel= mongoose.models.Rent || mongoose.model<IRent>('Rent', RentSchema);

export default RentModel as Model<IRent>