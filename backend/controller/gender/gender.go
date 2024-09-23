package gender


import (

   "net/http"


   "github.com/Parichatx/user-system2/config"

	"github.com/Parichatx/user-system2/entity"

   "github.com/gin-gonic/gin"

)


func GetAll(c *gin.Context) {


   db := config.DB()


   var genders []entity.Genders

   db.Find(&genders)


   c.JSON(http.StatusOK, &genders)


}