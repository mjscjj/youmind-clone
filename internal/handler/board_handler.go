package handler

import (
	"net/http"
	"youmind-clone/internal/service"
	"github.com/gin-gonic/gin"
)

func ListBoards(c *gin.Context) {
	userID := c.GetString("userID")
	boards, err := service.GetBoardsByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": boards})
}

func CreateBoard(c *gin.Context) {
	userID := c.GetString("userID")
	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
		Type        string `json:"type"`
		Icon        string `json:"icon"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	board, err := service.CreateBoard(userID, req.Name, req.Description, req.Type, req.Icon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": board})
}

func GetBoard(c *gin.Context) {
	boardID := c.Param("id")
	board, err := service.GetBoard(boardID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "board not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": board})
}

func UpdateBoard(c *gin.Context) {
	boardID := c.Param("id")
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Icon        string `json:"icon"`
	}
	c.ShouldBindJSON(&req)
	
	board, err := service.UpdateBoard(boardID, req.Name, req.Description, req.Icon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": board})
}

func DeleteBoard(c *gin.Context) {
	boardID := c.Param("id")
	if err := service.DeleteBoard(boardID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}