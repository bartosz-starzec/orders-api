import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResult<T> {
    @ApiProperty()
    data: T[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;
}
