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

func mapp[T any,K any](input []T, f func (val T) K) []K {
	var res []K
	for _, val := range input {
		v := f(val)
		res = append(res, v)
	}
	return res
}

type Match struct {
	opponent string
	outcome string
}

func (m Match) score() int {
	// A Rock, B Paper, C Scissor
	// X loose Y draw   Z win
	symbolToIndex := map[string]int{"A": 0, "B": 1, "C": 2, "X": 0, "Y": 1, "Z": 2}
	i1 := symbolToIndex[m.opponent]
	score := 0
	i2 := -1

	// who won
	// loose
	if m.outcome == "X" {
		switch i1 {
		case 0: i2 = 2
		case 1: i2 = 0
		case 2: i2 = 1
		}
		score += 0
	}
	if m.outcome == "Y" {
		i2 = i1
		score += 3
	}
	if m.outcome == "Z" {
		switch i1 {
		case 0: i2 = 1
		case 1: i2 = 2
		case 2: i2 = 0
		}
		score += 6
	}

	// point for which shape
	score += i2 + 1

	return score
}

func main() {
	dat, err := os.ReadFile("2.txt")
	check(err)
	data := string(dat)
// 	data = `A Y
// B X
// C Z`
	rows := strings.Split(data, "\n")


	result := mapp(rows, func(v string) Match {
		vals := strings.Split(v, " ")
		return Match{opponent: vals[0], outcome: vals[1]}
	})

	total := 0
	for _,match := range result {
		total += match.score()
	}
	fmt.Println(total)
}