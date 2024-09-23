package entity

type Like struct {
	UserID   uint  `gorm:"uniqueIndex:user_review_unique"`
	ReviewID *uint `gorm:"uniqueIndex:user_review_unique"`

	Reviews Reviews `gorm:"foreignKey:ReviewID"`
}