import { Book } from './book.model';
import { User } from './user.model';

export interface Reserve {
  id: string;
  startDate: Date;
  endDate: Date;
  isValid: boolean;
  user: User;
  book: Book;
}

export interface ReserveDto {
  startDate?: Date;
  endDate?: Date;
  isValid?: boolean;
  bookId: string;
}
