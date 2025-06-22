import { PartialType } from '@nestjs/swagger';
import { CreateUserDbDto } from './create-user-db.dto';

export class UpdateUserDbDto extends PartialType(CreateUserDbDto) {}
