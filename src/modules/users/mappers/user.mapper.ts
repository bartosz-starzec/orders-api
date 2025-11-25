import { User } from '../entities/user.entity';
import { UserDto } from '../dto/output-user.dto';
import dayjs from 'dayjs';

export function toUserDto(user: User): UserDto {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organizationId: user.organizationId,
        dateCreated: dayjs(user.dateCreated).format('YYYY-MM-DD HH:mm:ss'),
    };
}
