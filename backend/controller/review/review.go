package reviews

import (
    "net/http"
    "strconv"
    "time"

    "github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
    "github.com/gin-gonic/gin"
)

func CreateReview(c *gin.Context) {
    var review entity.Reviews

    if err := c.ShouldBindJSON(&review); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    r := entity.Reviews{
        Rating:     review.Rating,
        Comment:    review.Comment,
        ReviewDate: time.Now(),
        Picture:    review.Picture,
        UserID:     review.UserID,
        CourseID:   review.CourseID,
    }

    if err := db.Create(&r).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Created successfully", "data": r})
}

func ListReview(c *gin.Context) {
    var reviews []entity.Reviews

    db := config.DB()
    results := db.Find(&reviews)
    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, reviews)
}

func GetReviewByCourseID(c *gin.Context) {
    ID := c.Param("id")
    var reviews []entity.Reviews

    db := config.DB()
    results := db.Preload("Course").Where("course_id = ?", ID).Find(&reviews)
    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }
    if len(reviews) == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, reviews)
}

func GetFilteredReviews(c *gin.Context) {
    starLevel := c.Query("starLevel")
    courseIDStr := c.Query("courseID")

    var rating uint
    switch starLevel {
    case "5Star":
        rating = 5
    case "4Star":
        rating = 4
    case "3Star":
        rating = 3
    case "2Star":
        rating = 2
    case "1Star":
        rating = 1
    default:
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid star level"})
        return
    }

    var courseID *uint
    if courseIDStr != "" {
        id, err := strconv.ParseUint(courseIDStr, 10, 32)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID format"})
            return
        }
        courseIDVal := uint(id)
        courseID = &courseIDVal
        /*courseIDStr: เป็นสตริงที่เราต้องการแปลงเป็นจำนวนเต็ม เช่น "123".

10 (base): เป็นฐานของเลขที่ต้องการแปลง ในกรณีนี้กำหนดเป็น 10 หมายถึงเป็นเลขฐานสิบ (decimal) ซึ่งเป็นเลขทั่วไปที่เราใช้

32 (bitSize): กำหนดขนาดของบิตที่จะใช้ในการเก็บค่าหลังจากแปลง กำหนดเป็น 32 หมายถึงเราต้องการให้เก็บค่าผลลัพธ์เป็นจำนวนเต็มขนาด 32 บิต (ผลลัพธ์จริงจะเป็น uint32)

ผลลัพธ์: ฟังก์ชันนี้จะคืนค่าเป็นสองค่า:

ค่าแรกเป็น uint64 ที่เก็บค่าผลลัพธ์จากการแปลง*/
    }

    db := config.DB()

    var reviews []entity.Reviews
    query := db.Preload("User").Preload("Course").Where("rating = ?", rating)

    if courseID != nil {
        query = query.Where("course_id = ?", *courseID)
    }

    results := query.Find(&reviews)
    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        return
    }

    if len(reviews) == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, reviews)
}

func SearchReviewsByKeyword(c *gin.Context) {
    keyword := c.Query("keyword")
    courseID := c.Query("courseID")

    var reviews []entity.Reviews
    db := config.DB()
    results := db.Preload("User").Preload("Course").
        Where("comment LIKE ? AND course_id = ?", "%"+keyword+"%", courseID).
        Find(&reviews)
/*Where("comment LIKE ? AND course_id = ?", "%"+keyword+"%", courseID):

เป็นการใช้คำสั่ง WHERE ใน SQL เพื่อตรวจสอบเงื่อนไขว่าข้อมูลที่กำลังค้นหาจะต้องมี comment ที่คล้ายกับคำค้น (keyword) และ course_id ที่ตรงกับค่า courseID
"comment LIKE ? AND course_id = ?":
คำสั่ง SQL ที่ใช้ในการกรองข้อมูลตาม comment และ course_id
เครื่องหมาย ? ใช้เพื่อแทนค่าที่จะถูกส่งเข้าไปภายหลัง เพื่อความปลอดภัยและป้องกัน SQL injection
"%"+keyword+"%":
เป็นรูปแบบของการค้นหาที่ใช้ใน SQL ด้วยคำสั่ง LIKE
% เป็นตัวแทนของการค้นหาแบบ wildcards หรือ "อะไรก็ได้" ก่อนและหลังคำที่ค้นหา
"%" + keyword + "%": หมายถึงค้นหาข้อความที่มีคำว่า keyword ปรากฏอยู่ใน comment ไม่ว่าจะอยู่ส่วนไหนของข้อความ
courseID:
เป็นค่าที่จะใช้ตรวจสอบกับฟิลด์ course_id เพื่อกรองข้อมูลตาม course_id ที่ตรงกัน
Find(&reviews):

เป็นการใช้ฟังก์ชัน Find ของ GORM เพื่อค้นหาข้อมูลจากฐานข้อมูลตามเงื่อนไขที่ได้กำหนดไว้ใน Where
&reviews:
เป็นการบอกให้ GORM เก็บผลลัพธ์ที่ค้นหาได้ลงในตัวแปร reviews ซึ่งคาดว่าจะเป็น slice หรือ array ของ struct ที่เก็บข้อมูลของรีวิว*/
    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        return
    }

    if len(reviews) == 0 {
        c.JSON(http.StatusNoContent, gin.H{"message": "No reviews found"})
        return
    }

    c.JSON(http.StatusOK, reviews)
}

func GetRatingsAvgByCourseID(c *gin.Context) {
    courseID := c.Param("course_id")

    var ratings []uint

    db := config.DB()

    if err := db.Model(&entity.Reviews{}).Where("course_id = ?", courseID).Pluck("rating", &ratings).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching ratings"})
        return
    }
    /*db.Model(&entity.Reviews{}):

กำหนดโมเดลที่ใช้ในการค้นหาข้อมูลในฐานข้อมูล โดยในที่นี้คือโมเดล Reviews ซึ่งเป็นส่วนหนึ่งของ entity
การใช้ Model ช่วยบอก GORM ว่าคุณต้องการทำงานกับตาราง reviews
Where("course_id = ?", courseID):

ใช้เงื่อนไข WHERE ใน SQL เพื่อกรองข้อมูลที่มี course_id ตรงกับค่าของ courseID
เครื่องหมาย ? เป็นการเตรียมค่าที่จะใช้ใน SQL query โดยจะถูกแทนที่ด้วยค่า courseID
Pluck("rating", &ratings):

เป็นฟังก์ชันที่ใช้เพื่อดึงค่าเฉพาะจากคอลัมน์ rating จากข้อมูลที่ตรงกับเงื่อนไขใน Where
Pluck จะคืนค่าคอลัมน์ rating ทั้งหมดในรูปแบบของ slice หรือ array และเก็บผลลัพธ์ลงในตัวแปร ratings
ตัวอย่างเช่น ถ้าในตาราง reviews มีหลายแถวที่มี course_id ตรงกัน ฟังก์ชันนี้จะดึงเฉพาะค่า rating ของแถวนั้นออกมาและเก็บใน ratings*/

    if len(ratings) == 0 {
        c.JSON(http.StatusOK, gin.H{
            "course_id": courseID,
            "ratings":   []uint{},
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "course_id": courseID,
        "ratings":   ratings,
    })
}

func GetUserByIdReviews(c *gin.Context) {
	ID := c.Param("id")
	var user entity.Users

	db := config.DB()
	results := db.Preload("UserRole").First(&user, ID)
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

func UpdateReview(c *gin.Context) {
    var review entity.Reviews

    reviewID := c.Param("id")

    db := config.DB()
    if err := db.First(&review, reviewID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
        return
    }


    if err := c.ShouldBindJSON(&review); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updatedReview := entity.Reviews{
        Rating:     review.Rating,
        Comment:    review.Comment,
        Picture:    review.Picture, 
        ReviewDate: time.Now(),      
    }


    if err := db.Model(&review).Updates(updatedReview).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Updated successfully", "data": review})
}

func GetReviews(c *gin.Context) { // ดึงข้อมูลสมาชิกตาม ID
	ID := c.Param("id")
	var review entity.Reviews

	db := config.DB()
	result := db.First(&review, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, review)
}