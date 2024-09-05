import LogsRepository from '../repositories/tenant_history_repository';

class TenantHistoryService {
  async getTenantHistoryByPassportNo(passportNo: string, userId: string) {
    return await LogsRepository.getTenantLogsByPassportNo(passportNo, userId);
  }
}

export default new TenantHistoryService();
