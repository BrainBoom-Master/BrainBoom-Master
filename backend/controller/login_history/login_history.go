package login_history

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/Parichatx/user-system2/config"
    "github.com/Parichatx/user-system2/entity"
)

// CreateLoginHistory สร้างประวัติการเข้าสู่ระบบใหม่
func CreateLoginHistory(c *gin.Context) {
    var loginHistory entity.LoginHistories

    // bind ข้อมูลที่รับมาเป็น JSON เข้าตัวแปร loginHistory
    if err := c.ShouldBindJSON(&loginHistory); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
        return
    }

    // ตั้งค่าเวลาปัจจุบันให้กับ loginTimestamp
    loginHistory.LoginTimestamp = time.Now()

    db := config.DB()

    // บันทึกข้อมูลประวัติการเข้าสู่ระบบ
    if err := db.Create(&loginHistory).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create login history: " + err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Login history created", "data": loginHistory})
}

// GetLoginHistory ดึงข้อมูลประวัติการเข้าสู่ระบบตาม ID
func GetLoginHistory(c *gin.Context) {
    ID := c.Param("UserID")
    var loginHistory entity.LoginHistories

    db := config.DB()
    if err := db.First(&loginHistory, ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Login history not found: " + err.Error()})
        return
    }

    c.JSON(http.StatusOK, loginHistory)
}

// ListUserLoginHistory ดึงข้อมูลประวัติการเข้าสู่ระบบของผู้ใช้
func ListUserLoginHistory(c *gin.Context) {
    UserID := c.Param("UserID")
    var loginHistories []entity.LoginHistories

    db := config.DB()
    if err := db.Where("user_id = ?", UserID).Find(&loginHistories).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No login history found for user ID: " + err.Error()})
        return
    }

    c.JSON(http.StatusOK, loginHistories)
}

// DeleteLoginHistory ลบประวัติการเข้าสู่ระบบตาม ID
func DeleteLoginHistory(c *gin.Context) {
    ID := c.Param("id")
    db := config.DB()

    if tx := db.Exec("DELETE FROM login_histories WHERE id = ?", ID); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Login history ID not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
