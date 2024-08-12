import { DashboardRepository } from '@/repositories/dashboard_repository';

export class DashboardService {
    private dashboardRepository: DashboardRepository;

    constructor() {
        this.dashboardRepository = new DashboardRepository();
    }

    // Fetches and returns all dashboard data for a specific user
    public async getDashboardData(userId: string) {
        // Fetch total sections by user ID
        const totalSections = await this.dashboardRepository.countTotalSections(userId);

        // Fetch total sections by user ID
        const totalProperties = await this.dashboardRepository.countTotalProperty(userId);

        // Fetch total sections by user ID
        const totalTenants = await this.dashboardRepository.countTotalTenants(userId);

        // Fetch total rented-out sections by user ID
        const rentedOutSections = await this.dashboardRepository.countRentedOutSections(userId);

        // Fetch total rented-out buildings by user ID
        const rentedOutBuildings = await this.dashboardRepository.countRentedOutBuildings(userId);

        // Fetch total empty sections by user ID
        const emptySections = await this.dashboardRepository.countEmptySections(userId);

        // Fetch total empty buildings by user ID
        const emptyBuildings = await this.dashboardRepository.countEmptyBuildings(userId);

        // Fetch total under construction sections by user ID
        const underConstructionSections = await this.dashboardRepository.countUnderConstructionSections(userId);

        // Fetch total under construction buildings by user ID
        const underConstructionBuildings = await this.dashboardRepository.countUnderConstructionBuildings(userId);
        
        //Current Month Monthly total rent
        const totalCurrentMonthRents=await this.dashboardRepository.getCurrentMonthlyRent(userId)
       
      
        // Fetch total dues by user ID
        const totalDues = await this.dashboardRepository.getTotalDues(userId);

        // Fetch total expenses by user ID
        const totalExpenses = await this.dashboardRepository.getTotalExpenses(userId);

        // Return all fetched data in an object
        return {
            totalProperties,
            totalSections,
            totalTenants,
            rentedOutSections,
            rentedOutBuildings,
            emptySections,
            emptyBuildings,
            underConstructionSections,
            underConstructionBuildings,
            totalCurrentMonthRents,
            totalDues,
            totalExpenses
        };
    }
}
