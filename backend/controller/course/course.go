package course

import (
	"net/http"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

var validate = validator.New()

// GET /courses - List all courses
func ListCourse(c *gin.Context) {
	var courses []entity.Courses

	db := config.DB()
	db.Find(&courses)

	c.JSON(http.StatusOK, courses)
}

// GET /courses/:id - Retrieve a single course by ID
func GetCourse(c *gin.Context) {
	var course entity.Courses
	id := c.Param("id")

	db := config.DB()
	if err := db.First(&course, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, course)
}

func CreateCourse(c *gin.Context) {
	var course entity.Courses

	// Bind JSON input to the course object
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate input
	if err := validate.Struct(course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed"})
		return
	}
	
	db := config.DB()

	// Verify TutorProfileID
	var tutor entity.TutorProfiles
	if err := db.First(&tutor, course.TutorProfileID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid TutorProfileID", "providedID": course.TutorProfileID})
		return
	}

	// Verify CourseCategoryID
	var category entity.CourseCategories
	if err := db.First(&category, course.CourseCategoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CourseCategoryID", "providedID": course.CourseCategoryID})
		return
	}

	// Additional validation
	if course.Price <= 0 || course.Duration <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price and Duration must be greater than 0"})
		return
	}

	// Create a new course
	co := entity.Courses{
		Title:            course.Title,
		ProfilePicture:   course.ProfilePicture,
		Price:            course.Price,
		TeachingPlatform: course.TeachingPlatform,
		Description:      course.Description,
		Duration:         course.Duration,
		TutorProfileID:   course.TutorProfileID,
		CourseCategoryID: course.CourseCategoryID,
	}

	// Save course to the database
	if err := db.Create(&co).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Course created successfully", "data": co})
}




// PUT /courses/:id - Update an existing course by ID
func UpdateCourse(c *gin.Context) {
	var course entity.Courses

	CourseID := c.Param("id")

	db := config.DB()
	result := db.First(&course, CourseID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&course)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /courses/:id - Delete a course
func DeleteCourse(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("UPDATE courses SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", id); tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to update id %s: %v", id, tx.Error)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}




// GET /courses/category/:id - Retrieve courses by category ID
func GetCourseByCategoryID(c *gin.Context) {
    id := c.Param("id")
    var course []entity.Courses

    db := config.DB()
    results := db.Preload("CourseCategory").Where("course_category_id = ?", id).Find(&course)

    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
        return
    }
    if len(course) == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, course)
}

// GET /courses/tutor/:id - Retrieve courses by tutor ID
func GetCourseByTutorID(c *gin.Context) {
    id := c.Param("id")
    var course []entity.Courses

    db := config.DB()
    results := db.Preload("TutorProfile").Where("tutor_profile_id = ?", id).Find(&course)

    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
        return
    }
    if len(course) == 0 {
        c.JSON(http.StatusNoContent, gin.H{})
        return
    }
    c.JSON(http.StatusOK, course)
}


// ของ ปาย 

// GET /course-price/:id
func GetCoursePrice(c *gin.Context) {
	ID := c.Param("id")
	var price float64

	db := config.DB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the database"})
		return
	}

	results := db.Model(&entity.Courses{}).Select("price").Where("id = ?", ID).Scan(&price)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"course_id": ID,
		"price": price,
	})
}

// GET /course-title/:id
func GetCourseName(c *gin.Context) {
	ID := c.Param("id")
	var title string

	db := config.DB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the database"})
		return
	}

	results := db.Model(&entity.Courses{}).Select("title").Where("id = ?", ID).Scan(&title)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"course_id": ID,
		"title": title,
	})
}

func CountCourses(c *gin.Context) {
	var count int64

	// ตรวจสอบการเชื่อมต่อกับฐานข้อมูล
	db := config.DB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the database"})
		return
	}

	// ใช้ GORM เพื่อทำการนับจำนวน Course โดยอ้างอิงจาก id
	if err := db.Model(&entity.Courses{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งจำนวน Course กลับไปในรูปแบบ JSON
	c.JSON(http.StatusOK, gin.H{
		"total_courses": count,
	})
}

func SearchCourseByKeyword(c *gin.Context) {
    keyword := c.Query("keyword")

    var courses []entity.Courses
    db := config.DB()

    results := db.Where("title LIKE ?", "%"+keyword+"%").Find(&courses)

    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        return
    }

    if len(courses) == 0 {
        c.JSON(http.StatusNoContent, gin.H{"message": "No course found"})
        return
    }

    c.JSON(http.StatusOK, courses)
}

func GetCourseByPriceDESC(c *gin.Context) {
	var courses []entity.Courses

	db := config.DB()
	if err := db.Order("price desc").Find(&courses).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, courses)
}

func GetCourseByPriceASC(c *gin.Context) {
	var courses []entity.Courses

	db := config.DB()
	if err := db.Order("price asc").Find(&courses).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, courses)
}

//
type LineData struct {
	ID    string       `json:"id"`
	Color string       `json:"color"`
	Data  []DataPoints `json:"data"`
}

type DataPoints struct {
	X string  `json:"x"`
	Y float64 `json:"y"`
}

// GET /courses/graph - Retrieve graph data from the database
func GetGraphData(c *gin.Context) {
	db := config.DB()

	// สร้างโครงสร้างเก็บข้อมูล
	var courses []entity.Courses
	var graphData []LineData

	// ดึงข้อมูลจากตาราง Courses
	result := db.Find(&courses)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// สร้างข้อมูลสำหรับกราฟ
	// สร้าง LineData เพียงครั้งเดียว
	lineData := LineData{
		ID:    "Courses", // ID หรือหมวดหมู่ของกราฟ
		Color: "#00FF00", // สีของกราฟ
		Data:  []DataPoints{}, // สร้าง DataPoints เป็นอาร์เรย์ว่าง
	}

	for _, course := range courses {
		// ประยุกต์ให้ Data Points เป็นชื่อคอร์ส และราคาเป็น Y
		dataPoint := DataPoints{
			X: course.Title,              // ใช้ Title เป็นแกน X
			Y: float64(course.Price),     // ใช้ Price เป็นแกน Y
		}

		// เพิ่มข้อมูล DataPoint ลงใน Data ของ LineData
		lineData.Data = append(lineData.Data, dataPoint)
	}

	// เพิ่ม LineData ลงใน graphData
	graphData = append(graphData, lineData)

	// ส่งข้อมูลกราฟกลับไป
	c.JSON(http.StatusOK, graphData)
}
