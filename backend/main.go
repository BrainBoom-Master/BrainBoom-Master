package main

import (
	"net/http"

	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/controller/payment"
	"github.com/Parichatx/user-system2/controller/task"
	"github.com/Parichatx/user-system2/controller/course"
	"github.com/Parichatx/user-system2/controller/course_category"
	"github.com/Parichatx/user-system2/controller/like"
	"github.com/Parichatx/user-system2/controller/review"
	"github.com/Parichatx/user-system2/controller/tutor_profiles"
	"github.com/Parichatx/user-system2/controller/users"
	//"github.com/Parichatx/user-system2/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {

	// เปิดการเชื่อมต่อฐานข้อมูล
	config.ConnectionDB()

	// สร้างฐานข้อมูล
	config.SetupDatabase()

	r := gin.Default()

	// เพิ่ม Middleware สำหรับ CORS
	r.Use(CORSMiddleware())

	router := r.Group("")
	{
		// User By Eye

		r.POST("/signup", users.SignUp)
		r.POST("/signin", users.SignIn)
		r.PUT("/users/:id", users.Update)
		r.GET("/users", users.GetAll)
		r.GET("/users/:id", users.GetUserById)
		r.DELETE("/users/:id", users.Delete)
		r.GET("/tutor_profiles/:id", tutor_profiles.GetTutorProfileByUserID) 

		// Course Routes By Pond
		router.GET("/courses", course.ListCourse)
		router.GET("/courses/:id", course.GetCourse)
		router.GET("/courses/category/:id", course.GetCourseByCategoryID)
		router.GET("/tutor/:id", course.GetCourseByTutorID)
		router.GET("/courses/search", course.SearchCourseByKeyword)
		router.POST("/courses", course.CreateCourse)
		router.PATCH("/courses/:id", course.UpdateCourse)
		router.DELETE("/courses/delete/:id", course.DeleteCourse)

		// Category Routes By Pond
		router.GET("/categories", CourseCategories.ListCourse_Category)

		//Review By Tawun
		router.GET("/user/:id", reviews.GetUserByIdReviews) 
		router.GET("/reviews", reviews.ListReview)
		router.POST("/reviews", reviews.CreateReview)
		router.GET("/reviews/course/:id", reviews.GetReviewByCourseID)
		router.GET("/reviews/filter", reviews.GetFilteredReviews)
		router.GET("/reviews/search", reviews.SearchReviewsByKeyword)
		router.GET("/course/:course_id/ratings", reviews.GetRatingsAvgByCourseID)
		router.POST("/reviews/like", like.LikeReview)
		router.DELETE("/reviews/unlike", like.UnlikeReview)
		router.GET("/reviews/:userID/:reviewID/like", like.CheckUserLikeStatus)

		//Admin By Pai
		router.GET("/tasks", tasks.ListTasks)
        router.GET("/tasks/:id", tasks.GetTaskById)
        router.POST("/tasks", tasks.CreateTask)
        router.PUT("/tasks/:id", tasks.UpdateTask)
        router.DELETE("/tasks/:id", tasks.DeleteTask)
		router.GET("/course", course.ListCourse)
        router.GET("/course-count", course.CountCourses)

		//Payment By Mac
		r.GET("/payments/user/:userID", payment.GetPaymentByIdUser) // ตะวันใช้เรียกดู user in MyCourse 
		router.GET("/payments", payment.ListAllPayments)
		router.GET("/course-price/:id", payment.GetCoursePrice)
		router.GET("/course-title/:id", payment.GetCourseName)
		router.POST("/payment", payment.CreatePayment)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// ของ อาย ????
	// เส้นทางสำหรับ tutor profiles
	// Route to get tutor profile by userID
	//r.GET("/:id", tutor_profiles.GetTutorProfile)
	//r.GET("/users/:id", tutor_profiles.GetTutorProfileByUserID)
	//r.POST("/tutor_profiles", tutor_profiles.CreateTutorProfile)
	//r.PATCH("/tutor_profiles/:id", tutor_profiles.UpdateTutorProfile)
	//r.DELETE("/tutor_profiles/:id", tutor_profiles.DeleteTutorProfile)

	// เริ่มรันเซิร์ฟเวอร์
	r.Run("localhost:" + PORT)
}

// ฟังก์ชัน Middleware สำหรับจัดการ CORS
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
