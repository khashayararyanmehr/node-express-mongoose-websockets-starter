const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { moduleOne, moduleTwo, insertModules } = require('../fixtures/module.fixture');
const { complexOne, complexTwo, insertComplexes } = require('../fixtures/complex.fixture');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Module routes', () => {
  describe('POST /modules', () => {
    let newModule;

    beforeEach(() => {
      newModule = {
        code: '0',
        complex: complexTwo._id,
        district: faker.commerce.department(),
        serialNumber: '123-33-123',
        wifiMacAddress: '123:22:222',
        lanMacAddress: '123:22:222',
        owner: userTwo._id,
      };
    });

    test('should return 201 and successfully create new module if data is ok', async () => {
      await insertUsers([userOne, admin]);

      const res = await request(app)
        .post('/modules')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newModule)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        _id: expect.anything(),
        __v: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        elevators: [],
        floorNames: [],
        isSetup: false,
        lastSeenAt: null,
        code: '0',
        complex: complexTwo._id.toString(),
        district: newModule.district,
        serialNumber: '123-33-123',
        wifiMacAddress: '123:22:222',
        lanMacAddress: '123:22:222',
        owner: userTwo._id.toString(),
      });
    });

    test('should return 401 error is access token is missing', async () => {
      await request(app)
        .post('/modules')
        .send(newModule)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/modules')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newModule)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if owner does not exist', async () => {
      await insertUsers([admin]);
      newModule.owner = 'invalid-owner';

      await request(app)
        .post('/modules')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newModule)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /modules', () => {
    test('should return 200 and all modules', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertComplexes([complexOne, complexTwo]);
      await insertModules([moduleOne, moduleTwo]);

      const res = await request(app)
        .get('/modules')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toEqual({
        id: moduleOne._id.toHexString(),
        _id: moduleOne._id.toHexString(),
        __v: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        elevators: [],
        floorNames: [],
        isSetup: false,
        lastSeenAt: null,
        code: moduleOne.code,
        complex: moduleOne.complex.toString(),
        district: moduleOne.district,
        serialNumber: moduleOne.serialNumber,
        wifiMacAddress: moduleOne.wifiMacAddress,
        lanMacAddress: moduleOne.lanMacAddress,
        owner: moduleOne.owner.toString(),
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertModules([moduleOne, moduleTwo]);
      await request(app)
        .get('/modules')
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all modules', async () => {
      await insertUsers([userOne]);
      await insertComplexes([complexOne, complexTwo]);
      await insertModules([moduleOne, moduleTwo]);

      await request(app)
        .get('/modules')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertModules([moduleOne, moduleTwo]);

      const res = await request(app)
        .get('/modules')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ code: moduleOne.code })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(moduleOne._id.toHexString());
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertModules([moduleOne, moduleTwo]);

      const res = await request(app)
        .get('/modules')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'code:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(2);
      expect(res.body[0].id).toBe(moduleTwo._id.toHexString());
    });

    test('should correctly sort returned array if ascending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertModules([moduleOne, moduleTwo]);

      const res = await request(app)
        .get('/modules')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'code:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(2);
      expect(res.body[0].id).toBe(moduleOne._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertModules([moduleOne, moduleTwo]);

      const res = await request(app)
        .get('/modules')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(1);
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([admin]);
      await insertModules([moduleOne, moduleTwo]);

      const res = await request(app)
        .get('/modules')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 2, limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(moduleTwo._id.toHexString());
    });
  });

  describe('GET /modules/:moduleId', () => {
    test('should return 200 and the module object if admin is trying to get a module and data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertModules([moduleOne]);

      const res = await request(app)
        .get(`/modules/${moduleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: moduleOne._id.toHexString(),
        _id: moduleOne._id.toHexString(),
        __v: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        elevators: [],
        floorNames: [],
        isSetup: false,
        lastSeenAt: null,
        code: moduleOne.code,
        complex: moduleOne.complex.toString(),
        district: moduleOne.district,
        serialNumber: moduleOne.serialNumber,
        wifiMacAddress: moduleOne.wifiMacAddress,
        lanMacAddress: moduleOne.lanMacAddress,
        owner: moduleOne.owner.toString(),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertModules([moduleOne]);

      await request(app)
        .get(`/modules/${moduleOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to get a non-owned module', async () => {
      await insertUsers([userOne]);
      await insertModules([moduleOne, moduleTwo]);

      await request(app)
        .get(`/modules/${moduleTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and the module object if user is trying to get owned module', async () => {
      await insertUsers([userOne]);
      await insertModules([moduleOne]);

      const res = await request(app)
        .get(`/modules/${moduleOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);
      expect(res.body).toEqual({
        id: moduleOne._id.toHexString(),
        _id: moduleOne._id.toHexString(),
        __v: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        elevators: [],
        floorNames: [],
        isSetup: false,
        lastSeenAt: null,
        code: moduleOne.code,
        complex: moduleOne.complex.toString(),
        district: moduleOne.district,
        serialNumber: moduleOne.serialNumber,
        wifiMacAddress: moduleOne.wifiMacAddress,
        lanMacAddress: moduleOne.lanMacAddress,
        owner: moduleOne.owner.toString(),
      });
    });

    test('should return 400 error if moduleId is not a valid mongo id', async () => {
      await insertUsers([admin]);

      await request(app)
        .get('/modules/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if module is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .get(`/modules/${moduleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /modules/:moduleId', () => {
    test('should return 401 error if access token is missing', async () => {
      await insertModules([moduleOne]);

      await request(app)
        .delete(`/modules/${moduleOne._id}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user is trying to delete a module', async () => {
      await insertUsers([userOne]);
      await insertModules([moduleOne, moduleTwo]);

      await request(app)
        .delete(`/modules/${moduleTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if admin is trying to delete a module', async () => {
      await insertUsers([admin]);
      await insertModules([moduleOne]);

      await request(app)
        .delete(`/modules/${moduleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if moduleId is not a valid mongo id', async () => {
      await insertUsers([admin]);

      await request(app)
        .delete('/modules/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if module already is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .delete(`/modules/${moduleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /modules/:moduleId', () => {
    test('should return 401 error if access token is missing', async () => {
      await insertModules([moduleOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/modules/${moduleOne._id}`)
        .send(updateBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating a module', async () => {
      await insertUsers([userOne]);
      await insertModules([moduleOne, moduleTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/modules/${moduleTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 200 and successfully update module if admin is updating a module', async () => {
      await insertUsers([admin]);
      await insertModules([moduleOne]);
      const updateBody = { district: faker.commerce.department() };

      await request(app)
        .patch(`/modules/${moduleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 404 if admin is updating a module that is not found', async () => {
      await insertUsers([admin]);
      const updateBody = { district: faker.commerce.department() };

      await request(app)
        .patch(`/modules/${moduleOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if moduleId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/modules/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
