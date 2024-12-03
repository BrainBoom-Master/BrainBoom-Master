package entity

import "gorm.io/gorm"

type Sex struct {
	gorm.Model
	Sex string   

	Animals []Animal `gorm:"foreignKey:SexID"`
}
