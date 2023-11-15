import { Author } from './author.model';
import { Bibliography } from './bibliography.model';
import { Borrowing } from './borrowing.model';
import { Category } from './category.model';
import { Publisher } from './publisher.model';
import { Reserve } from './reserve.model';
import { Tag } from './tag.model';

export interface Book {
  id: string;
  isbn: string;
  title: string;
  language: string;
  year: number;
  edition: number;
  quantity: number;
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  publisher: Publisher;
  bibliographies: Bibliography[];
  reserves: Reserve[];
  borrowings: Borrowing[];
}
