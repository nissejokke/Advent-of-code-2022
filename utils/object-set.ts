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
  }