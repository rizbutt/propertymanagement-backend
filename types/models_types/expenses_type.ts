import mongoose from "mongoose"

export interface IExpenses extends Document{
     building_no:string,
     building_name:string,
     receipt_no:string, 
     item_no:number,
     item_quantity:number
     amount:number, 
     payment_date:Date, 
     payment_purpose:string,
     sectionName?:string,
     user_id:mongoose.Schema.Types.ObjectId,

     createdAt?: Date;
     updatedAt?: Date;
}