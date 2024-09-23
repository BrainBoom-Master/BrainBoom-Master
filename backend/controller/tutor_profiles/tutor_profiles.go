package tutor_profiles

import (
	"net/http"
	"errors"
	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /tutor-profile
func CreateTutorProfile(c *gin.Context) {
	var tutorProfile entity.TutorProfiles

	if err := c.ShouldBindJSON(&tutorProfile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var user entity.Users
	if err := db.First(&user, tutorProfile.UserID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := db.Create(&tutorProfile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Tutor profile created", "data": tutorProfile})
}


func GetTutorProfileByUserID(c *gin.Context) {
    userID := c.Param("id")
    var TutorProfile entity.TutorProfiles
    db := config.DB()

    result := db.Where("user_id = ?", userID).First(&TutorProfile)

    if result.Error != nil {
        if errors.Is(result.Error, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "TutorProfile not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        }
        return
    }

    c.JSON(http.StatusOK, TutorProfile)
}



// GET /tutor-profile/:id
func GetTutorProfile(c *gin.Context) {
    userID := c.Param("UserID") // ดึง userID จาก URL
    var profile entity.TutorProfiles
	db := config.DB()

    // ดึงข้อมูลจากฐานข้อมูลโดยใช้ Gorm
    if err := db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลโปรไฟล์อาจารย์"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการดึงข้อมูล"})
        return
    }

    // ส่งข้อมูลโปรไฟล์กลับไปยัง frontend
    c.JSON(http.StatusOK, profile)
}

// GET /tutor-profiles
func ListTutorProfiles(c *gin.Context) {
	var tutorProfiles []entity.TutorProfiles

	db := config.DB()
	if err := db.Preload("User").Find(&tutorProfiles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tutorProfiles)
}

// PATCH /tutor-profile/:id
func UpdateTutorProfile(c *gin.Context) {
	var tutorProfile entity.TutorProfiles
	TutorProfileID := c.Param("id")

	db := config.DB()
	if err := db.First(&tutorProfile, TutorProfileID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tutor profile not found"})
		return
	}

	if err := c.ShouldBindJSON(&tutorProfile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	var user entity.Users
	if err := db.First(&user, tutorProfile.UserID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := db.Save(&tutorProfile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully", "data": tutorProfile})
}

// DELETE /tutor-profile/:id
func DeleteTutorProfile(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()
	if err := db.Delete(&entity.TutorProfiles{}, ID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tutor profile not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
