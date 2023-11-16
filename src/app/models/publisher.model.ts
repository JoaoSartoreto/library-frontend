import { Book } from './book.model';

export interface Publisher {
  id: string;
  name: string;
  country: string;
  books: Book[];
}

export interface PublisherDto {
  name: string;
  country: string;
}
