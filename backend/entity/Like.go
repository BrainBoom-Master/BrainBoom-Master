package entity

import"gorm.io/gorm"


type Likes struct {
	gorm.Model
	UserID   uint  `gorm:"uniqueIndex:user_review_unique"`
	ReviewID *uint `gorm:"uniqueIndex:user_review_unique"`

	Reviews Reviews `gorm:"foreignKey:ReviewID"`
}