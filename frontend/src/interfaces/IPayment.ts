import { CourseInterface } from "./ICourse";

export interface PaymentsReviewInterface {
  ID?: number;
  Amount: number;
  EnrollmentDate: string;
  UserID?: number;
  CourseID?: number;
  Course: CourseInterface;
}

export interface PaymentsInterface {
  ID?: number;
  Amount?: number;
  EnrollmentDate?: Date;
  UserID?: number;
  CourseID?: number;
  PaymentMethodID?: number;
  CreditCardID?: number;
  PromptPayID?: number;
}
