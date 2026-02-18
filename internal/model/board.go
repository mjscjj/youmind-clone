package model

import "time"

type Board struct {
	ID          string    `gorm:"type:uuid;primary_key" json:"id"`
	OwnerID     string    `gorm:"not null;index" json:"owner_id"`
	Name        string    `gorm:"not null" json:"name"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	Type        string    `gorm:"default:'custom'" json:"type"`
	State       string    `gorm:"default:'active'" json:"state"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (Board) TableName() string { return "boards" }