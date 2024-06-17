import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect, Types } from 'mongoose';
import { Book } from '../src/interfaces/book.schema';
import { BooksService } from '../src/books/books.service';
import { AppModule } from '../src/app.module';

const id = new Types.ObjectId().toHexString();

const book: Partial<Book> = {
  id,
  title: 'Book',
  description: 'Description',
  authors: 'xxx',
  favorite: '1',
};

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  const books = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BooksService)
      .useValue(books)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/books (GET)', () => {
    return request(app.getHttpServer()).get('/books').expect(200);
  });

  it('/books (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/books')
      .send(book)
      .expect(201)
      .expect({
        data: books.findAll(),
      });
  });
  it('/books (POST) - fail', async () => {
    return request(app.getHttpServer()).post('/books').send(book).expect(401);
  });

  it('/books/:id (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/books/' + id)
      .expect(200);
  });

  it('/books/:id (GET) - fail:not found book', async () => {
    return request(app.getHttpServer())
      .get('/books/' + new Types.ObjectId().toHexString())
      .expect(404);
  });

  it('/books/:id (GET) - fail:not valid <id>', async () => {
    return request(app.getHttpServer())
      .get('/books/' + 1)
      .expect(400);
  });

  it('/books/:id (PUT) - success', async () => {
    const updateTitle = 'update Book';
    return await request(app.getHttpServer())
      .put('/books/' + id)
      .send({ ...book, title: updateTitle })
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.title).toBe(book.title);
      });
  });

  it('/books/:id (PUT) - fail', async () => {
    const updateTitle = 'update Book';
    return await request(app.getHttpServer())
      .put('/books/' + id)
      .send({ ...book, title: updateTitle })
      .expect(401);
  });

  it('/books/:id (DELETE) - success', async () => {
    const updateTitle = 'update Book';
    return await request(app.getHttpServer())
      .delete('/books/' + id)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.title).toBe(updateTitle);
      });
  });

  it('/books/:id (DELETE) - fail: not found', async () => {
    return await request(app.getHttpServer())
      .delete('/books/' + id)
      .expect(404);
  });
});
afterAll(() => {
  disconnect();
});
