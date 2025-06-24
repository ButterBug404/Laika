import request from 'supertest';
import {app} from '../src/app.js';
import {jest} from '@jest/globals'

// Mock your DB and utils modules
jest.unstable_mockModule('../controllers/database.js', () => ({
  insertUser: jest.fn(),
  retrieveUser: jest.fn(),
}));

jest.unstable_mockModule('../utils/passwordUtils.js', () => ({
  hashPassword: jest.fn((pw) => `hashed_${pw}`),
  verifyPassword: jest.fn(),
}));

jest.unstable_mockModule('../utils/jwt.js', () => ({
  generateToken: jest.fn(() => ['fake.token.value', 'key123']),
}));

import { insertUser, retrieveUser } from '../controllers/database.js';
import { verifyPassword } from '../utils/passwordUtils.js';

describe('Auth Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      insertUser.mockResolvedValueOnce({ insertId: 1 });

      const res = await request(app).post('/register').send({
        username: 'testuser',
        password: 'pass123',
        email: 'test@example.com',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: "User registration was successful" });
    });

    it('should fail if user not inserted', async () => {
      insertUser.mockResolvedValueOnce({});

      const res = await request(app).post('/register').send({
        username: 'testuser',
        password: 'pass123',
        email: 'test@example.com',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ failure: "Something went wrong when registering a new user" });
    });
  });

  describe('POST /login', () => {
    it('should login successfully with correct credentials', async () => {
      retrieveUser.mockResolvedValueOnce([{ password: 'hashed_pass123' }]);
      verifyPassword.mockResolvedValueOnce(true);

      const res = await request(app).post('/login').send({
        email: 'test@example.com',
        password: 'pass123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ token: 'fake.token.value', key: 'key123' });
    });

    it('should fail on incorrect email', async () => {
      retrieveUser.mockResolvedValueOnce(null);

      const res = await request(app).post('/login').send({
        email: 'nonexistent@example.com',
        password: 'irrelevant',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ failure: "Incorrect email" });
    });

    it('should fail on incorrect password', async () => {
      retrieveUser.mockResolvedValueOnce([{ password: 'hashed_pass123' }]);
      verifyPassword.mockResolvedValueOnce(false);

      const res = await request(app).post('/login').send({
        email: 'test@example.com',
        password: 'wrongpass',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ failure: "Incorrect password" });
    });
  });

});

