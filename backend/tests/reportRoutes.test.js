import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';

// Mock EmergencyReport model methods used by reportRoutes
import * as EmergencyModel from '../models/EmergencyReport.js';

describe('Report routes', () => {
  const adminToken = jwt.sign({ id: '1', name: 'Admin', role: 'Admin' }, process.env.JWT_SECRET || 'testsecret');

  beforeAll(() => {
    vi.spyOn(EmergencyModel, 'default', 'get').mockReturnValue({
      find: () => ({ sort: () => Promise.resolve([]) }),
      findById: () => Promise.resolve(null),
      findByIdAndUpdate: () => Promise.resolve({}),
      prototype: {},
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/reports (admin) should not return 401', async () => {
    const res = await request(app).get('/api/reports').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).not.toBe(401);
  });

  it('POST /api/reports should validate input', async () => {
    const res = await request(app).post('/api/reports').send({});
    expect(res.status).toBe(400);
  });
});
