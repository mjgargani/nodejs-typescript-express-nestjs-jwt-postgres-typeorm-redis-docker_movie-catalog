import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer()).post('/users').send({
      username: 'Usuário Teste',
      password: 'Senha Teste',
      email: 'teste@teste.com',
    });

    userId = response.body.id;
  });

  it('/users/:id (PATCH)', () => {
    const updatedEntry = {
      username: 'Usuário Teste Atualizado',
      password: 'Senha Teste Atualizada',
      email: 'teste.atualizado@teste.com',
    };
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updatedEntry)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe(updatedEntry.username);
        expect(response.body.password).toBe(updatedEntry.password);
        expect(response.body.email).toBe(updatedEntry.email);
      });
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
  });

  it('/users/:id (PATCH)', () => {
    const updatedEntry = {
      username: 'Usuário Teste Atualizado',
      password: 'Senha Teste Atualizada',
      email: 'teste.atualizado@teste.com',
    };
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updatedEntry)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe(updatedEntry.username);
        expect(response.body.password).toBe(updatedEntry.password);
        expect(response.body.email).toBe(updatedEntry.email);
      });
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete(`/users/${userId}`);
    await app.close();
  });
});
