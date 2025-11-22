import { ApiProperty } from '@nestjs/swagger';

export class OrderUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;
}

export class OrderOrganizationDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    industry: string;
}

export class OrderDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ type: String, format: 'date-time' })
    orderDate: string;

    @ApiProperty()
    totalAmount: number;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty({ type: () => OrderUserDto, required: false })
    user?: OrderUserDto;

    @ApiProperty({ type: () => OrderOrganizationDto, required: false })
    organization?: OrderOrganizationDto;
}
