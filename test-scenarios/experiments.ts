
interface IDog {
    bark();
}

interface ICat {
    meow()
}

function Pet(): IDog&ICat {
    return { bark: ()=>console.log('bark'), meow: ()=>console.log('meow')}
}

const pet:IDog&ICat = Pet();
const pets:(IDog&ICat) [] = []

pet.bark();
pet.meow();

for(const p of pets) {
    pet.bark()
    pet.meow()
}