import { Injectable } from '@nestjs/common';
import { Book, BookDocument } from '../interfaces/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from '../interfaces/dto/create_book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(create_book: CreateBookDto): Promise<BookDocument> {
    const book = new this.bookModel(create_book);
    return book.save();
  }

  async findAll(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  async getBook(id: string): Promise<BookDocument> {
    return this.bookModel.findById({ _id: id }).exec();
  }

  async deleteBook(id: string): Promise<BookDocument> {
    return this.bookModel.findOneAndRemove({ _id: id });
  }

  async updateBook(id: string, data: CreateBookDto): Promise<BookDocument> {
    return this.bookModel.findOneAndUpdate({ _id: id }, data);
  }
}
