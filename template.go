package main

import (
	"fmt"
	"os"
	"strings"
	"strconv"
	"sort"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	dat, err := os.ReadFile("1.txt")
	check(err)
	data := string(dat)
	rows := strings.Split(data, "\n")

	
}