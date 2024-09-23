package entity

import ("gorm.io/gorm"
		"time")

type Payments struct {
	gorm.Model
	Amount float32
	EnrollmentDate time.Time

	// UserID ทำหน้าที่เป็น FK
	UserID *uint
	User   Users  `gorm:"foreignKey:UserID"`

	// UserId ทำหน้าที่เป็น FK
	CourseID *uint
	Course   Courses  `gorm:"foreignKey:CourseID"`
}