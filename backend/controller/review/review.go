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