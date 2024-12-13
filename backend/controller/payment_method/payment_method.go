package paymentmethod

import (
	"net/http"

	"github.com/Parichatx/user-system2/config"
	"github.com/Parichatx/user-system2/entity"
	"github.com/gin-gonic/gin"
)

// GET /PaymentMethods
func ListPaymentMethods(c *gin.Context) {

	var payment_methods []entity.PaymentMethods

	db := config.DB()

	db.Find(&payment_methods)

	c.JSON(http.StatusOK, &payment_methods)
}