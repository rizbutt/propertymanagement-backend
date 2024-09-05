import Log from '../models/logs_model';
import { ObjectId } from 'mongodb';

class LogsRepository {
  async getTenantLogsByPassportNo(passportNo: string, userId: string) {
    // Check if the userId needs to be converted to ObjectId
    let userObjectId: string | ObjectId;
    try {
      userObjectId = new ObjectId(userId); // Convert to ObjectId if stored as such
    } catch (error) {
      userObjectId = userId; // Fallback to the string if it's stored as a string
    }

    
    const result = await Log.aggregate([
      {
        $match: {
          "requestBody.passport_no": passportNo, // Match by passportNo for tenants
          "user_id": userObjectId // Ensure the user ID matches as well
        }
      },
      {
        $addFields: {
          collectionType: {
            $cond: {
              if: { $regexMatch: { input: "$path", regex: "/api/tenant" } }, then: "Tenant",
              else: "Unknown" // Since we're only focused on the tenant collection
            }
          }
        }
      },
      {
        $project: {
          timestamp: 1,
          method: 1,
          path: 1,
          requestBody: 1,
          user_id: 1,
          collectionType: 1
        }
      },
      { $sort: { timestamp: 1 } }
    ]);

    return result;
  }
}

export default new LogsRepository();
