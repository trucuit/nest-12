import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'user',
  };

  const mockUsersService = {
    findOneByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const password = 'testPassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      mockUsersService.findOneByUsername.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const result = await service.validateUser('testuser', password);
      const { password: _, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should return null when credentials are invalid', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockUser);
      const result = await service.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate JWT token', async () => {
      const mockToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const { password, ...userWithoutPassword } = mockUser;
      const result = await service.login(userWithoutPassword);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });
  });

  describe('register', () => {
    it('should create new user with hashed password', async () => {
      const createUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        ...createUserDto,
        id: '2',
        password: hashedPassword,
      };

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await service.register(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createUserDto,
          password: expect.any(String),
        }),
      );

      const { password, ...expectedResult } = createdUser;
      expect(result).toEqual(expectedResult);
    });
  });
});
