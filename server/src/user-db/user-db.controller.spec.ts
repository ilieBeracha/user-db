import { Test, TestingModule } from '@nestjs/testing';
import { UserDbController } from './user-db.controller';
import { UserDbService } from './user-db.service';

describe('UserDbController', () => {
  let controller: UserDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDbController],
      providers: [UserDbService],
    }).compile();

    controller = module.get<UserDbController>(UserDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
