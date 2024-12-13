package entity

import ("gorm.io/gorm"
		"time")

type Payments struct {
	gorm.Model
	Amount float32
	EnrollmentDate time.Time

	// UserID ทำหน้าที่เป็น FK
	UserID *uint
	User   Users  `gorm:"foreignKey:UserID"`

	// CourseID ทำหน้าที่เป็น FK
	CourseID *uint
	Course   Courses  `gorm:"foreignKey:CourseID"`

	// PaymentMethodID ทำหน้าที่เป็น FK
	PaymentMethodID uint
	PaymentMethod PaymentMethods `gorm:"foreignKey:PaymentMethodID"`

	// PaymentMethodID ทำหน้าที่เป็น FK
	CreditCardID *uint
	CreditCard CreditCards `gorm:"foreignKey:CreditCardID"`

	// PaymentMethodID ทำหน้าที่เป็น FK
	PromptPayID *uint
	PromptPay PromptPays `gorm:"foreignKey:PromptPayID"`
}