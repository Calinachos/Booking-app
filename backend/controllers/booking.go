package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"rezerva-ma/backend/models"
)

type BookingControler struct {
	bs *models.BookingService
}

func NewBookingControler(bs *models.BookingService) *BookingControler {
	return &BookingControler{bs: bs}
}

//TODO booking POST
func (self *BookingControler) StoreIndex(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)

	if (*r).Method == "OPTIONS" {
		return
	}

	decoder := json.NewDecoder(r.Body)
	var booking models.Booking
	err := decoder.Decode(&booking)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return
	}

	err = self.bs.Insert(booking)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)

		bookingStr := map[string]string{"success": "false", "reason": "Could not insert booking."}
		jsonRes, err := json.Marshal(bookingStr)
		if err != nil {
			// handle error
			log.Println(err)
			w.WriteHeader(http.StatusForbidden)
			return
		}
		w.Write(jsonRes)
	}

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
