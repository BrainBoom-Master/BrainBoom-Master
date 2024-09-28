package promptpay

import (
	"net/http"

	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"github.com/gin-gonic/gin"
)

// GET /promptpays
func ListPromptPays(c *gin.Context) {
	var promptpays []entity.PromptPays
	if err := config.DB().Find(&promptpays).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch promptpay"})
			return
	}

	c.JSON(http.StatusOK, promptpays)
}

// POST /promptpay
func CreatePromptPay(c *gin.Context) {
	var promptpay entity.PromptPays
	if err := c.ShouldBindJSON(&promptpay); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}

	newPromptPay := entity.PromptPays{
		UserID: promptpay.UserID,
		PromptPayNumber: promptpay.PromptPayNumber,
	}

	db := config.DB()

	// บันทึกข้อมูล promptpay ลงฐานข้อมูล
	if err := db.Create(&newPromptPay).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create promptpay"})
			return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "promptpay created successfully",
		"promptpayId": newPromptPay.ID, // ส่ง ID ของ PromptPay ที่เพิ่งบันทึกไป
	})
}