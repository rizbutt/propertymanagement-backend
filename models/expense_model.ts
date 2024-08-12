import { IExpenses } from "@/types/models_types/expenses_type";
import mongoose,{ Model, Schema } from "mongoose";


const RentSchema: Schema=new Schema<IExpenses>({
    building_no: { type:String, required:true},
    building_name:{ type:String, required:true},
    receipt_no:{ type:String, required:true}, 
    item_no:{ type:Number, required:true},
    item_quantity:{ type:Number, required:true},
    amount:{ type:Number, required:true}, 
    payment_date:{ type:Date, required:true}, 
    payment_purpose:{ type:String, required:true},
    sectionName:{type: String},
    user_id:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const RentModel= mongoose.models.Expense || mongoose.model<IExpenses>('Expense', RentSchema);

export default RentModel as Model<IExpenses>