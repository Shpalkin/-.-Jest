import { Book } from '../../interfaces/book.interface';

export class CreateBookDto {
  title: Book['title'];
  description: Book['description'];
  authors: Book['authors'];
  favorite: Book['favorite'];
  fileCover: Book['fileCover'];
  fileName: Book['fileName'];
  fileBook: Book['fileBook'];
}
