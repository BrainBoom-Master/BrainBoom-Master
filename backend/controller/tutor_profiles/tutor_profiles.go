package tutor_profiles

import (
	"net/http"

	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()
// POST /tutor-profile
func CreateTutorProfile(c *gin.Context) {
	var tutorProfile entity.TutorProfiles

	if err := c.ShouldBindJSON(&tutorProfile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	db := config.DB()

	var user entity.Users
	if err := db.First(&user, tutorProfile.UserID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// Check if the tutor profile for this user already exists
	var existingProfile entity.TutorProfiles
	if err := db.Where("user_id = ?", tutorProfile.UserID).First(&existingProfile).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tutor profile already exists for this user"})
		return
	}

	if err := db.Create(&tutorProfile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Tutor profile created", "data": tutorProfile})
}

// GET /tutor-profile/:userID
func GetTutorProfileByUserID(c *gin.Context) {
	userID := c.Param("UserID")
	var tutorProfile entity.TutorProfiles
	db := config.DB()

	// Query the tutor profile by userID
	result := db.Where("user_id = ?", userID).First(&tutorProfile)
	if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }
    if userID == "" {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
    c.JSON(http.StatusOK, tutorProfile)
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

// put /tutor-profile/:id
func UpdateTutorProfile(c *gin.Context) {
	var tutorProfile entity.TutorProfiles
	UserID := c.Param("UserID")

	db := config.DB()
	result := db.Where("user_id = ?", UserID).First(&tutorProfile)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tutor profile not found"})
		return
	}

	if err := c.ShouldBindJSON(&tutorProfile); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    if err := validate.Struct(tutorProfile); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result = db.Save(&tutorProfile)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /tutor-profile/:id
func DeleteTutorProfile(c *gin.Context) {
	ID := c.Param("id")
	db := config.DB()

	// Check if the tutor profile exists
	if err := db.First(&entity.TutorProfiles{}, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tutor profile not found"})
		return
	}

	// Delete the tutor profile
	if err := db.Delete(&entity.TutorProfiles{}, ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to delete profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
