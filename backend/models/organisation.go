package models

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/mongo"
)

type Organisation struct {
	ID   string `json:"id" bson:"_id,omitempty"`
	Name string `json:"name" bson:"name"`
}

type OrganisationService struct {
	organisations *mongo.Collection
}

func NewOrganisationService(organisations *mongo.Collection) *OrganisationService {
	return &OrganisationService{organisations: organisations}
}

// TO-DO some functions that defines Organisations

func (self *OrganisationService) FindById(id primitive.ObjectID) (Organisation, error) {

	var org Organisation

	filter := bson.D{{"_id", id}}
	err := self.organisations.FindOne(context.TODO(), filter).Decode(&org)

	if err != nil {
		log.Println(err)
		return org, err
	}

	return org, nil

}
