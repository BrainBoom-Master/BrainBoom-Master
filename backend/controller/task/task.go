package tasks

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"time"
	
)

// ListTasks ดึงรายการ Task ทั้งหมด
func ListTasks(c *gin.Context) {
	var tasks []struct {
		ID        uint      `json:"id"`        // ID
		Title     string    `json:"title"`     // ชื่อของ Task
		StartDate time.Time `json:"start_date"`// วันที่เริ่ม
	}

	if err := config.DB().Model(&entity.Tasks{}).Select("id, title, start_date").Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// GetTaskById ดึงข้อมูล Task โดยใช้ ID
func GetTaskById(c *gin.Context) {
	id := c.Param("id")
	var task entity.Tasks
	if err := config.DB().First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}
	c.JSON(http.StatusOK, task)
}

// CreateTask สร้าง Task ใหม่
type CreateTaskInput struct {
	Title     string    `json:"title" binding:"required"`
	StartDate time.Time `json:"startDate" binding:"required"`
	EndDate   time.Time `json:"endDate" binding:"required"`
	AllDay    bool      `json:"allDay"`
	UserID    uint      `json:"userId" binding:"required"`
}

func CreateTask(c *gin.Context) {
	// รับข้อมูลจาก Request Body
	var input CreateTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบวันที่
	if input.StartDate.After(input.EndDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start date must be before end date"})
		return
	}

	// สร้าง Task ใหม่
	task := entity.Tasks{
		Title:     input.Title,
		StartDate: input.StartDate,
		EndDate:   input.EndDate,
		AllDay:    input.AllDay,
		UserID:    &input.UserID,
	}

	// บันทึก Task ลงฐานข้อมูล
	if err := config.DB().Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งกลับข้อมูล Task ที่สร้างสำเร็จ
	c.JSON(http.StatusCreated, task)
}

// UpdateTask อัพเดท Task โดยใช้ ID
func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	var task entity.Tasks
	if err := config.DB().First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	// รับข้อมูลจาก Request Body
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบวันที่
	if task.StartDate.After(task.EndDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start date must be before end date"})
		return
	}

	// อัพเดทข้อมูล Task
	if err := config.DB().Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, task)
}

// DeleteTask ลบ Task โดยใช้ ID
func DeleteTask(c *gin.Context) {
    id := c.Param("id")
    if err := config.DB().Delete(&entity.Tasks{}, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

