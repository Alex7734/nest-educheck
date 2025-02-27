import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password',
      age: 30,
    };
    jest.spyOn(service, 'createUser').mockImplementation(async () => user);

    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password',
      age: 30,
    };

    expect(await controller.create(createUserDto)).toBe(user);
  });

  it('should find all users', async () => {
    const users: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'test@test.com',
        password: 'password',
        age: 30,
      },
      {
        id: 2,
        name: 'Jane Doe',
        email:  'test@test.com',
        password: 'password',
        age: 25,
      },
    ];
    jest.spyOn(service, 'findAllUser').mockImplementation(async () => users);

    expect(await controller.findAll()).toBe(users);
  });

  it('should find a user by id', async () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password',
      age: 30,
    };
    jest.spyOn(service, 'viewUser').mockImplementation(async () => user);

    expect(await controller.findOne('1')).toBe(user);
  });

  it('should update a user by id', async () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'newEmail@email.com',
      password: 'password',
      age: 30,
    };
    jest.spyOn(service, 'updateUser').mockImplementation(async () => user);

    expect(await controller.update('1', user)).toBe(user);

    const updateUserDto = {
      name: 'John Doe',
      email: 'newEmail@email.com',
      password: 'password',
      age: 30,
    };

    expect(await controller.update('1', updateUserDto)).toBe(user);
  })

  // TODO: Add test for remove method
  it('should remove a user by id', async () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'newEmail@email.com',
      password: 'password',
      age: 30,
    };

    jest.spyOn(service, 'removeUser').mockImplementation(async () => {});
    
    expect(await controller.remove('1')).toBeUndefined();
  });

});