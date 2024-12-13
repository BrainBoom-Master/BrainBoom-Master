package entity


import "gorm.io/gorm"


type PaymentMethods struct {

   gorm.Model
   Method string

	 // 1 Method มีได้หลาย Payment
	Payments []Payments `gorm:"foreignKey:PaymentMethodID"`

}