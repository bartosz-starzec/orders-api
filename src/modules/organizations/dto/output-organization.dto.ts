import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    industry: string;

    @ApiProperty({ type: String, format: 'date-time' })
    dateFounded: string;
}
