import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configServiceMock } from './mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    configServiceMock();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get(getRepositoryToken(User));

    const testUser = {
      username: 'test',
      password: 'password',
    };

    const user = userRepository.create({
      ...testUser,
      email: 'default@email.com',
    });
    await userRepository.save(user);

    authToken = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .then((response) => response.body.access_token);

    userId = await request(app.getHttpServer())
      .post('/users')
      .set('authorization', authToken)
      .send({
        username: 'Usuário Teste',
        password: 'Senha Teste',
        email: 'teste@teste.com',
      })
      .then((response) => response.body.id);
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('authorization', authToken)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);
      });
  });

  it('/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('authorization', authToken)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('Usuário Teste');
        expect(response.body.password).toHaveLength(97);
        expect(response.body.email).toBe('teste@teste.com');
      });
  });

  it('/users/:id (PATCH)', () => {
    const updatedEntry = {
      username: 'Usuário Teste Atualizado',
      password: 'Senha Teste Atualizada',
      email: 'teste.atualizado@teste.com',
    };
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('authorization', authToken)
      .send(updatedEntry)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe(updatedEntry.username);
        expect(response.body.password).toHaveLength(97);
        expect(response.body.email).toBe(updatedEntry.email);
      });
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('authorization', authToken)
      .expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
