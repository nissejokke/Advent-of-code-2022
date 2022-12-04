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

func mapp[T any,K any](input []T, f func (val T) K) []K {
	var res []K
	for _, val := range input {
		v := f(val)
		res = append(res, v)
	}
	return res
}

func main() {
	dat, err := os.ReadFile("x.txt")
	check(err)
	data := string(dat)
	rows := strings.Split(data, "\n")

	
}