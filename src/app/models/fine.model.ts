import { Borrowing } from './borrowing.model';

export interface Fine {
  id: string;
  isPaid: boolean;
  dailyFine: number;
  startDate: Date;
  endDate: Date;
  borrowing: Borrowing;
}
