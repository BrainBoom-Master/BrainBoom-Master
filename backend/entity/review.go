package entity

import (
	"time"

	"gorm.io/gorm"
)

type Reviews struct {
    gorm.Model
    Rating       uint
    Comment      string
    ReviewDate   time.Time
    Picture      string `gorm:"type:longtext"`

    UserID       *uint
    User         Users `gorm:"foreignKey:UserID"`

    CourseID     *uint
    Course       Courses `gorm:"foreignKey:CourseID"`

    Like []Likes `gorm:"foreignKey:ReviewID"`
}
