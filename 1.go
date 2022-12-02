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

type elf struct {
	calories int
	index  int
}

func main() {
	dat, err := os.ReadFile("1.txt")
	check(err)
	data := string(dat)
	rows := strings.Split(data, "\n")

	var elves []elf	
	elves = append(elves, elf{calories: 0, index: 0})
	n := 0
	for _, str := range rows {
		if str != "" {
			num,_ := strconv.Atoi(str)
			elves[n].calories += num
		} else {
			n++
			elves = append(elves, elf{calories: 0, index: n})
		}
	}

	sort.SliceStable(elves, func (i, j int) bool {
		return elves[i].calories > elves[j].calories
	})

	fmt.Println(elves[0].calories)
	fmt.Println(elves[0].calories + elves[1].calories + elves[2].calories)
}