import { Organization } from '../entities/organization.entity';
import { OrganizationDto } from '../dto/output-organization.dto';

export function toOrganizationDto(org: Organization): OrganizationDto {
    return {
        id: org.id,
        name: org.name,
        industry: org.industry,
        dateFounded: org.dateFounded.toString(),
    };
}
