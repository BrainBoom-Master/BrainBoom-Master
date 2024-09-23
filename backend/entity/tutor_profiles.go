package entity

import (
	

	"gorm.io/gorm"
)

type TutorProfiles struct { // edit
	gorm.Model
	Bio  string 
	Experience  string 
	Education     string 


	// UserId ทำหน้าที่เป็น FK
	UserID *uint
	User   Users `gorm:"foreignKey:UserID"`
}