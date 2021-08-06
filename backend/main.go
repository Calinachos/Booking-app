package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"rezerva-ma/backend/controllers"
	"rezerva-ma/backend/models"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/tkanos/gonfig"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Database struct {
	Client       *mongo.Client
	DB           *mongo.Database
	Organisation *mongo.Collection
	Users        *mongo.Collection
	Rooms        *mongo.Collection
	Booking      *mongo.Collection
}

type Config struct {
	PORT        string
	DB_USERNAME string
	DB_PASSWORD string
	DB_NAME     string
}

var cfg Config

type WebServer struct {
	Port   string
	Router *mux.Router
}

func NewConfig() Config {
	return Config{}
}

func NewDatabase() Database {
	return Database{}
}

func (self *Database) Connect() context.CancelFunc {
	var err error
	authURI := fmt.Sprintf("mongodb+srv://%s:%s@cluster0.bcydd.mongodb.net/%s?retryWrites=true&w=majority",
		cfg.DB_USERNAME, cfg.DB_PASSWORD, cfg.DB_NAME)

	var cancel context.CancelFunc
	self.Client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(authURI))
	checkError(err)

	self.DB = self.Client.Database("database")
	self.Users = self.DB.Collection("users")
	self.Organisation = self.DB.Collection("organisations")
	self.Rooms = self.DB.Collection("rooms")
	self.Booking = self.DB.Collection("booking")

	return cancel
}

func NewServer() WebServer {
	return WebServer{}
}

func (ws *WebServer) Initialize(port string, r *mux.Router) {
	ws.Port = ":" + port
	ws.Router = r
}

func (ws *WebServer) Run() {
	log.Println("Starting backend application on " + ws.Port)

	serv := http.Server{Addr: ws.Port, Handler: ws.Router}
	log.Fatal(serv.ListenAndServe())
}

func checkError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func notFound(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/", http.StatusFound)
}

func init() {
	// Read config file into a struct
	cfg = NewConfig()
	err := gonfig.GetConf(".config.json", &cfg)
	checkError(err)
}

func main() {
	// Connect to MongoDB
	DB := NewDatabase()
	defer (DB.Connect())()

	//go func() {
	//	for {
	//		err := crons.UpdateState()
	//		checkError(err)
	//
	//		time.Sleep(1 * time.Minute)
	//	}
	//}()

	ws := NewServer()

	// Initialize all services for controllers
	userService := models.NewUserService(DB.Users)
	roomService := models.NewRoomService(DB.Rooms)
	organisationService := models.NewOrganisationService(DB.Organisation)
	bookingService := models.NewBookingService(DB.Booking)

	// Initialize all handlers for router
	loginController := controllers.NewLoginControler(userService)
	signupController := controllers.NewSignUpController(userService)
	bookingController := controllers.NewBookingControler(bookingService)
	classroomsController := controllers.NewClassroomsControler(roomService, organisationService, bookingService, userService)

	// Configuring all routes by controllers
	router := mux.NewRouter().StrictSlash(true)

	router.NotFoundHandler = http.HandlerFunc(notFound)
	router.MethodNotAllowedHandler = http.HandlerFunc(notFound)

	router.HandleFunc("/login", loginController.StoreIndex)
	router.HandleFunc("/signup", signupController.StoreIndex)
	router.HandleFunc("/classrooms", classroomsController.Index)
	router.HandleFunc("/booking", bookingController.StoreIndex)

	ws.Initialize(cfg.PORT, router)
	ws.Run()

}
