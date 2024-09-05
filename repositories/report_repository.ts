import TenantModel from "@/models/tenant_model";
import ExpenseModel from "@/models/expense_model";
import SectionModel from "@/models/section_model";
import RentModel from "@/models/rent_model";

export class ReportRepository {

    async generateReportByPropertyNO(propertyNo: string, userId: string, period: 'monthly' | 'yearly', year: number, month?: number) {
        // Define the date range for the report
        let startDate: Date;
        let endDate: Date;

        if (period === 'monthly' && month !== undefined) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);
        } else if (period === 'yearly') {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31);
        } else {
            throw new Error("Invalid period or missing month parameter.");
        }

        // Fetch all tenants created or updated within the specified date range
        const tenants = await TenantModel.find({
            building_no: propertyNo,
            user_id: userId,
            $or: [
                { createdAt: { $gte: startDate, $lte: endDate } },
                { updatedAt: { $gte: startDate, $lte: endDate } }
            ]
        });
        // Calculate leased amount (total rent collected)
        const leasedAmount = tenants.reduce((sum, tenant) => sum + tenant.monthly_rent, 0);

        // Fetch all expenses created or updated within the specified date range
     
        const expenses = await ExpenseModel.find({
            building_no: propertyNo,
            user_id: userId,
            $or: [
                { createdAt: { $gte: startDate, $lte: endDate } },
                { updatedAt: { $gte: startDate, $lte: endDate } }
            ]
        });

        // Calculate maintenance cost and other expenses separately
        const maintenanceCost = expenses
            .filter(expense => expense.payment_purpose === 'maintenance')
            .reduce((sum, expense) => sum + expense.amount, 0);

        const otherExpenses = expenses
            .filter(expense => expense.payment_purpose !== 'maintenance')
            .reduce((sum, expense) => sum + expense.amount, 0);

        // Fetch all sections (rooms) for the property
        const allSections = await SectionModel.find({
            user_id: userId,
            property_no: propertyNo,
            $or: [
                { createdAt: { $gte: startDate, $lte: endDate } },
                { updatedAt: { $gte: startDate, $lte: endDate } }
            ]
        });
        const totalRooms = allSections.reduce((sum, section) => sum + section.rooms, 0);
        // Find rented out sections
        const rentedOutSections = tenants.map(tenant => tenant.sectionName);
        const rentedSections = allSections.filter(section => rentedOutSections.includes(section.sectionName));
        // Calculate average number of rented rooms
        const avgRentedRooms = rentedSections.reduce((sum, section) => sum + section.rooms, 0) / totalRooms || 0;

        // Calculate average number of empty rooms
        const notRentedSections = allSections.filter(section => !rentedOutSections.includes(section.sectionName));
        const avgEmptyRooms = notRentedSections.reduce((sum, section) => sum + section.rooms, 0) / totalRooms ||0;
        // Revenue generated is the same as the leased amount
        const allrents= await RentModel.find({
            user_id: userId,
            building_no: propertyNo,
            $or: [
                { createdAt: { $gte: startDate, $lte: endDate } },
                { updatedAt: { $gte: startDate, $lte: endDate } }
            ]
        });
        const revenueGenerated = allrents.reduce((sum, rent) => sum + rent.collection_amount,0)
        // Calculate profit/loss
        const totalExpenses = maintenanceCost + otherExpenses;
        const profitLoss = revenueGenerated - totalExpenses;

        // Return the generated report with percentages for rooms
        return {
            leasedAmount,
            maintenanceCost,
            otherExpenses,
            avgRentedRooms, // Convert to percentage
            avgEmptyRooms,   // Convert to percentage
            revenueGenerated,
            profitLoss
        };
    }
}