// let instance = null;
// function Single() {
//   if (instance) {
//     return instance;
//   }

//   instance = this;
// }
// const single1 = new Single();
// const single2 = new Single();
// console.log(single1 === single2);

// const createSingle = (function () {
//   let instance = null;
//   function Single() {
//     if (instance) {
//       return instance;
//     }

//     instance = this;
//   }
//   return new Single();
// })();
// const single1 = createSingle;
// const single2 = createSingle;

// console.log(single1 === single2);

// function Single() {
//   let instance = this;

//   let oldPrototype = Single.prototype;

//   Single = function () {
//     return instance;
//   };

//   Single.prototype = oldPrototype;
//   instance = new Single();
//   instance.constructor = Single;
//   return instance;
// }

// const single1 = new Single();
// const single2 = new Single();
// console.log(single1 === single2);

class Single {
  static getInstance() {
    if (!Single.instance) {
      Single.instance = new Single();
    }

    return Single.instance;
  }
}

const single1 = Single.getInstance();
const single2 = Single.getInstance();

console.log(single1 === single2);
