import { Borrowing } from './borrowing.model';
import { Reserve } from './reserve.model';

export interface User {
  id: any;
  email: string;
  fullName: string;
  isLibrarian: boolean;
  password?: string;
  passwordConfirmation?: string;
  passwordUpdateDate?: Date;
  currentPassword?: string;
  reserves: Reserve[];
  borrowings: Borrowing[];
  deleteDate?: Date;
  access_token?: string;
}

export interface CreateUser {
  email: string;
  fullName: string;
  isLibrarian: boolean;
  password: string;
  passwordConfirmation: string;
}
