package main

import (
	"fmt"
	"os"
	"strings"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	dat, err := os.ReadFile("3.txt")
	check(err)
	data := string(dat)
	rows := strings.Split(data, "\n")

	points := 0
	for _,row := range rows {
		m := make(map[rune]bool)
		for charIndex,char := range row {
			if charIndex < len(row)/2 {
				m[char] = true
			} else if m[char] == true {
				m[char] = false
				var val int
				if char >= 97 && char < 123 {
					val = int(char) - 97 + 1
				} else {
					val = int(char) - 65 + 27
				}

				points += val
				fmt.Println(string(char), val)
			}
		}
	}

	fmt.Println(points)
}