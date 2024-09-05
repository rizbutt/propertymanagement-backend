import LogModel from "@/models/logs_model";
import mongoose from "mongoose";

export class LogService {
  async createLog(logData: { method: string; path: string; requestBody: any; user_id:string; }) {
    const logEntry = new LogModel(logData);
    return await logEntry.save();
  }
}
