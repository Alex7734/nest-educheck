import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../services/user.service';
import { AdminService } from '../services/admin.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetUserDto } from '../dto/user/get-user.dto';
import { plainToInstance } from 'class-transformer';
import { Admin } from '../entities/admin.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

const mockQueryBuilder = {
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue({ affected: 1 }),
};

const mockDefaultRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

const mockUserRepository = {
  ...mockDefaultRepository,
};

const mockAdminRepository = {
  ...mockDefaultRepository,
};

const mockRefreshTokenRepository = {
  ...mockDefaultRepository,
};

const mockAdminService = {
  createAdmin: jest.fn(),
  findAllAdmin: jest.fn().mockResolvedValue([]),
  viewAdmin: jest.fn(),
  removeAdmin: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('admin-secret'),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshTokenRepository,
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
      numberOfEnrolledCourses: 0,
      refreshTokens: [],
      enrollments: [],
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
      numberOfEnrolledCourses: 0
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
        numberOfEnrolledCourses: 2,
        refreshTokens: [],
        enrollments: [],
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'test2@test.com',
        password: 'password',
        age: 25,
        numberOfEnrolledCourses: 1,
        refreshTokens: [],
        enrollments: [],
      },
    ];
    jest.spyOn(service, 'findAllUser').mockResolvedValue(users);
    mockAdminService.findAllAdmin.mockResolvedValue([]);

    const result = await controller.findAll();
    const expected = users.map(user => plainToInstance(GetUserDto, user));
    expect(result).toEqual(expected);
  });

  it('should find a user by id', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password',
      age: 30,
      numberOfEnrolledCourses: 3,
      refreshTokens: [],
      enrollments: [],
    };
    jest.spyOn(service, 'viewUser').mockImplementation(async () => user);

    const result = await controller.findOne('1');
    expect(result).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      numberOfEnrolledCourses: user.numberOfEnrolledCourses
    });
  });

  it('should update a user by id', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'newEmail@email.com',
      password: 'password',
      age: 30,
      numberOfEnrolledCourses: 1,
      refreshTokens: [],
      enrollments: [],
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
      numberOfEnrolledCourses: user.numberOfEnrolledCourses
    });
  });

  it('should handle user not found when updating enrollment count', async () => {
    const mockFailedQueryBuilder = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 0 }),
    };

    mockUserRepository.createQueryBuilder.mockReturnValue(mockFailedQueryBuilder);

    const updatePromise = service.updateEnrollmentCount('non-existent-id', 1);

    await expect(updatePromise).rejects.toThrow('User not found');
  });

  it('should update enrollment count successfully', async () => {
    const mockSuccessQueryBuilder = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockUserRepository.createQueryBuilder.mockReturnValue(mockSuccessQueryBuilder);

    await service.updateEnrollmentCount('1', 1);

    expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockSuccessQueryBuilder.update).toHaveBeenCalledWith(User);
    expect(mockSuccessQueryBuilder.set).toHaveBeenCalledWith({
      numberOfEnrolledCourses: expect.any(Function)
    });
    expect(mockSuccessQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id: '1' });
    expect(mockSuccessQueryBuilder.execute).toHaveBeenCalled();
  });
});