package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"

)

// POST /login-history
func CreateLoginHistory(c *gin.Context) {
	var loginHistory entity.LoginHistories

	// bind ข้อมูลที่รับมาเป็น JSON เข้าตัวแปร loginHistory
	if err := c.ShouldBindJSON(&loginHistory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตั้งค่าเวลาปัจจุบันให้กับ loginTimestamp
	loginHistory.LoginTimestamp = time.Now()

	db := config.DB()

	// บันทึกข้อมูลประวัติการเข้าสู่ระบบ
	if err := db.Create(&loginHistory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Login history created", "data": loginHistory})
}

// GET /login-history/:id
func GetLoginHistory(c *gin.Context) {
	ID := c.Param("id")
	var loginHistory entity.LoginHistories

	db := config.DB()
	results := db.First(&loginHistory, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, loginHistory)
}

// GET /login-history/user/:user_id
func ListUserLoginHistory(c *gin.Context) {
	userID := c.Param("user_id")
	var loginHistories []entity.LoginHistories

	db := config.DB()
	results := db.Where("user_id = ?", userID).Find(&loginHistories)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, loginHistories)
}

// DELETE /login-history/:id
func DeleteLoginHistory(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM login_histories WHERE id = ?", ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Login history id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
