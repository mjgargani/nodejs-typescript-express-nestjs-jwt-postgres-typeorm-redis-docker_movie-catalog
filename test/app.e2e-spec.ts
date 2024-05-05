import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let movieId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer()).post('/movies').send({
      title: 'Filme Teste',
      description: 'Descrição Filme Teste',
      year: 2024,
      director: 'Nome Diretor Teste',
      genre: 'Nome Genero Teste',
    });
    movieId = response.body.id;
  });

  it('/movies (GET)', () => {
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
      .delete(`/movies/${movieId}`)
      .expect(200);
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete(`/movies/${movieId}`);
    await app.close();
  });
});
