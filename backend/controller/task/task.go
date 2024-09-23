package tasks

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
)

// ListTasks ดึงรายการ Task ทั้งหมด
func ListTasks(c *gin.Context) {
	var tasks []entity.Tasks
	if err := config.DB().Find(&tasks).Error; err != nil {
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
func CreateTask(c *gin.Context) {
	var task entity.Tasks
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB().Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
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
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
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
	c.JSON(http.StatusNoContent, nil)
}
