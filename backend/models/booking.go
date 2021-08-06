package models

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

type Booking struct {
	ID      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	RoomID  primitive.ObjectID `json:"room_id" bson:"room_id,omitempty"`
	Reason  string             `json:"reason" bson:"reason"`
	StartAt int                `json:"start_at" bson:"start_at"`
	EndAt   int                `json:"end_at" bson:"end_at"`
	UserID  primitive.ObjectID `json:"user_id" bson:"user_id,omitempty"`
	User    *User
}

type BookingService struct {
	booking *mongo.Collection
}

func NewBoking() *Booking {
	return &Booking{}
}

func NewBookingService(booking *mongo.Collection) *BookingService {
	return &BookingService{booking: booking}
}

func (self *BookingService) FindAllByRID(roomID primitive.ObjectID, us *UserService) ([]*Booking, error) {
	findOptions := options.Find()
	var bookings []*Booking

	cur, err := self.booking.Find(context.TODO(), bson.D{{Key: "room_id", Value: roomID}}, findOptions)
	if err != nil {
		log.Println(err)
		return bookings, err
	}

	for cur.Next(context.TODO()) {
		var elem Booking
		err := cur.Decode(&elem)
		if err != nil {
			log.Println(err)
		}

		findUser, err := us.FindByID(elem.UserID)
		if err != nil {
			log.Println(err)
		}

		elem.User = &findUser
		bookings = append(bookings, &elem)
	}

	if err := cur.Err(); err != nil {
		log.Println(err)
		return bookings, err
	}

	cur.Close(context.TODO())

	return bookings, err
}

func (self *BookingService) Insert(booking Booking) error {
	_, err := self.booking.InsertOne(context.TODO(), booking)
	if err != nil {
		return err
	}

	return nil
}

func (self *BookingService) AllBookingRooms() ([]Booking, error) {
	var booking []Booking

	cursor, err := self.booking.Find(context.TODO(), bson.M{})
	if err != nil {
		return nil, err
	} else {
		for cursor.Next(context.TODO()) {
			var book Booking

			err := cursor.Decode(&book)
			if err != nil {
				log.Println(err)
				return booking, err
			}

			booking = append(booking, book)
		}
	}

	return booking, nil
}
