package entity

import("gorm.io/gorm"
	) 

type Courses struct {
	gorm.Model
	Title string
	ProfilePicture string `gorm:"type:longtext"`
	Price float32
	TeachingPlatform string
	Description string
	Duration uint



	// UserId ทำหน้าที่เป็น FK
	TutorProfileID *uint
	TutorProfile   TutorProfiles `gorm:"foreignKey:TutorProfileID"`

	// CourseCategoryID ทำหน้าที่เป็น FK
	CourseCategoryID *uint
	CourseCategory   CourseCategories `gorm:"foreignKey:CourseCategoryID"`

	// 1 course สามารถมีหลาย review
	Reviews []Reviews `gorm:"foreignKey:CourseID"`

	// 1 course สามารถมีหลาย payment
	Payments []Payments `gorm:"foreignKey:CourseID"`
}
