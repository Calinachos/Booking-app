package models

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Room struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Org_ID      primitive.ObjectID `json:"org_id" bson:"org_id,omitempty"`
	Bookings    []*Booking         `json:"bookings" bson:"bookings,omitempty"`
}

type RoomService struct {
	rooms *mongo.Collection
}

func NewRoomService(rooms *mongo.Collection) *RoomService {
	return &RoomService{rooms: rooms}
}

func (self *RoomService) FindByID(id primitive.ObjectID) (Room, error) {
	var room Room
	filter := bson.D{{"_id", id}}
	err := self.rooms.FindOne(context.TODO(), filter).Decode(&room)
	if err != nil {
		log.Println(err)
		return room, err
	}

	return room, err
}

func (self *RoomService) FindAll(Org_Id primitive.ObjectID) ([]*Room, error) {
	// Pass these options to the Find method
	log.Println(Org_Id)
	findOptions := options.Find()
	//findOptions.SetLimit(2) if u wanna limit it
	filter := bson.D{{"org_id", Org_Id}}
	// Here's an array in which you can store the decoded documents
	var results []*Room

	// Passing bson.D{{}} as the filter matches all documents in the collection
	cur, err := self.rooms.Find(context.TODO(), filter, findOptions)
	if err != nil {
		log.Println(err)
		return results, err
	}

	// Finding multiple documents returns a cursor
	// Iterating through the cursor allows us to decode documents one at a time
	for cur.Next(context.TODO()) {

		// create a value into which the single document can be decoded
		var elem Room
		err := cur.Decode(&elem)
		if err != nil {
			log.Println(err)
		}

		results = append(results, &elem)
	}

	if err := cur.Err(); err != nil {
		log.Println(err)
		return results, err
	}

	// Close the cursor once finished
	cur.Close(context.TODO())

	return results, err
}
