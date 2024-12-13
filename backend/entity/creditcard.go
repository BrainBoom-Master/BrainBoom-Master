package entity


import "gorm.io/gorm"


type CreditCards struct {

   gorm.Model
   
	 // UserID ทำหน้าที่เป็น FK
	 UserID *uint
	 User   Users  `gorm:"foreignKey:UserID"`

	 CardNumber string
	 HashedCardNumber string
	 CardHolderName string
	 ExpirationMonth string
	 ExpirationYear string
	 
	 // 1 creditcard มีได้หลาย payment
	 Payments []Payments `gorm:"foreignKey:CreditCardID"`


}