package users

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/Parichatx/user-system2/config"
    "github.com/Parichatx/user-system2/entity"
    "github.com/go-playground/validator/v10"
)

var validate = validator.New()

func GetAll(c *gin.Context) {
    authHeader := c.GetHeader("Authorization")
    if authHeader == "" {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
        return
    }

    var users []entity.Users
    db := config.DB()
    // Preload related tutor_profiles data
    results := db.Preload("Gender").Preload("UserRole").Preload("TutorProfile").Find(&users)
    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, users)
}

func GetUserById(c *gin.Context) {
    ID := c.Param("id")
    var user entity.Users
    db := config.DB()
    // Preload related tutor_profiles data
    results := db.Preload("Gender").Preload("UserRole").Preload("TutorProfile").First(&user, ID)
    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if user.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
    c.JSON(http.StatusOK, user)
}

func Update(c *gin.Context) {
    var user entity.Users
    UserID := c.Param("id")

    db := config.DB()
    result := db.First(&user, UserID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    if err := validate.Struct(user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    result = db.Save(&user)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func Delete(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    if tx := db.Exec("DELETE FROM users WHERE id = ?", id); tx.Error != nil || tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found or unable to delete"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
