
declare global {
    interface Array<T> {
        /**
         * Summarize values, ignores not numbers
         */
      sum(): number;

      /**
       * Try parse every value to number
       */
      nums(): number[];

      /**
       * Mean value
       */
      mean(): number;

      /**
       * ToString every value
       */
      strings(): string[];

      /**
       * Trims values
       */
      trim(): T[];

      /**
       * Splits up array into multiple arrays on separator
       */
      split(separator: string): T[][];

      /**
       * Splits up array into multiple arrays sized size
       */
      chunks(chunkSize: number): T[][];

      /**
       * Return unique values
       */
      uniq(): T[];

      /**
       * Sort numbers descending
       */
      sortDesc(): T[];

      /**
       * Sort numbers ascending
       */
      sortAsc(): T[];

      /**
       * Is array value equal to another array
       * @param arr 
       */
      valueEquals(arr: T[]): boolean;

      /**
       * Last value in array
       */
      last(): T;

      /**
       * Returns new array with last number of items from original array
       */
      lastVals(count: number): T[];

      /**
       * Min value
       */
      min(): number;

      /**
       * Max value
       */
      max(): number;

      /**
       * Every value that Boolean(value) returns true for
       */
      truthful(): T[];

      /**
       * Intersect with another array, returns new array
       */
      intersect(arr: T[]): T[];

      /**
       * Union with another array, returns new array
       */
      union(arr: T[]): T[];

      /**
       * Removes arr values from this, returns new array
       */
      diff(arr: T[]): T[];
    }
  }

Array.prototype.sum = function() {
    return this.reduce((av, cv) => {
        const val = Number.parseFloat(cv);
        return av + (Number.isNaN(val) ? 0 : val);
    }, 0);
};

Array.prototype.nums = function() {
    return this.map(val => {
        const parsedVal = parseFloat(val);
        return Number.isNaN(parsedVal) ? null : parsedVal;
    }).filter((val) => val != null) as number[];
};

Array.prototype.mean = function() {
    const nums = this.nums();
    return nums.sum() / nums.length;
};

Array.prototype.strings = function() {
    return this.map(val => val.toString());
};

Array.prototype.trim = function() {
    return this.map(val => typeof val === 'string' ? val.trim() : val);
};

Array.prototype.split = function<T>(separator: string): T[][] {
    return this.reduce((av: T[][], cv: T) => {
        if (cv === separator)
            av.push([]);
        else 
            av.last().push(cv);
        return av;
    }, [[]] as T[][]);
};

Array.prototype.chunks = function<T>(chunkSize: number): T[][] {
    return this.reduce((av, cv) => {
        let lastArr = av.last();
        if (!lastArr || lastArr.length === chunkSize) {
            lastArr = [];
            av.push(lastArr);
        }
        lastArr.push(cv);

        return av;
    }, []);
}

Array.prototype.uniq = function() {
    return [...new Set(this)];
};

Array.prototype.sortDesc = function() {
    return [...this].sort((a,b)=>b-a);
};

Array.prototype.sortAsc = function() {
    return [...this].sort((a,b)=>a-b);
};

Array.prototype.valueEquals = function(arr) {
    return JSON.stringify(this) === JSON.stringify(arr);
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

Array.prototype.lastVals = function(count: number) {
    return this.slice(this.length - count);
};

Array.prototype.min = function() {
    return Math.min(...this);
};

Array.prototype.max = function() {
    return Math.max(...this);
};

Array.prototype.truthful = function() {
    return this.filter(Boolean);
};

Array.prototype.intersect = function(arr) {
    const set = new Set(arr);
    const intersection = new Set(
        [...this].filter(element => set.has(element))
    );
    return [...intersection];
};

Array.prototype.union = function(arr) {
    const set = new Set([...this, ...arr]);
    return [...set];
};

Array.prototype.diff = function(arr) {
    return this.filter(val => !arr.includes(val));
};

declare global {
    interface String {
        /**
         * Returns array with all numbers found
         */
        nums(): number[];

        /**
         * Split string on newline
         */
        lines(): string[];

        /**
         * Split string into words
         */
        words(): string[];

        /**
         * Inserts string at position in string returning new string without modifying current string
         */
        replaceAt(index: number, replacement: string): string;
    }
}

String.prototype.nums = function() {
    return (this.match(/\d+/g) as unknown[]).nums();
};

String.prototype.lines = function() {
    return this.split(/\n/g);
};

String.prototype.words = function() {
    return this.split(/\s+/g);
};

String.prototype.replaceAt = function(index: number, replacement: string): string {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

export function range(upperBound: number, lowerBound = 0) {
    return new Array(upperBound - lowerBound).fill(0).map((_,i) => i + lowerBound);
}