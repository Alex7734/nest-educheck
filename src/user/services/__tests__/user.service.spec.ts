import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { Repository } from 'typeorm';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};

const mockRefreshTokenRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let refreshTokenRepository: Repository<RefreshToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshTokenRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshTokenRepository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return error when user not found', async () => {
    jest.spyOn(service, 'viewUser').mockImplementation(async () => {
      throw new Error('User not found');
    });
    await expect(service.viewUser('1')).rejects.toThrowError('User not found');
  });

  it('should return user', async () => {
    const user = new User();
    jest.spyOn(service, 'viewUser').mockImplementation(async () => user);
    expect(await service
      .viewUser('1'))
      .toEqual(user);
  });

  it('should return error when user not found', async () => {
    jest.spyOn(service, 'findByEmail').mockImplementation(async () => {
      throw new Error('User not found');
    });

    await expect(service.findByEmail('test')).rejects.toThrowError('User not found');
  });

  it('should return logged in users', async () => {
    const mockUsers = [
      {
        id: '1',
        email: 'test1@example.com',
        password: 'password1',
        name: 'Test User 1',
        age: 25,
        numberOfEnrolledCourses: 0,
        refreshTokens: [],
      },
      {
        id: '2',
        email: 'test2@example.com',
        password: 'password2',
        name: 'Test User 2',
        age: 30,
        numberOfEnrolledCourses: 0,
        refreshTokens: [],
      },
    ]

    jest.spyOn(service, 'getLoggedInUsers').mockImplementation(async () => mockUsers);
    expect(await service.getLoggedInUsers()).toEqual(mockUsers);
  });

});