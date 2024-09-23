import { CourseInterface } from './ICourse';

export interface PaymentsReviewInterface { // ตะวันใช้อยู่ 
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
  }