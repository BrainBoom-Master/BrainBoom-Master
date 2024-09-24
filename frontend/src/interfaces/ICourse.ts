// course.interface.ts
export interface CourseInterface {

  ID?: number;

  UpdatedAt?: string;

  Title: string;

  ProfilePicture: string;

  Price: number;

  TeachingPlatform: string;

  Description: string;

  Duration: number;

  TutorProfileID?: number;

  CourseCategoryID?: number;

}