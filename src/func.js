let func = a => a * a; // 單行
let func2 = () => {
    let r = 0;
    for (let i = 1; i <= 10; i++) {
        r += i;
    }
    return r;
};
console.log(func(5));
console.log(func2());
