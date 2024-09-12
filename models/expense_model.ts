import { IExpenses } from "@/types/models_types/expenses_type";
import mongoose,{ Model, Schema } from "mongoose";


const ExpenseSchema: Schema=new Schema<IExpenses>({
    building_no: { type:String, required:true},
    building_name:{ type:String, required:true},
    receipt_no:{ type:String, required:true,unique:true}, 
    item_no:{ type:Number, required:true},
    item_quantity:{ type:Number, required:true},
    amount:{ type:Number, required:true}, 
    payment_date:{ type:String, required:true}, 
    payment_purpose:{ type:String, required:true},
    sectionName:{type: String, required: true},
    user_id:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
ExpenseSchema.index({ building_no: 'text', building_name: 'text', receipt_no: 'text', payment_purpose: 'text', sectionName: 'text' });

const ExpenseModel= mongoose.models.Expense || mongoose.model<IExpenses>('Expense', ExpenseSchema);

export default ExpenseModel as Model<IExpenses>