package users

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/Parichatx/user-system2/config"
    "github.com/Parichatx/user-system2/entity"
    "github.com/go-playground/validator/v10"
    "golang.org/x/crypto/bcrypt"
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

func GetUserByTutorId(c *gin.Context) {
    ID := c.Param("id")
    var user entity.Users
    var tutor entity.TutorProfiles
    db := config.DB()

    tutorQuery := `SELECT * FROM tutor_profiles WHERE id = ? LIMIT 1`
    result := db.Raw(tutorQuery, ID).Scan(&tutor)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    userQuery := `SELECT * FROM users WHERE id = ? LIMIT 1`
    result = db.Raw(userQuery, tutor.UserID).Scan(&user)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    if user.ID == 0 {
        c.JSON(http.StatusNoContent, gin.H{"message": "User not found"})
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

func ChangePassword(c *gin.Context) {
    var payload struct {
        OldPassword    string `json:"old_password" binding:"required"`
        NewPassword    string `json:"new_password" binding:"required"` // กำหนดความยาวขั้นต่ำ
        ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=NewPassword"`
    }

    // ตรวจสอบว่ารูปแบบข้อมูลที่ส่งมาถูกต้องหรือไม่
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
        return
    }

    // ดึง ID ผู้ใช้จาก URL
    UserID := c.Param("id")

    var user entity.Users
    db := config.DB()

    // ค้นหาผู้ใช้จาก ID
    result := db.First(&user, UserID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // ตรวจสอบว่ารหัสผ่านเก่าตรงกันหรือไม่
    if !CheckPasswordHash(payload.OldPassword, []byte(user.Password)) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Old password is incorrect"})
        return
    }

    // แฮชรหัสผ่านใหม่
    hashedPassword, err := HashPassword(payload.NewPassword)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing the password"})
        return
    }

    // อัปเดตรหัสผ่านในฐานข้อมูล
    user.Password = hashedPassword
    result = db.Save(&user)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update password"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

// hashPassword เป็น function สำหรับการแปลง password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// checkPasswordHash เป็น function สำหรับ check password ที่ hash แล้ว ว่าตรงกันหรือไม่
func CheckPasswordHash(password string, hash []byte) bool {
	err := bcrypt.CompareHashAndPassword(hash, []byte(password))
	return err == nil
}

func GetUserForTutor(c *gin.Context) {
	var users []entity.Users
	db := config.DB()

	// ดึงผู้ใช้ที่มี UserRole เป็น 
	result := db.Where("user_role_id = ?", 2).Find(&users)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	count := len(users)                                          // นับจำนวนผู้ใช้
	c.JSON(http.StatusOK, gin.H{"count": count, "users": users}) // คืนค่าจำนวนและข้อมูลผู้ใช้
}

func GetUserForStudent(c *gin.Context) {
	var users []entity.Users
	db := config.DB()

	// ดึงผู้ใช้ที่มี UserRole เป็น 3
	result := db.Where("user_role_id = ?", 3).Find(&users)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	count := len(users) // นับจำนวนผู้ใช้
	c.JSON(http.StatusOK, gin.H{
		"count": count,    // คืนค่าจำนวนผู้ใช้
		"users": users,    // คืนค่าข้อมูลผู้ใช้
	})
}

func CreateUserByAdmin(c *gin.Context) {
    var user entity.Users

    // ผูกข้อมูล JSON เข้ากับ struct user
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
        return
    }

    // ตรวจสอบข้อมูลผู้ใช้ที่ซ้ำซ้อน
    db := config.DB()
    var existingUser entity.Users
    if err := db.Where("username = ?", user.Username).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "ชื่อผู้ใช้มีอยู่แล้ว"})
        return
    }

    // เข้ารหัสรหัสผ่านก่อนที่จะบันทึก
    hashedPassword, err := config.HashPassword(user.Password)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเข้ารหัสรหัสผ่านได้"})
        return
    }
    user.Password = hashedPassword // ตั้งรหัสผ่านเป็นรหัสผ่านที่เข้ารหัสแล้ว

    // สร้างผู้ใช้ในฐานข้อมูล
    if err := db.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้างผู้ใช้ได้"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "สร้างผู้ใช้สำเร็จ", "user": user})
}
