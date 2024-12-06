package config


import (

   "fmt"

   "github.com/Tawunchai/github-exam/entity"

   "gorm.io/driver/sqlite"

   "gorm.io/gorm"

)


var db *gorm.DB


func DB() *gorm.DB {

   return db

}


func ConnectionDB() {

   database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})

   if err != nil {

       panic("failed to connect database")

   }

   fmt.Println("connected database")

   db = database

}

func SetupDatabase() {

	db.AutoMigrate(
		&entity.Animal{},
		&entity.Behavioral{},
		&entity.Biological{},
		&entity.Employee{},
		&entity.Genders{},
		&entity.Habitat{},
		&entity.Sex{},
		&entity.User{},
		&entity.UserRoles{},
		&entity.Zone{},
	)
	
}
