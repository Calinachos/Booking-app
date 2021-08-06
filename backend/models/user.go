package models

import (
	"context"
	"errors"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Username string             `json:"username" bson:"username"`
	Password string             `json:"password" bson:"password"`
	Type     int                `json:"type" bson:"type"`
	Org_ID   primitive.ObjectID `json:"org_id" bson:"org_id,omitempty"`
}

type UserService struct {
	users *mongo.Collection
}

func NewUser(ID primitive.ObjectID, Username, Password string, Type int, Org_ID primitive.ObjectID) *User {
	return &User{ID: ID, Username: Username, Password: Password, Type: Type, Org_ID: Org_ID}
}

func NewUserService(users *mongo.Collection) *UserService {
	return &UserService{users: users}
}

func (self *UserService) FindByUsername(username string) (User, error) {
	var user User
	filter := bson.D{{"username", username}}
	err := self.users.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return user, err
	}

	return user, err
}
func (self *UserService) Insert(user User) error {
	_, err := self.users.InsertOne(context.TODO(), user)
	if err != nil {
		return err
	}

	return nil
}

func (self *UserService) FindByID(id primitive.ObjectID) (User, error) {
	var user User
	filter := bson.D{{"_id", id}}
	err := self.users.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		log.Println(err)
		return user, err
	}

	return user, err
}

func (self *UserService) Validate(user User) (User, error) {
	bdUser, err := self.FindByUsername(user.Username)
	if err != nil {
		return User{}, err
	}

	if bdUser.Password != user.Password {
		return User{}, errors.New("password incorrect")
	}

	return bdUser, nil
}
