import mongoose, { Document } from 'mongoose';

export interface ISection extends Document {
    property_no: string;
    sectionName: string; // Dynamically named by the user (e.g., "section1", "section2")
    sectionType: 'Shared' | 'Single';
    rooms: number;
    lobbies: number;
    kitchens: number;
    bathrooms: number;
    bedrooms:number;
    user_id:mongoose.Schema.Types.ObjectId,
    createdAt?:Date,
    updatedAt?:Date
}
