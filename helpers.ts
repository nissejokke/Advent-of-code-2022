
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
       * Splits up array into multiple arrays on separator
       */
      chunks(separator: string): T[][];

      /**
       * Return unique values
       */
      uniq(): T[];

      /**
       * Sort descending
       */
      sortd(): T[];

      /**
       * Last value in array
       */
      last(): T;

      /**
       * Min value
       */
      min(): number;

      /**
       * Max value
       */
      max(): number;
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
    }).filter((val) => Boolean(val)) as number[];
};

Array.prototype.mean = function() {
    const nums = this.nums();
    return nums.sum() / nums.length;
};

Array.prototype.strings = function() {
    return this.map(val => val.toString());
};

Array.prototype.chunks = function<T>(separator: string): T[][] {
    return this.reduce((av: T[][], cv: T) => {
        if (cv === separator)
            av.push([]);
        else 
            av.last().push(cv);
        return av;
    }, [[]] as T[][]);
};

Array.prototype.uniq = function() {
    return [...new Set(this)];
};

Array.prototype.sortd = function() {
    return [...this].sort((a,b)=>b-a);
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

Array.prototype.min = function() {
    return Math.min(...this);
};

Array.prototype.max = function() {
    return Math.max(...this);
};

declare global {
    interface String {
        /**
         * Returns array with all numbers found
         */
        ints(): number[];

        /**
         * Split string on newline
         */
        lines(): string[];
    }
}

String.prototype.ints = function() {
    return (this.match(/\d+/g) as unknown[]).nums();
};

String.prototype.lines = function() {
    return this.split(/\n/g);
};