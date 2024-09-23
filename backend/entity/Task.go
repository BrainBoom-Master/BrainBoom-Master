package entity

import (
	"time"

	"gorm.io/gorm"
)

type Tasks struct { // ปายคุม
	gorm.Model
    Title     string    `gorm:"column:title"`      
	StartDate time.Time `gorm:"column:start_date"` 
	EndDate   time.Time `gorm:"column:end_date"`   
	AllDay    bool      `gorm:"column:all_day"`    

	UserID *uint
	User   Users  `gorm:"foreignKey:UserID"`
	
}