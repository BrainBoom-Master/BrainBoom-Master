package users


import (

   "errors"

   "net/http"

   "time"


   "github.com/gin-gonic/gin"

   "golang.org/x/crypto/bcrypt"

   "gorm.io/gorm"


   "github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"github.com/Parichatx/user-system2/services"


)


type (

   Authen struct {

       Username    string `json:"username"`

       Password    string `json:"password"`

   }


   signUp struct {

       FirstName string    `json:"first_name"`

       LastName  string    `json:"last_name"`

       Email     string    `json:"email"`

        Username string `json:"username"`

       Password  string    `json:"password"`

       Birthday  time.Time `json:"birthday"`

       Profile   string  `json:"profile"  gorm:"type:longtext"`

        UserRoleID  uint      `json:"user_role_id"`

        GenderID  uint      `json:"gender_id"`
   }

)

func SignUp(c *gin.Context) {
    var payload signUp

    // Bind JSON payload to the struct
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    var userCheck entity.Users

    // Check if the user with the provided username already exists
    result := db.Where("username = ?", payload.Username).First(&userCheck)
    if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    if userCheck.ID != 0 {
        c.JSON(http.StatusConflict, gin.H{"error": "Username is already registered"})
        return
    }

    // Hash the user's password
    hashedPassword, _ := config.HashPassword(payload.Password)

    // Create a new user
    user := entity.Users{
        FirstName: payload.FirstName,
        LastName:  payload.LastName,
        Email:     payload.Email,
        Username:  payload.Username,
        Password:  hashedPassword,
        Birthday:  payload.Birthday,
        Profile:   payload.Profile,
        UserRoleID: payload.UserRoleID,
        GenderID: payload.GenderID, 
    }

    // Save the user to the database
    if err := db.Create(&user).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ตรวจสอบว่าผู้ใช้เป็น tutor หรือไม่
    if payload.UserRoleID == 2 { // เปลี่ยน <tutor_role_id> เป็น ID ที่แท้จริงของบทบาท tutor
        tutorProfile := entity.TutorProfiles{
            UserID: &user.ID,
            Bio: "",
            Education: "",
            Experience: "",
        }

        // บันทึก TutorProfiles
        if err := db.Create(&tutorProfile).Error; err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create tutor profile"})
            return
        }
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})
}




func SignIn(c *gin.Context) {
    var payload Authen
    var user entity.Users

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ค้นหา user ด้วย Username ที่ผู้ใช้กรอกเข้ามา
    if err := config.DB().Raw("SELECT * FROM users WHERE username = ?", payload.Username).Scan(&user).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ตรวจสอบรหัสผ่าน
    err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "password is incorrect"})
        return
    }

    jwtWrapper := services.JwtWrapper{
        SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
        Issuer:          "AuthService",
        ExpirationHours: 24,
    }

    signedToken, err := jwtWrapper.GenerateToken(user.Username)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
        return
    }

    
    c.JSON(http.StatusOK, gin.H{
        "token_type":  "Bearer",
        "token":       signedToken,
        "id":          user.ID,
        "user_role_id": user.UserRoleID,
        "username": user.Username, 
    })
}