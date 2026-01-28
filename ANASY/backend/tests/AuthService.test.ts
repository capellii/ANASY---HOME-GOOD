import { AuthService } from '../src/services/AuthService';

describe('AuthService', () => {
  const service = new AuthService();
  const email = 'test@anasy.com';
  const password = '123456';
  const name = 'Test User';

  it('should register a new user', async () => {
    const user = await service.register(email, password, name);
    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
  });

  it('should not register duplicate email', async () => {
    await expect(service.register(email, password, name)).rejects.toThrow('Email already registered');
  });

  it('should login with correct credentials', async () => {
    const result = await service.login(email, password);
    expect(result.user.email).toBe(email);
    expect(result.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    await expect(service.login(email, 'wrong')).rejects.toThrow('Invalid credentials');
  });
});
