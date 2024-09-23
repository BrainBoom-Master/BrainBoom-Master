package entity

import (
	
	"gorm.io/gorm"
	
)

type CourseCategories struct {
	gorm.Model
	CategoryName string

	// 1 Category มีได้หลาย Course
	Courses []Courses `gorm:"foreignKey:CourseCategoryID"`
	
}