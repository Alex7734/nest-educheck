import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { Web3UserService } from './services/web3user.service';
import { AdminService } from './services/admin.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/user/create-user.dto';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockDefaultRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  ...mockDefaultRepository,
};

const mockAdminRepository = {
  ...mockDefaultRepository,
};

const mockWeb3UserRepository = {
  ...mockDefaultRepository,
};

const mockRefreshTokenRepository = {
  ...mockDefaultRepository,
};

const mockWeb3UserService = {
  createWeb3User: jest.fn(),
  findAllWeb3User: () =>[],
  viewWeb3User: jest.fn(),
  updateWeb3User: jest.fn(),
  removeWeb3User: jest.fn(),
};

const mockAdminService = {
  createAdmin: jest.fn(),
  findAllAdmin: jest.fn(),
  viewAdmin: jest.fn(),
  removeAdmin: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('admin-secret'),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: 'AdminRepository',
          useValue: mockAdminRepository,
        },
        {
          provide: 'Web3UserRepository',
          useValue: mockWeb3UserRepository,
        },
        {
          provide: 'RefreshTokenRepository',
          useValue: mockRefreshTokenRepository,
        },
        {
          provide: Web3UserService,
          useValue: mockWeb3UserService,
        },
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password',
      age: 30,
      refreshTokens: [],
    };
    jest.spyOn(service, 'createUser').mockImplementation(async () => user);

    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password',
      age: 30,
    };

    expect(await controller.create(createUserDto)).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    });
  });

  it('should find all users', async () => {
    const users: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'test@test.com',
        password: 'password',
        age: 30,
        refreshTokens: [],
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'test@test.com',
        password: 'password',
        age: 25,
        refreshTokens: [],
      },
    ];
    jest.spyOn(service, 'findAllUser').mockImplementation(async () => users);

    const result = await controller.findAll();
    expect(result).toEqual(
      users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      password: user.password,
      refreshTokens: user.refreshTokens,
      }))
    );
  });

  it('should find a user by id', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password',
      age: 30,
      refreshTokens: [],
    };
    jest.spyOn(service, 'viewUser').mockImplementation(async () => user);

    const result = await controller.findOne('1');
    expect(result).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    });
  });

  it('should update a user by id', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'newEmail@email.com',
      password: 'password',
      age: 30,
      refreshTokens: [],
    };
    jest.spyOn(service, 'updateUser').mockImplementation(async () => user);

    const updateUserDto = {
      name: 'John Doe',
      email: 'newEmail@email.com',
      password: 'password',
      age: 30,
    };

    expect(await controller.update('1', updateUserDto)).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    });
  });
});