import LogsRepository from '../repositories/property_history_repository';

class PropertyHistoryService {
  async getPropertyHistory(propertyNo: string, userId: string) {
    return await LogsRepository.getLogsByPropertyNo(propertyNo, userId);
  }
}

export default new PropertyHistoryService();
