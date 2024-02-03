const canasta = [
    {
        manzanas: 2,
        peras: 4, 
        carnes: 2,
        dulces:10
    },
    {
        manzanas: 8,
        peras: 2, 
        carnes: 11,
        dulces:2
    },
    {
        manzanas: 43,
        peras: 11, 
        carnes: 10,
        dulces:9
    },
];

console.log('cantidad de manzanas', canasta[0].manzanas+canasta[1].manzanas);
const canastaManzanas=canasta.map((canasta)=>canasta.manzanas);
console.log("🚀 ~ file: ej-202.js:18 ~ canastaManzanas:", canastaManzanas)

const contarManzanas=canasta.reduce((acc,item)=>{
    return(acc+=item.manzanas);
}, 0);
console.log("🚀 ~ file: ej-202.js:29 ~ contraManzanas ~ contraManzanas:", contarManzanas)

let sum=0;
for (let fruta of Object.values(canastaManzanas)){
    sum+=fruta;
    
}
console.log("🚀 ~ file: ej-202.js:34 ~ sum:", sum);
