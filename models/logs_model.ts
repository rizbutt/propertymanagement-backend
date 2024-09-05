import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the TypeScript interface for the Log document
export interface ILog extends Document {
  timestamp: Date;
  method: string;
  path: string;
  requestBody: object;
  user_id: mongoose.Schema.Types.ObjectId; // Reference to the user model
}

// Define the Mongoose schema
const LogSchema = new Schema<ILog>({
  timestamp: { type: Date, default: Date.now }, // Automatically set the timestamp
  method: { type: String, required: true },
  path: { type: String, required: true },
  requestBody: { type: Object, required: true },
  user_id:{type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
});

// Export the Mongoose model
const LogModel= mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default LogModel as Model<ILog>