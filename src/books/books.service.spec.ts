import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BooksService } from '../books/books.service';
import { Book } from '../interfaces/book.schema';
import { CreateBookDto } from '../books/dto/create_book.dto';

describe('BookService', () => {
  let service: BooksService;
  const books: Partial<Book>[] = [
    {
      id: '1',
      title: 'Book',
      description: 'Description',
      authors: 'xxx',
      favorite: '1',
      fileCover: 'pic',
      fileName: 'test',
      fileBook: 'test',
    },
    {
      id: '2',
      title: 'New Book',
      description: 'Book Description',
      authors: 'zzz',
      favorite: '2',
      fileCover: 'pic',
      fileName: 'test',
      fileBook: 'test',
    },
  ];

  const exec = { exec: jest.fn() };
  const create = jest.fn();
  const findOneAndUpdate = jest.fn();
  const findOneAndRemove = jest.fn();

  const booksRepositoryFactory = () => ({
    find: () => exec,
    findById: () => exec,
    create,
    findOneAndUpdate,
    findOneAndRemove,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          useFactory: booksRepositoryFactory,
          provide: getModelToken(Book.name),
        },
      ],
    }).compile();

    service = await module.resolve<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find Book Id', async () => {
    const id = new Types.ObjectId().toHexString();
    booksRepositoryFactory()
      .findById()
      .exec.mockReturnValueOnce([{ id: id }]);
    const res = await service.getBook(id);
    expect(res[0].id).toEqual(id);
  });

  it('find All Books', async () => {
    booksRepositoryFactory().find().exec.mockReturnValueOnce(books);
    const res = await service.findAll();
    expect(res).toEqual(books);
  });

  it('creating book', async () => {
    booksRepositoryFactory().create.mockReturnValueOnce(books);
    const res = await service.create(books[0] as CreateBookDto);
    expect(res).toEqual(books[0]);
  });
  it('updating book', async () => {
    booksRepositoryFactory().findOneAndUpdate.mockReturnValueOnce([
      books[1],
      books[1],
    ]);
    const res = await service.updateBook('0', books[1] as CreateBookDto);
    expect(res).toEqual([books[1], books[1]]);
  });

  it('deleting book', async () => {
    booksRepositoryFactory().findOneAndRemove.mockReturnValueOnce([books[1]]);
    const res = await service.deleteBook('0');
    expect(res).toEqual([books[1]]);
  });
});
