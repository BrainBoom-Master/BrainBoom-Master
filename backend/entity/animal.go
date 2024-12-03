package entity

import (
	"time"

	"gorm.io/gorm"
)

type Animal struct {
	gorm.Model
	Name string
	Description string
	Weight float64
	Height float64
	Birthplace string
	BirthDay    time.Time 
	Picture string
	Health string
	Note string

	// GenderID ทำหน้าที่เป็น FK
	SexID uint
	Sex   Sex `gorm:"foreignKey:SexID"`

	BiologicalID uint
	Biological   Biological `gorm:"foreignKey:BiologicalID"`

	BehavioralID uint
	Behavioral   Behavioral `gorm:"foreignKey:BehavioralID"`

	EmployeeID uint
	Employee   Employee `gorm:"foreignKey:EmployeeID"`

	HabitatID uint
	Habitat   Habitat `gorm:"foreignKey:HabitatID"`
}