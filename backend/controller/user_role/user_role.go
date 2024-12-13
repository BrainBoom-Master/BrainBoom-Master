package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	
)

// GET /UserRole
func ListUserRoles(c *gin.Context) {

	var user_role []entity.UserRoles

	db := config.DB()

	db.Find(&user_role)

	c.JSON(http.StatusOK, &user_role)
}