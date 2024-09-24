package payment

import (
	"net/http"
	"time"

	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"github.com/gin-gonic/gin"
)

func GetPaymentByIdUser(c *gin.Context) { // ตะวันใช้ดึงข้อมูลเข้า MyCourse (คอร์สของฉัน)
	userID := c.Param("userID")

	var payments []entity.Payments
	db := config.DB()

	if err := db.Preload("User").Preload("Course").Where("user_id = ?", userID).Find(&payments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(payments) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "ไม่พบการชำระเงินสำหรับผู้ใช้ที่ระบุ"})
		return
	}

	c.JSON(http.StatusOK, payments)
}

// Payment By Max
// GET /payments
func ListAllPayments(c *gin.Context) {
	var payments []entity.Payments
	if err := config.DB().Find(&payments).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch payments"})
			return
	}

	c.JSON(http.StatusOK, payments)
}


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


// POST /payment
func CreatePayment(c *gin.Context) {
	var payment entity.Payments
	if err := c.ShouldBindJSON(&payment); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}

	payment.EnrollmentDate = time.Now()

	db := config.DB()

	// บันทึกข้อมูลการชำระเงินลงฐานข้อมูล
	if err := db.Create(&payment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create payment"})
			return
	}

	c.JSON(http.StatusOK, payment)
}

// GET /total-paid
func GetTotalPaid(c *gin.Context) {
	var totalPaid float64

	db := config.DB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to the database"})
		return
	}

	// คำนวณผลรวมของการชำระเงินทั้งหมด
	results := db.Model(&entity.Payments{}).Select("SUM(amount)").Scan(&totalPaid)
	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total_paid": totalPaid,
	})
}

// GET /recent-transactions
func GetRecentTransactions(c *gin.Context) {
    var payments []entity.Payments

    db := config.DB()

    // ดึงข้อมูลการชำระเงินล่าสุด 8 รายการ พร้อมข้อมูลผู้ใช้ที่เกี่ยวข้อง
    if err := db.Preload("User").Order("enrollment_date DESC").Limit(8).Find(&payments).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลการทำรายการล่าสุดได้"})
        return
    }

    // เตรียมข้อมูลในรูปแบบที่ต้องการ โดยไม่รวม Transaction ID
    var response []struct {
        Username      string `json:"username"`
        EnrollmentDate string `json:"date"`  // เปลี่ยนเป็น string เพื่อรองรับการ format วันที่
        Amount        float64 `json:"amount"`
    }

    for _, payment := range payments {
        response = append(response, struct {
            Username      string `json:"username"`
            EnrollmentDate string `json:"date"`  // Format วันในรูปแบบ YYYY-MM-DD
            Amount        float64 `json:"amount"`
        }{
            Username:      payment.User.Username,
            EnrollmentDate: payment.EnrollmentDate.Format("2006-01-02"),  // Format วันที่
            Amount:        float64(payment.Amount),
        })
    }

    // ส่งข้อมูลในรูปแบบ JSON กลับไปที่ client
    c.JSON(http.StatusOK, gin.H{
        "recent_transactions": response,
    })
}



