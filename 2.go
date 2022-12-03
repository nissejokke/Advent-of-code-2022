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
	you string
}

func (m Match) score() int {
	// A Rock, B Paper, C Scissor
	// X       Y        Z
	symbolToIndex := map[string]int{"A": 0, "B": 1, "C": 2, "X": 0, "Y": 1, "Z": 2}
	i1 := symbolToIndex[m.opponent]
	i2 := symbolToIndex[m.you]
	score := 0

	// who won
	if i1 == i2 {
		score += 3
	} else if (i1 == 0 && i2 == 2) || (i1 == 1 && i2 == 0) || (i1 == 2 && i2 == 1) {
		score += 0
	} else {
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
	rows := strings.Split(data, "\n")

	result := mapp(rows, func(v string) Match {
		vals := strings.Split(v, " ")
		return Match{opponent: vals[0], you: vals[1]}
	})

	total := 0
	for _,match := range result {
		total += match.score()
	}
	fmt.Println(total)
}