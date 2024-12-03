package entity

import "gorm.io/gorm"

type Zone struct {
	gorm.Model
	Zone        string  
	Description string 
	Picture     string  
}
