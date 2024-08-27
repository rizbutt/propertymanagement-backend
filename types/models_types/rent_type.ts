import mongoose from "mongoose"

export  interface IRent extends Document{
    building_no:string,
    building_name:string,
    building_address:string,
    tenant_name:string,
    room_no:number,
    collection_date:Date,
    collection_amount:number,
    dues:number,
    notes?:string,
    user_id:mongoose.Schema.Types.ObjectId,

    createdAt?: Date;
    updatedAt?: Date;
}