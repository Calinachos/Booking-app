package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"rezerva-ma/backend/models"
	"strings"
)

type SignUpController struct {
	us *models.UserService
}

func NewSignUpController(us *models.UserService) *SignUpController {
	return &SignUpController{us: us}
}

func (self *SignUpController) StoreIndex(w http.ResponseWriter, r *http.Request) {
	// w.Header().Set("Content-Type", "application/json")
	var signupUser models.User
	setupCorsResponse(&w, r)

	if (*r).Method == "OPTIONS" {
		return
	}

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&signupUser)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return
	}

	err = self.us.Insert(signupUser)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate") == true {
			signupRes := map[string]string{"success": "false", "reason": "duplicate"}
			jsonRes, err := json.Marshal(signupRes)
			if err != nil {
				// handle error
				log.Println(err)
				w.WriteHeader(http.StatusForbidden)
				return
			}
			w.Write(jsonRes)
		} else {
			log.Println(err.Error())
			w.WriteHeader(http.StatusForbidden)
			return
		}
	} else {
		signupRes := map[string]string{"success": "true"}
		jsonRes, err := json.Marshal(signupRes)
		if err != nil {
			// handle error
			log.Println(err)
			w.WriteHeader(http.StatusForbidden)
			return
		}
		w.Write(jsonRes)
	}

}
