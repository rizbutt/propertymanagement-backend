import SectionModel from '@/models/section_model';
import { ISection } from '@/types/models_types/section_types';

class SectionRepository {
    /**
     * Create a new section in the database.
     * @param {ISection} sectionData - The section data to be saved.
     * @returns {Promise<ISection>} - The created section document.
     */
    async createSection(sectionData: ISection): Promise<ISection> {
        const section = new SectionModel(sectionData);
        return await section.save();
    }

    /**
     * Get sections by property number.
     * @param {string} propertyNo - The property number to filter sections by.
     * @returns {Promise<ISection[]>} - An array of sections.
     */
    async getSectionsByPropertyNo(propertyNo: string): Promise<ISection[]> {
        return await SectionModel.find({ property_no: propertyNo }).exec();
    }

    /**
     * Get sections by property number and user ID.
     * @param {string} propertyNo - The property number to filter sections by.
     * @param {string} userId - The user ID to filter sections by.
     * @returns {Promise<ISection[]>} - An array of sections.
     */
    async getSectionsByPropertyNoAndUserId(propertyNo: string, userId: string): Promise<ISection[]> {
        return await SectionModel.find({ property_no: propertyNo, user_id: userId }).exec();
    }

    /**
     * Update an existing section in the database.
     * @param {string} sectionId - The ID of the section to update.
     * @param {Partial<ISection>} updatedData - The updated section data.
     * @returns {Promise<ISection | null>} - The updated section document or null if not found.
     */
    async updateSection(sectionId: string, updatedData: Partial<ISection>): Promise<ISection | null> {
        return await SectionModel.findByIdAndUpdate(sectionId, updatedData, { new: true }).exec();
    }
}

export default SectionRepository;
