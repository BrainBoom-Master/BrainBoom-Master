package entity

import (
	
	"gorm.io/gorm"
)

type UserRoles struct {
	gorm.Model
	RoleName string
	
	// 1 Role มีได้หลาย User
	Users []Users `gorm:"foreignKey:UserRoleID"`
}