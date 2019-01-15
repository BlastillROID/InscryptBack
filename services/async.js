
const a = () => {
    console.log('a');
}

const b = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('b');
            resolve('b');
        }, 5000);
    })
}


const c = () => {
    console.log('c');
}
const main = async () => {
    a();
    await b();
    c();
}

main();