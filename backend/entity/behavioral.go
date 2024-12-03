package entity

import "gorm.io/gorm"

type Behavioral struct {
	gorm.Model
	Behavioral string 

	Animals []Animal `gorm:"foreignKey:BehavioralID"`
}
