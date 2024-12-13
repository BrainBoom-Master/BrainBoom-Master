// Task Interface in TypeScript
export interface Task {
  id: number;          // ID of the task
  title: string;       // Title of the task
  startDate: Date;     // Start date of the task
  endDate: Date;       // End date of the task
  allDay: boolean;     // Boolean flag if the task is all-day
  userId?: number;     // Optional Foreign key for user
  user?: User;         // Optional reference to User entity
}

// User Interface in TypeScript (for relation reference)
// User Interface in TypeScript
export interface User {
  id: number;                    // ID of the user
  username: string;              // Username of the user
  password: string;              // Password of the user
  email: string;                 // Email address of the user
  firstName: string;             // First name of the user
  lastName: string;              // Last name of the user
  birthday: Date;                // Birthday of the user
  profile: string;               // Profile (image URL or base64 encoded string)

  userRoleId?: number;           // Optional foreign key for user role
  userRole?: UserRole;           // Optional reference to the UserRole entity

  reviews?: Review[];            // Optional array of reviews associated with the user
}

// UserRole Interface
export interface UserRole {
  id: number;                    // ID of the user role
  roleName: string;              // Role name (e.g., Admin, User, etc.)
}

// Review Interface
export interface Review {
  id: number;                    // ID of the review
  content: string;               // Review content
  rating: number;                // Rating given in the review
  userId: number;                // Foreign key to the user
}


export interface Course {
  id: number;                       // ID of the course
  title: string;                    // Title of the course
  profilePicture: string;           // Profile picture of the course (URL or base64 string)
  price: number;                    // Price of the course
  teachingPlatform: string;         // Platform where the course is taught
  description: string;              // Course description
  duration: number;                 // Duration of the course in hours or weeks, etc.

  tutorProfileId?: number;          // Optional Foreign key for tutor profile
  tutorProfile?: TutorProfile;      // Optional reference to the TutorProfile entity

  courseCategoryId?: number;        // Optional Foreign key for course category
  courseCategory?: CourseCategory;  // Optional reference to the CourseCategory entity

  reviews?: Review[];               // Optional array of reviews associated with the course
}

export interface TutorProfile {
  id: number;                    // ID of the tutor profile
  bio: string;                   // Biography of the tutor
  experience: string;            // Experience details of the tutor
  education: string;             // Education background of the tutor
  profilePicture: string;        // Profile picture URL or base64 encoded string

  userId?: number;               // Optional foreign key for the associated user
  user?: User;                   // Optional reference to the associated User
}

export interface CourseCategory {
  id: number;                   // ID of the category
  categoryName: string;          // Name of the course category

  // 1 Category มีหลาย Course
  courses?: Course[];            // Optional array of related courses
}