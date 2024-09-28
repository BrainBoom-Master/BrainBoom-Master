package main

import (
	"net/http"

	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/controller/course"
	"github.com/Parichatx/user-system2/controller/course_category"
	"github.com/Parichatx/user-system2/controller/like"
	"github.com/Parichatx/user-system2/controller/login_history"
	"github.com/Parichatx/user-system2/controller/payment"
	"github.com/Parichatx/user-system2/controller/review"
	"github.com/Parichatx/user-system2/controller/task"
	"github.com/Parichatx/user-system2/controller/tutor_profiles"
	"github.com/Parichatx/user-system2/controller/promptpay"
	"github.com/Parichatx/user-system2/controller/creditcard"
	"github.com/Parichatx/user-system2/controller/payment_method"
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
		r.GET("/users/tutor/:id", users.GetUserByTutorId)
		r.DELETE("/users/:id", users.Delete)
		r.PUT("/users/password/:id", users.ChangePassword)

		r.POST("/tutor_profiles", tutor_profiles.CreateTutorProfile)
		r.GET("/tutor_profiles/:UserID", tutor_profiles.GetTutorProfileByUserID)
		r.PUT("/tutor_profiles/:UserID", tutor_profiles.UpdateTutorProfile)

		r.POST("/loginhistory", login_history.CreateLoginHistory)
		r.GET("/loginhistory/:id", login_history.GetLoginHistory)
		r.GET("/loginhistory/users/:UserID", login_history.ListUserLoginHistory)
		r.DELETE("/loginhistory/:id", login_history.DeleteLoginHistory)

		// Course Routes By Pond
		router.GET("/courses", course.ListCourse)
		router.GET("/courses/:id", course.GetCourse)
		router.GET("/courses/category/:id", course.GetCourseByCategoryID)
		router.GET("/courses/price/asc", course.GetCourseByPriceASC)
		router.GET("/courses/price/desc", course.GetCourseByPriceDESC)
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
		router.PATCH("/reviews/:id", reviews.UpdateReview)
		router.GET("/review/:id",reviews.GetReviews)

		//Admin By Pai
		router.GET("/tasks", tasks.ListTasks)
        router.GET("/tasks/:id", tasks.GetTaskById)
        router.POST("/create-tasks", tasks.CreateTask)
        router.PUT("/tasks/:id", tasks.UpdateTask)
        router.DELETE("/delete-tasks/:id", tasks.DeleteTask)
		router.GET("/course", course.ListCourse)
        router.GET("/course-count", course.CountCourses)
		router.GET("/tutor-count",users.GetUserForTutor)
		router.GET("/student-count", users.GetUserForStudent)
		router.GET("/total-paid",payment.GetTotalPaid)
		router.GET("/recent-paid",payment.GetRecentTransactions)
		router.GET("/courses-graph", course.GetGraphData)

		//Payment By Mac
		router.GET("/payments/user/:userID", payment.GetPaymentByIdUser) // ตะวันใช้เรียกดู user in MyCourse 
		router.GET("/payments", payment.ListPayments)
		router.GET("/promptpays", promptpay.ListPromptPays)
		router.GET("/creditcards", creditcard.ListCreditCards)
		router.GET("/paymentmethods", paymentmethod.ListPaymentMethods)
		router.POST("/credit-card", creditcard.CreateCreditCard) // 1
		router.POST("/prompt-pay", promptpay.CreatePromptPay) // 2
		router.POST("/payment", payment.CreatePayment) // 3
		r.GET("/payments/courses/:courseID", payment.GetPaymentByIDCourse)
		r.GET("/payments/courses/:courseID/:userID", payment.GetPaymentByIDCourseAndIDUser)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

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
