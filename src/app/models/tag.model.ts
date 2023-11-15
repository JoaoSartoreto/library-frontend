import { Book } from './book.model';

export interface Tag {
  id: string;
  name: string;
  books: Book[];
}
