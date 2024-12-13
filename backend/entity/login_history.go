package entity

import("gorm.io/gorm"
		"time") 

type LoginHistories struct {
	gorm.Model
	LoginTimestamp time.Time

	// UserId ทำหน้าที่เป็น FK
	UserID *uint
	User   Users  `gorm:"foreignKey:UserID"`

}