import { Module } from '@nestjs/common';
import { BookController } from '../books/books.controller';
import { BooksService } from '../books/books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '../interfaces/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
