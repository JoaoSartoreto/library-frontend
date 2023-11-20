export interface LibraryConfiguration {
  id: string;
  startingDate: Date;
  dailyFine: number;
  maxBorrowedBooksByUser: number;
  maxBorrowingDurationDays: number;
  maxReservesByUser: number;
}

export interface LibraryConfigurationDto {
  startingDate: string;
  dailyFine: number;
  maxBorrowedBooksByUser: number;
  maxBorrowingDurationDays: number;
  maxReservesByUser: number;
}
