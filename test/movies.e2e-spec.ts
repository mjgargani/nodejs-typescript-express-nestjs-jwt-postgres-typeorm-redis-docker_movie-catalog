import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configServiceMock } from './mock';
import { User } from '../src/users/entities/user.entity';
import { Movie } from '../src/movies/entities/movie.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let movieId: string;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    configServiceMock();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get(getRepositoryToken(User));
    const movieRepository = moduleFixture.get(getRepositoryToken(Movie));

    const testUser = {
      username: 'test',
      password: 'password',
    };

    const user = userRepository.create({
      ...testUser,
      email: 'default@email.com',
    });
    await userRepository.save(user);

    const movie1 = movieRepository.create({
      title: 'Filme 1',
      description: 'Descrição do Filme 1',
      year: 2001,
      director: 'Diretor 1',
      genre: 'Gênero 1',
    });
    await movieRepository.save(movie1);

    const movie2 = movieRepository.create({
      title: 'Filme 2',
      description: 'Descrição do Filme 2',
      year: 2002,
      director: 'Diretor 2',
      genre: 'Gênero 2',
    });
    await movieRepository.save(movie2);

    authToken = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
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

  it('/movies (GET)', async () => {
    return request(app.getHttpServer())
      .get('/movies')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  it('/movies/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/movies/${movieId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(movieId);
      });
  });

  it('/movies/:id (PATCH)', async () => {
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

  it('/movies/:id (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/movies/${movieId}`)
      .set('authorization', authToken)
      .expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
