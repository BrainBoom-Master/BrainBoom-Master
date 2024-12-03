package entity

import (

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	Bio  string 
	Experience  string 
	Education     string 
	Salary float64
	FullTime bool

	// UserId ทำหน้าที่เป็น FK
	UserID *uint
	User   *User `gorm:"foreignKey:UserID"`

	Animals []Animal `gorm:"foreignKey:EmployeeID"`
}