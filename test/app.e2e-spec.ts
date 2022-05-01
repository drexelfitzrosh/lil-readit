import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma = PrismaService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(8000);
    prisma = app.get(PrismaService);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore;
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:8000');
  });

  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    describe('SignUp', () => {
      it('should sign up', () => {
        const body = {
          email: 'test@example.com',
          password: 'test1234',
          firstName: 'testUser',
          lastName: 'test',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(body)
          .expectStatus(201);
      });
      it('should return error User already exist', () => {
        const body = {
          email: 'test@example.com',
          password: 'test1234',
          firstName: 'testUser',
          lastName: 'test',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(body)
          .expectStatus(403)
          .expectBody({
            statusCode: 403,
            message: 'email already taken',
            error: 'Forbidden',
          });
      });
      it('should return error Invalid email', () => {
        const body = {
          email: 'test@.com',
          password: 'test1234',
          firstName: 'testUser',
          lastName: 'test',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(body)
          .expectStatus(400)
          .expectBody({
            statusCode: 400,
            message: ['email must be an email'],
            error: 'Bad Request',
          });
      });
    });

    describe('login', () => {
      it('should login', () => {
        const body = {
          email: 'test@example.com',
          password: 'test1234',
        };
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(body)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
      it('throw Error User not exist', () => {
        const body = {
          email: 'test12345@example.com',
          password: 'test1234',
        };
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(body)
          .expectStatus(403)
          .expectBody({
            statusCode: 403,
            message: 'Invalid Credentials',
            error: 'Forbidden',
          });
      });
    });
  });

  describe('User', () => {
    it('Get current user with no access_token', () => {
      return pactum.spec().get('/users/me').expectStatus(401);
    });
    it('Get current user with  access_token', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: `Bearer $S{userToken}`,
        })
        .expectStatus(200);
    });
  });
});
