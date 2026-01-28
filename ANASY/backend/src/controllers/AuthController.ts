import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  public async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  public async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const user = await this.authService.register(email, password, name);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
