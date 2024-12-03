package entity

import "gorm.io/gorm"

type Habitat struct {
	gorm.Model
	Name     string 
	Size float64
	Capacity uint     
	Picture  string  

	ZoneID uint 
	Zone   Zone `gorm:"foreignKey:ZoneID"`

	Animals []Animal `gorm:"foreignKey:HabitatID" gorm:"-"` 
}
