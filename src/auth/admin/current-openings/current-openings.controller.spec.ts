import { Test, TestingModule } from '@nestjs/testing';
import { CurrentOpeningsController } from './current-openings.controller';

describe('CurrentOpeningsController', () => {
  let controller: CurrentOpeningsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentOpeningsController],
    }).compile();

    controller = module.get<CurrentOpeningsController>(CurrentOpeningsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
