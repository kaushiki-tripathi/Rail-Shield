import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';

describe('Auth middleware', () => {
  it('rejects requests without token', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toBe(401);
  });

  it('rejects invalid token', async () => {
    const res = await request(app).get('/api/reports').set('Authorization', 'Bearer invalid.token');
    expect(res.status).toBe(401);
  });

  it('allows valid admin token', async () => {
    const payload = { id: '1', name: 'Admin', role: 'Admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'testsecret');
    const res = await request(app).get('/api/reports').set('Authorization', `Bearer ${token}`);
    // The route will attempt to access DB; since DB not connected, expect 500 or 200 depending on mocking.
    // We mainly assert that middleware does not return 401/403.
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});
