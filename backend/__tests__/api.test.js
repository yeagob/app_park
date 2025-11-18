const request = require('supertest');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Import routes
const authRouter = require('../routes/auth');
const parksRouter = require('../routes/parks');
const commentsRouter = require('../routes/comments');
const photosRouter = require('../routes/photos');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/parks', parksRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/photos', photosRouter);

// Test data directory
const TEST_DATA_DIR = path.join(__dirname, '../data');

describe('Parks Social Network API Tests', () => {
  let authToken;
  let testParkId;
  let testCommentId;
  const testEmail = 'test@example.com';

  // Cleanup before and after all tests
  beforeAll(async () => {
    // Create data directory if it doesn't exist
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
    await fs.mkdir(path.join(TEST_DATA_DIR, 'parks'), { recursive: true });
    await fs.mkdir(path.join(TEST_DATA_DIR, 'comments'), { recursive: true });
    await fs.mkdir(path.join(TEST_DATA_DIR, 'photos'), { recursive: true });

    // Create index.json
    await fs.writeFile(
      path.join(TEST_DATA_DIR, 'index.json'),
      JSON.stringify({ parks: [], lastId: 0 }, null, 2)
    );
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  });

  // ========== AUTHENTICATION TESTS ==========
  describe('Authentication', () => {
    test('POST /api/auth/login - Should login with email and get token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('token');
      expect(response.body.user.email).toBe(testEmail);

      // Save token for future tests
      authToken = response.body.user.token;
    });

    test('POST /api/auth/login - Should fail without email', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
    });

    test('POST /api/auth/login - Should fail with invalid email', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid-email' })
        .expect(400);
    });

    test('GET /api/auth/verify - Should verify valid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.user.email).toBe(testEmail);
    });

    test('GET /api/auth/verify - Should fail without token', async () => {
      await request(app)
        .get('/api/auth/verify')
        .expect(401);
    });

    test('GET /api/auth/verify - Should fail with invalid token', async () => {
      await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  // ========== PARKS TESTS ==========
  describe('Parks', () => {
    test('GET /api/parks - Should get empty list initially', async () => {
      const response = await request(app)
        .get('/api/parks')
        .expect(200);

      expect(response.body).toHaveProperty('parks');
      expect(response.body.parks).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    test('POST /api/parks - Should create a new park with authentication', async () => {
      const parkData = {
        name: 'Test Park',
        location: {
          address: 'Test Address 123',
          coordinates: { lat: 40.4168, lng: -3.7038 },
          city: 'Madrid',
          country: 'España'
        },
        elements: {
          swings: true,
          slides: true,
          sandbox: false
        },
        amenities: {
          water_fountain: true,
          restrooms: false,
          parking: true
        },
        policies: {
          dogs_allowed: true
        },
        surface: 'rubber',
        condition: 'excellent'
      };

      const response = await request(app)
        .post('/api/parks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(parkData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Park');
      expect(response.body.created_by).toBe(testEmail);

      testParkId = response.body.id;
    });

    test('POST /api/parks - Should fail without authentication', async () => {
      const parkData = {
        name: 'Test Park 2',
        location: {
          address: 'Test Address 456',
          coordinates: { lat: 40.4168, lng: -3.7038 },
          city: 'Madrid',
          country: 'España'
        }
      };

      await request(app)
        .post('/api/parks')
        .send(parkData)
        .expect(401);
    });

    test('GET /api/parks - Should get list with one park', async () => {
      const response = await request(app)
        .get('/api/parks')
        .expect(200);

      expect(response.body.parks.length).toBe(1);
      expect(response.body.total).toBe(1);
      expect(response.body.parks[0].name).toBe('Test Park');
    });

    test('GET /api/parks/:id - Should get specific park', async () => {
      const response = await request(app)
        .get(`/api/parks/${testParkId}`)
        .expect(200);

      expect(response.body.id).toBe(testParkId);
      expect(response.body.name).toBe('Test Park');
    });

    test('GET /api/parks - Should filter by elements', async () => {
      const response = await request(app)
        .get('/api/parks?elements=swings,slides')
        .expect(200);

      expect(response.body.parks.length).toBe(1);
    });

    test('GET /api/parks - Should filter by amenities', async () => {
      const response = await request(app)
        .get('/api/parks?amenities=water_fountain,parking')
        .expect(200);

      expect(response.body.parks.length).toBe(1);
    });

    test('GET /api/parks - Should search by name', async () => {
      const response = await request(app)
        .get('/api/parks?search=Test')
        .expect(200);

      expect(response.body.parks.length).toBe(1);
    });

    test('POST /api/parks/:id/rate - Should rate a park', async () => {
      const response = await request(app)
        .post(`/api/parks/${testParkId}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ rating: 5 })
        .expect(200);

      expect(response.body.rating.average).toBe(5);
      expect(response.body.rating.count).toBe(1);
    });

    test('POST /api/parks/:id/rate - Should fail with invalid rating', async () => {
      await request(app)
        .post(`/api/parks/${testParkId}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ rating: 6 })
        .expect(400);
    });

    test('PUT /api/parks/:id - Should update park with authentication', async () => {
      const response = await request(app)
        .put(`/api/parks/${testParkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Test Park' })
        .expect(200);

      expect(response.body.name).toBe('Updated Test Park');
    });

    test('PUT /api/parks/:id - Should fail without authentication', async () => {
      await request(app)
        .put(`/api/parks/${testParkId}`)
        .send({ name: 'Should Fail' })
        .expect(401);
    });
  });

  // ========== COMMENTS TESTS ==========
  describe('Comments', () => {
    test('GET /api/comments/:parkId - Should get empty comments initially', async () => {
      const response = await request(app)
        .get(`/api/comments/${testParkId}`)
        .expect(200);

      expect(response.body.comments).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    test('POST /api/comments/:parkId - Should add comment with authentication', async () => {
      const response = await request(app)
        .post(`/api/comments/${testParkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          author: 'Test User',
          text: 'Great park!',
          rating: 5
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.text).toBe('Great park!');
      expect(response.body.likes).toBe(0);

      testCommentId = response.body.id;
    });

    test('POST /api/comments/:parkId - Should fail without authentication', async () => {
      await request(app)
        .post(`/api/comments/${testParkId}`)
        .send({
          author: 'Test User',
          text: 'Should fail'
        })
        .expect(401);
    });

    test('GET /api/comments/:parkId - Should get one comment', async () => {
      const response = await request(app)
        .get(`/api/comments/${testParkId}`)
        .expect(200);

      expect(response.body.comments.length).toBe(1);
      expect(response.body.total).toBe(1);
    });

    test('POST /api/comments/:parkId/:commentId/like - Should like comment', async () => {
      const response = await request(app)
        .post(`/api/comments/${testParkId}/${testCommentId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.likes).toBe(1);
    });

    test('POST /api/comments/:parkId/:commentId/unlike - Should unlike comment', async () => {
      const response = await request(app)
        .post(`/api/comments/${testParkId}/${testCommentId}/unlike`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.likes).toBe(0);
    });

    test('PUT /api/comments/:parkId/:commentId - Should update comment', async () => {
      const response = await request(app)
        .put(`/api/comments/${testParkId}/${testCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Updated comment' })
        .expect(200);

      expect(response.body.text).toBe('Updated comment');
    });

    test('DELETE /api/comments/:parkId/:commentId - Should delete comment', async () => {
      await request(app)
        .delete(`/api/comments/${testParkId}/${testCommentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify deletion
      const response = await request(app)
        .get(`/api/comments/${testParkId}`)
        .expect(200);

      expect(response.body.comments.length).toBe(0);
    });
  });

  // ========== GEOLOCATION TESTS ==========
  describe('Geolocation', () => {
    test('GET /api/parks - Should filter by proximity', async () => {
      const response = await request(app)
        .get('/api/parks?lat=40.4168&lng=-3.7038&radius=10')
        .expect(200);

      expect(response.body).toHaveProperty('parks');
      if (response.body.parks.length > 0) {
        expect(response.body.parks[0]).toHaveProperty('distance');
      }
    });

    test('GET /api/parks - Should sort by distance', async () => {
      const response = await request(app)
        .get('/api/parks?lat=40.4168&lng=-3.7038')
        .expect(200);

      if (response.body.parks.length > 0) {
        expect(response.body.parks[0]).toHaveProperty('distance');
      }
    });
  });

  // ========== CLEANUP TEST ==========
  describe('Cleanup', () => {
    test('DELETE /api/parks/:id - Should delete park', async () => {
      await request(app)
        .delete(`/api/parks/${testParkId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify deletion
      const response = await request(app)
        .get('/api/parks')
        .expect(200);

      expect(response.body.parks.length).toBe(0);
    });

    test('DELETE /api/parks/:id - Should fail without authentication', async () => {
      await request(app)
        .delete(`/api/parks/${testParkId}`)
        .expect(401);
    });
  });
});
