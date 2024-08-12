import Section from '@/models/section_model';
import Tenant from '@/models/tenant_model';
import Expense from '@/models/expense_model';
import Rent from '@/models/rent_model';
import Property from '@/models/property_model'

export class DashboardRepository {


    // Total number properties by user id which is logged
    public async countTotalProperty(userId:string) {
        return await Property.countDocuments({user_id:userId});
    }
    // Total number Tenants by user id which is logged
    public async countTotalTenants(userId:string) {
        return await Tenant.countDocuments({user_id:userId});
    }
    // Total number section by user id which is logged
    public async countTotalSections(userId:string) {
        return await Section.countDocuments({user_id:userId});
    }

   // Total number of sections by user ID those are rent out
    public async countRentedOutSections(userId: string) {
        const allSections = await Section.find({user_id:userId});
        const rentedOutSections = await Tenant.find({ user_id: userId });
        const rentedOutSectionIds = rentedOutSections.map(tenant => tenant.sectionName);

        return allSections.filter(section => rentedOutSectionIds.includes(section.sectionName)).length;
    }
    // Total number of building by user ID those are rent out
    public async countRentedOutBuildings(userId: string) {
        const allProperties = await Property.find({user_id:userId});
        const rentedOutSections = await Tenant.find({ user_id: userId });
        const rentedOutSectionIds = rentedOutSections.map(tenant => tenant.building_no);

        return allProperties.filter( property=> rentedOutSectionIds.includes(property.propertyNo)).length;
    }

    // Total number of building by user ID those are not rent out
    public async countEmptyBuildings(userId: string) {
        const allProperties = await Property.find({user_id:userId});
        const rentedOutBuildinds = await Tenant.find({ user_id: userId });
        const rentedOutBuildingsNO = rentedOutBuildinds.map(tenant => tenant.building_no);

        return allProperties.filter( property=> !rentedOutBuildingsNO.includes(property.propertyNo)).length;
    }


    // Total number of empty section  
    public async countEmptySections(userId: string) {
        const allSections = await Section.find({user_id:userId});
        const rentedOutSections = await Tenant.find({ user_id: userId });
        const rentedOutSectionIds = rentedOutSections.map(tenant => tenant.sectionName);

        return allSections.filter(section => !rentedOutSectionIds.includes(section.sectionName)).length;
    }


    // Get total number of sections are under constructions 
    public async countUnderConstructionSections(userId: string) {
        const allSections = await Section.find({user_id:userId});
        const allExpense = await Expense.find({ user_id: userId });
        const underConstructionsSectionNO=allExpense.map(expense=>expense.sectionName)
        return allSections.filter(section => underConstructionsSectionNO.includes(section.sectionName)).length
    }
    

    // Get total number of Buildings are under constructions 
    public async countUnderConstructionBuildings(userId: string) {
        const allProperty = await Property.find({user_id:userId});
        const allExpense = await Expense.find({ user_id: userId });
        const underConstructionsBuildingsNO=allExpense.map(expense=>expense.building_no)
        return allProperty.filter(property => underConstructionsBuildingsNO.includes(property.propertyNo)).length
    }

    
    // get the current Month collected Rent 

    public async getCurrentMonthlyRent(userId: string) {
        const tenants = await Tenant.find({ user_id: userId });

        return tenants.reduce((sum, rent) => sum + rent.monthly_rent, 0);
    }



    // Get total  dues

    public async getTotalDues(userId: string) {
        const rents = await Rent.find({ user_id: userId });
        return rents.reduce((sum, rent) => sum + rent.dues, 0);
    }
    
    // Get total expnses
    public async getTotalExpenses(userId: string) {
        const expenses = await Expense.find({ user_id: userId });
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
}
