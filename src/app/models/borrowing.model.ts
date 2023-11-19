import { Book } from './book.model';
import { Fine } from './fine.model';
import { User } from './user.model';

export interface Borrowing {
  id: string;
  startDate: Date;
  endDate: Date;
  returnDate: Date;
  isReturned: boolean;
  user: User;
  book: Book;
  fine: Fine;
}

export interface BorrowingDto {
  startDate: string;
  endDate: string;
  email: string;
  bookId: string;
}
