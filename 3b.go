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

	var m map[rune]int
	points := 0
	for rowIndex,row := range rows {
		firstRow := rowIndex % 3 == 0
		tmp := make(map[rune]bool)
		if firstRow == true {
			m = make(map[rune]int)
		}

		for _,char := range row {
			// only increase value if not already increased for this row
			if tmp[char] != true {
				m[char] += 1
			}
			tmp[char] = true
		}
		
		for k,v := range m {
			if v == 3 {
				var val int
				if k >= 97 && k < 123 {
					val = int(k) - 97 + 1
				} else {
					val = int(k) - 65 + 27
				}
				points += val
			}
		}
	}

	fmt.Println(points)
}