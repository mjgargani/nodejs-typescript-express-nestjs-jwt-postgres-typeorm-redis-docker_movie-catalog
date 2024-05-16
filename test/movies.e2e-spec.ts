import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { authServiceMock, configServiceMock } from './mock';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let movieId: string;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    configServiceMock();
    authServiceMock();

    app = moduleFixture.createNestApplication();
    await app.init();

    authToken = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'default', password: 'password' })
      .then((response) => response.body.access_token);

    movieId = await request(app.getHttpServer())
      .post('/movies')
      .set('authorization', authToken)
      .send({
        title: 'Filme Teste',
        description: 'Descrição Filme Teste',
        year: 2024,
        director: 'Nome Diretor Teste',
        genre: 'Nome Genero Teste',
      })
      .then((response) => response.body.id);
  });

  it.only('/movies (GET)', () => {
    return request(app.getHttpServer())
      .get('/movies')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  it('/movies/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/movies/${movieId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(movieId);
      });
  });

  it('/movies/:id (PATCH)', () => {
    const updatedEntry = {
      title: 'Filme Teste Atualizado',
      description: 'Descrição Filme Teste Atualizado',
      year: 2022,
      director: 'Nome Diretor Teste Atualizado',
      genre: 'Nome Genero Teste Atualizado',
    };
    return request(app.getHttpServer())
      .patch(`/movies/${movieId}`)
      .set('authorization', authToken)
      .send(updatedEntry)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(updatedEntry.title);
        expect(response.body.description).toBe(updatedEntry.description);
        expect(response.body.year).toBe(updatedEntry.year);
        expect(response.body.director).toBe(updatedEntry.director);
        expect(response.body.genre).toBe(updatedEntry.genre);
      });
  });

  it('/movies/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .set('authorization', authToken)
      .delete(`/movies/${movieId}`)
      .expect(200);
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete(`/movies/${movieId}`);
    await app.close();
  });
});
