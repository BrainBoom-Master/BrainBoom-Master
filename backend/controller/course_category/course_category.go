package CourseCategories

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	
)

// GET /Course
func ListCourse_Category(c *gin.Context) {
	var course_category []entity.CourseCategories

	db := config.DB()

	db.Find(&course_category)

	c.JSON(http.StatusOK, &course_category)
}