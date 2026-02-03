import { AuthService } from '../src/services/AuthService';

describe('AuthService', () => {
  const service = new AuthService();
  const email = `test_${Date.now()}@anasy.com`;
  const password = '123456';
  const name = 'Test User';
  let registeredUser: { email: string; name: string } | null = null;

  beforeAll(async () => {
    registeredUser = await service.register(email, password, name);
  });

  it('should register a new user', async () => {
    expect(registeredUser?.email).toBe(email);
    expect(registeredUser?.name).toBe(name);
  });

  it('should not register duplicate email', async () => {
    await expect(service.register(email, password, name)).rejects.toThrow('Email already registered');
  });

  it('should login with correct credentials', async () => {
    const result = await service.login(email, password);
    expect(result.user.email).toBe(email);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    await expect(service.login(email, 'wrong')).rejects.toThrow('Invalid credentials');
  });
});
