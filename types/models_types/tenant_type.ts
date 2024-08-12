import mongoose from "mongoose";

export interface ITenant extends Document {
    name: string;
    building_no: string;
    monthly_rent: number;
    security: number;
    passport_no: string;
    building_address: string;
    contact_no: string;
    sectionName:string;
    user_id: mongoose.Schema.Types.ObjectId; // Reference to the User model

    createdAt?: Date;
    updatedAt?: Date;

  }