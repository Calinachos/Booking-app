package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"rezerva-ma/backend/models"
)

type LoginControler struct {
	us *models.UserService
}

func NewLoginControler(us *models.UserService) *LoginControler {
	return &LoginControler{us: us}
}

//func setupResponse(w *http.ResponseWriter, req *http.Request) {
//	(*w).Header().Set("Access-Control-Allow-Origin", "*")
//    (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
//    (*w).Header().Set("Access-Control-Allow-Headers", "*")
//}

func setupCorsResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Content-Type", "application/json")
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")

}
func (self *LoginControler) StoreIndex(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)

	if (*r).Method == "OPTIONS" {
		return
	}
	
	decoder := json.NewDecoder(r.Body)
	var loginUser models.User
	err := decoder.Decode(&loginUser)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return
	}

	sendUser, err := self.us.Validate(loginUser)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		errStr := map[string]string{"success": "false", "reason": "invalid username or password"}
		jsonRes, err := json.Marshal(errStr)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusForbidden)
			return
		}
		w.Write(jsonRes)

		return
	} else {
		jsonUser, err := json.Marshal(sendUser)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusForbidden)
			return
		}

		w.Write(jsonUser)
	}
}
