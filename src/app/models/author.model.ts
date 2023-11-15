import { Book } from './book.model';

export interface Author {
  id: string;
  fullName: string;
  books: Book[];
}
