package entity


import "gorm.io/gorm"


type PromptPays struct {

   gorm.Model
   
	 // UserID ทำหน้าที่เป็น FK
	 UserID *uint
	 User   Users  `gorm:"foreignKey:UserID"`
	 
	 PromptPayNumber string

	 // 1 promptpay มีได้หลาย payment
	 Payments []Payments `gorm:"foreignKey:PromptPayID"`
	 


}