const fs = require('fs');
const path = require('path');

const frontendFile = path.join(__dirname, '../../frontend/src/data/products.js');
const seedFile = path.join(__dirname, 'seed.js');

let frontendContent = fs.readFileSync(frontendFile, 'utf8');
let seedContent = fs.readFileSync(seedFile, 'utf8');

// The new prices are in frontendContent. Let's extract the array using regex or eval
// Since it's a module, let's just extract it via simple regex matching for prices
const prices = {};
const nameRegex = /name:\s*'([^']+)'/g;
let match;
const productsInfo = [];
const lines = frontendContent.split('\n');

let currentName = '';
let currentPrice = 0;
let currentOriginal = 0;

for (const line of lines) {
  const nMatch = line.match(/name:\s*'([^']+)'/);
  if (nMatch) currentName = nMatch[1];
  
  const pMatch = line.match(/price:\s*(\d+),\s*originalPrice:\s*(\d+)/);
  if (pMatch && currentName) {
    prices[currentName] = {
      price: pMatch[1],
      originalPrice: pMatch[2]
    };
    currentName = '';
  }
}

// Now replace in seed.js
let newSeedContent = seedContent;
for (const [name, p] of Object.entries(prices)) {
  const nameRegexStr = `name:\\s*'${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]*?price:\\s*[\\d\\.]+,\n\\s*originalPrice:\\s*[\\d\\.]+`;
  const nameRegexObj = new RegExp(nameRegexStr, 'g');
  
  newSeedContent = newSeedContent.replace(nameRegexObj, (match) => {
    return match.replace(/price:\s*[\d\.]+,\n\s*originalPrice:\s*[\d\.]+/, `price: ${p.price},\n    originalPrice: ${p.originalPrice}`);
  });
}

fs.writeFileSync(seedFile, newSeedContent);
console.log('Seed file updated successfully');
