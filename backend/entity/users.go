package entity

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	gorm.Model
	Username  string	
	Password  string	
	Email     string	
	FirstName string    
   	LastName  string    
	Birthday  time.Time	
	Profile   string 	`gorm:"type:longtext"` // edit

	// UserRoleID ทำหน้าที่เป็น FK
	UserRoleID uint `json:"user_role_id"`
	UserRole   *UserRoles `gorm:"foreignKey: user_role_id" `

	// GenderID ทำหน้าที่เป็น FK
	GenderID  uint      `json:"gender_id"`
   	Gender    *Genders  `gorm:"foreignKey: gender_id" json:"gender"`

	// 1 user สามารถมีหลาย login history
	LoginHistories []LoginHistories `gorm:"foreignKey:UserID"`

	// 1 user สามารถมีได้ 1 TutorProfile 
	TutorProfile  *TutorProfiles  `gorm:"foreignKey:UserID"`

	// 1 user สามารถมีหลาย payment
	Payments []Payments `gorm:"foreignKey:UserID"`

	// 1 user สามารถมีหลาย review
	Reviews []Reviews `gorm:"foreignKey:UserID"`

	// 1 user สามารถมีได้หลาย task
	Task []Tasks `gorm:"foreignKey:UserID"`
}