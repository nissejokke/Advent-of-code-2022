export class ObjectSet<T> extends Set{
    add(elem: T){
      return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
    delete(elem: T){
      return super.delete(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
    has(elem: T){
      return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
    values(): IterableIterator<T> {
      const iterator = super.values();
      return {
        [Symbol.iterator]() {
          return {
            next(){
              const res = iterator.next();
              if (res.done) return {
                value: typeof res.value === 'object' && res.value !== undefined ? JSON.parse(res.value) : res.value,
                done: true
              }
              return {
                value: JSON.parse(res.value),
                done: false
              }
            }
          }
        },
      }
    }
  }