import { ReportRepository } from "@/repositories/report_repository";

export class ReportService {
    private reportRepository: ReportRepository;

    constructor() {
        this.reportRepository = new ReportRepository();
    }
    /*
    Our generated report will include:
      1. leased amount 2. maintenance cost 
      3. other expenses 4. avg no of rooms rented 
      5. avg no of rooms remained empty 
      6. revenue generated 7. profit/loss
      BY Monthly or Yearly
    */

    async generateReportByMonthlyOrYearly(propertyNo: string, userId: string, period: 'monthly' | 'yearly', year: number, month?: number) {
        return await this.reportRepository.generateReportByPropertyNO(propertyNo, userId, period, year, month);
    }
}
