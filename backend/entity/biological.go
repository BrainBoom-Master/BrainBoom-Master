package entity

import "gorm.io/gorm"

type Biological struct {
	gorm.Model
	Biological string 

	Animals []Animal `gorm:"foreignKey:BiologicalID"`
}

