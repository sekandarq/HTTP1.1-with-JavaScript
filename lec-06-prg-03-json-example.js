const fs = require("fs");

// Read JSON file
const data = fs.readFileSync("lec-06-prg-03-json-example.json", "utf-8");

// Parse JSON data
const superHeroes = JSON.parse(data);

console.log(superHeroes.homeTown); 
console.log(superHeroes.active);
console.log(superHeroes.members[1].powers[2]);
