import { User } from '../entities/user.entity';
import { UserDto } from '../dto/output-user.dto';

export function toUserDto(user: User): UserDto {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organizationId: user.organizationId,
        dateCreated: user.dateCreated.toISOString(),
    };
}
