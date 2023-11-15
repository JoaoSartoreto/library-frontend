import { Book } from './book.model';

export interface Category {
  id: string;
  name: string;
  books: Book[];
}
