package creditcard

import (
	"log"
	"net/http"
	"os"

	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func getSecretKey() string{
	// โหลดไฟล์ .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// คืนค่าคีย์ที่เข้ารหัส
	return os.Getenv("MY_SECRET_KEY")
}

// GET /creditcards
func ListCreditCards(c *gin.Context) {
	var creditcards []entity.CreditCards
	if err := config.DB().Find(&creditcards).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch creditcards"})
			return
	}

	c.JSON(http.StatusOK, creditcards)
}

// POST /creditcard
func CreateCreditCard(c *gin.Context) {
	var credit entity.CreditCards

	// ตรวจสอบข้อมูลใน body ของ request
	if err := c.ShouldBindJSON(&credit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Encrypt CardNumber (ใช้คีย์สำหรับเข้ารหัสที่กำหนด)
	encryptedNumber, err := config.EncryptCreditCard(credit.CardNumber, getSecretKey())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to encrypt credit card number"})
		return
	}

	// Hash CardNumber (ใช้เพื่อแสดงผลลัพธ์ส่วนหนึ่งที่ไม่เข้ารหัส)
	hashedNumber := config.HashedCreditCardNumber(credit.HashedCardNumber)

	// เตรียมข้อมูล credit card เพื่อบันทึกลงในฐานข้อมูล
	creditcard := entity.CreditCards{
		UserID:           credit.UserID,          // ใส่ UserID จาก body request
		CardNumber:       encryptedNumber,        // ใช้บัตรเครดิตที่เข้ารหัสแล้ว
		HashedCardNumber: hashedNumber,           // ใช้บัตรเครดิตที่ทำ hash แล้ว
		CardHolderName:   credit.CardHolderName,  // ชื่อผู้ถือบัตร
		ExpirationMonth:  credit.ExpirationMonth, // เดือนหมดอายุ
		ExpirationYear:   credit.ExpirationYear,  // ปีหมดอายุ
	}

	db := config.DB()

	// บันทึกข้อมูล credit card ลงฐานข้อมูล
	if err := db.Create(&creditcard).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create credit card"})
		return
	}

	// ส่งข้อมูล CreditCardID กลับไปใน response
	c.JSON(http.StatusOK, gin.H{
		"message":      "credit card created successfully",
		"creditCardId": creditcard.ID, // ส่ง ID ของบัตรเครดิตที่เพิ่งบันทึกไป
	})
}
