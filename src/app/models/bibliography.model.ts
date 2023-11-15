import { Book } from './book.model';

export interface Bibliography {
  id: string;
  description: string;
  books: Book[];
}
