import Log from '../models/logs_model';
import { ObjectId } from 'mongodb';

class LogsRepository {
  async getLogsByPropertyNo(propertyNo: string, userId: string) {
    // Check if the userId needs to be converted to ObjectId
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId); // Convert to ObjectId if stored as such
    } catch (error) {
      userObjectId = userId; // Fallback to the string if it's stored as a string
    }



    const result = await Log.aggregate([
      {
        $match: {
          $or: [
            { "requestBody.building_no": propertyNo }, // for rent ,tenant, expense collection
            { "requestBody.property_no": propertyNo }, // for section collection
            { "requestBody.propertyNo": propertyNo } //for property collection
          ],
          "user_id": userObjectId // Use the converted ObjectId or string
        }
      },
      {
        $addFields: {
          collectionType: {
            $cond: {
              if: { $regexMatch: { input: "$path", regex: "/api/tenant" } }, then: "Tenant",
              else: {
                $cond: {
                  if: { $regexMatch: { input: "$path", regex: "/api/rent" } }, then: "Rent",
                  else: {
                    $cond: {
                      if: { $regexMatch: { input: "$path", regex: "/api/expense" } }, then: "Expense",
                      else: {
                        $cond: {
                          if: { $regexMatch: { input: "$path", regex: "/api/property/section" } }, then: "Section",
                          else: {
                            $cond: {
                              if: { $regexMatch: { input: "$path", regex: "/api/property" } }, then: "Property", // New condition for the property collection
                              else: "Unknown"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
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
