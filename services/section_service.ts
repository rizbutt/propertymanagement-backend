import SectionRepository from '@/repositories/section_repository';
import PropertyModel from '@/models/property_model';  // Assuming this model exists
import { ISection } from '@/types/models_types/section_types';

class SectionService {
    private sectionRepository: SectionRepository;

    constructor() {
        this.sectionRepository = new SectionRepository();
    }

    /**
     * Create a new section by redistributing resources from existing sections or generating a second section if none exist.
     * @param {ISection} sectionData - The section data to be created.
     * @returns {Promise<ISection>} - The created section.
     */
    async createAndDistributeSection(sectionData: ISection): Promise<ISection> {
        if (!sectionData) {
            throw new Error('Section data must be provided');
        }

        // Retrieve property details to validate sectionData
        const property = await PropertyModel.findOne({ propertyNo: sectionData.property_no });

        if (!property) throw new Error('Property not found');
        if (!property.buildingDetails) throw new Error('Building details not found for the property');

        // Fetch all existing sections within the property
        const existingSections = await this.sectionRepository.getSectionsByPropertyNo(sectionData.property_no);

        const totalResources = {
            rooms: property.buildingDetails.rooms,
            kitchens: property.buildingDetails.kitchens,
            bathrooms: property.buildingDetails.bathrooms,
            lobbies: property.buildingDetails.lobbies
        };

        if (existingSections.length === 0) {
            // No existing sections, create the main section and automatically generate a second section

            const createdSection = await this.sectionRepository.createSection(sectionData);

            // Calculate remaining details for auto section creation
            const remainingDetails = {
                rooms: totalResources.rooms - sectionData.rooms,
                kitchens: totalResources.kitchens - sectionData.kitchens,
                bathrooms: totalResources.bathrooms - sectionData.bathrooms,
                lobbies: totalResources.lobbies - sectionData.lobbies,
            };

            // Automatically create a new section with remaining details if applicable
            if (remainingDetails.rooms > 0 || remainingDetails.kitchens > 0 || 
                remainingDetails.bathrooms > 0 || remainingDetails.lobbies > 0) {
                
                const autoSectionName = `Section ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000)}`;

                await this.sectionRepository.createSection({
                    property_no: sectionData.property_no,
                    sectionName: autoSectionName,
                    sectionType: 'Shared',
                    rooms: remainingDetails.rooms > 0 ? remainingDetails.rooms : 1, // Ensure at least 1 room
                    kitchens: remainingDetails.kitchens,
                    bathrooms: remainingDetails.bathrooms,
                    lobbies: remainingDetails.lobbies,
                    user_id: sectionData.user_id,
                } as ISection);
            }

            return createdSection;

        } else {
            // Redistribute resources from existing sections

            let remainingResources = {
                rooms: sectionData.rooms,
                kitchens: sectionData.kitchens,
                bathrooms: sectionData.bathrooms,
                lobbies: sectionData.lobbies
            };

            for (let section of existingSections) {
                if (remainingResources.rooms > 0 && section.rooms > 0) {
                    const diff = Math.min(section.rooms - 1, remainingResources.rooms); // Ensure at least 1 room remains
                    section.rooms -= diff;
                    remainingResources.rooms -= diff;
                }
                if (remainingResources.kitchens > 0 && section.kitchens > 0) {
                    const diff = Math.min(section.kitchens, remainingResources.kitchens);
                    section.kitchens -= diff;
                    remainingResources.kitchens -= diff;
                }
                if (remainingResources.bathrooms > 0 && section.bathrooms > 0) {
                    const diff = Math.min(section.bathrooms, remainingResources.bathrooms);
                    section.bathrooms -= diff;
                    remainingResources.bathrooms -= diff;
                }
                if (remainingResources.lobbies > 0 && section.lobbies > 0) {
                    const diff = Math.min(section.lobbies, remainingResources.lobbies);
                    section.lobbies -= diff;
                    remainingResources.lobbies -= diff;
                }

                // Save the updated section
                await this.sectionRepository.updateSection(section.id, section);

                if (remainingResources.rooms === 0 && remainingResources.kitchens === 0 &&
                    remainingResources.bathrooms === 0 && remainingResources.lobbies === 0) {
                    break;
                }
            }

            // If there's still a resource left, it means the distribution wasn't possible
            if (remainingResources.rooms > 0 || remainingResources.kitchens > 0 ||
                remainingResources.bathrooms > 0 || remainingResources.lobbies > 0) {
                throw new Error('Not enough resources available for the new section');
            }

            // Create the new section with the distributed resources
            const createdSection = await this.sectionRepository.createSection(sectionData);

            return createdSection;
        }
    }

    /**
     * Fetch all sections by property number and user ID.
     * @param {string} propertyNo - The property number to fetch sections for.
     * @param {string} userId - The user ID to match sections against.
     * @returns {Promise<ISection[]>} - An array of sections.
     */
    async fetchSectionsByPropertyNo(propertyNo: string, userId: string): Promise<ISection[]> {
        return this.sectionRepository.getSectionsByPropertyNoAndUserId(propertyNo, userId);
    }
}

export default SectionService;
