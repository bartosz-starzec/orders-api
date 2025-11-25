import { Organization } from '../entities/organization.entity';
import { OrganizationDto } from '../dto/output-organization.dto';
import dayjs from 'dayjs';

export function toOrganizationDto(org: Organization): OrganizationDto {
    return {
        id: org.id,
        name: org.name,
        industry: org.industry,
        dateFounded: dayjs(org.dateFounded).format('YYYY-MM-DD'),
    };
}
