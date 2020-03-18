// src/person_test.js
const Person = require('./person');
const p1 = new Person('Dick', 87);
const p2 = new Person;
console.log(p1.toJSON());
console.log(p1.toString());
console.log(p2.toJSON());
console.log(p2.toString());