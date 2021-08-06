package controllers

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"rezerva-ma/backend/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ClassroomsControler struct {
	rs *models.RoomService
	os *models.OrganisationService
	bs *models.BookingService
	us *models.UserService
}

func NewClassroomsControler(rs *models.RoomService, os *models.OrganisationService, bs *models.BookingService, us *models.UserService) *ClassroomsControler {
	return &ClassroomsControler{rs: rs, os: os, bs: bs, us: us}
}

func (self *ClassroomsControler) Index(w http.ResponseWriter, r *http.Request) {
	setupCorsResponse(&w, r)

	if (*r).Method == "OPTIONS" {
		return
	}

	var msg struct {
		OrgID primitive.ObjectID `json:"org_id"`
	}
	res, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return
	}
	// Unmarshal
	err = json.Unmarshal(res, &msg)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return
	}
	// rs, _ := primitive.ObjectIDFromHex(Org_ID)
	log.Println(msg)

	_, err = self.os.FindById(msg.OrgID)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return

	}
	rooms, err := self.rs.FindAll(msg.OrgID)
	if err != nil {
		errStr := map[string]string{"success": "false", "reason": "other"}
		jsonRes, err := json.Marshal(errStr)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusForbidden)
			return
		}
		w.Write(jsonRes)

		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return
	}

	for _, room := range rooms {
		books, err := self.bs.FindAllByRID(room.ID, self.us)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusForbidden)
			return
		}

		//for _, book := range books {
		//	if room.StartAt.After(currTime) && room.EndAt.Before(currTime) {
		//		return true, nil
		//	}
		//}
		//
		room.Bookings = books
	}

	jsonRes, err := json.Marshal(rooms)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusForbidden)
		return
	}

	w.Write(jsonRes)
}
