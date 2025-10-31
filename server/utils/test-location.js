const { trimLocationForDB, parseLocation } = require('./locationParser');

console.log('\n=== Testing Location Parser ===\n');

// Test 1: Full address with country
console.log('Test 1: "Makati, Metro Manila, Philippines"');
console.log('  Parsed:', parseLocation('Makati, Metro Manila, Philippines'));
console.log('  Trimmed:', trimLocationForDB('Makati, Metro Manila, Philippines'));

// Test 2: Another full address
console.log('\nTest 2: "Cebu City, Cebu, Philippines"');
console.log('  Parsed:', parseLocation('Cebu City, Cebu, Philippines'));
console.log('  Trimmed:', trimLocationForDB('Cebu City, Cebu, Philippines'));

// Test 3: Just city
console.log('\nTest 3: "Quezon City"');
console.log('  Parsed:', parseLocation('Quezon City'));
console.log('  Trimmed:', trimLocationForDB('Quezon City'));

// Test 4: Null value
console.log('\nTest 4: null');
console.log('  Parsed:', parseLocation(null));
console.log('  Trimmed:', trimLocationForDB(null));

// Test 5: Empty string
console.log('\nTest 5: ""');
console.log('  Parsed:', parseLocation(''));
console.log('  Trimmed:', trimLocationForDB(''));

// Test 6: Long location
console.log('\nTest 6: "Bonifacio Global City, Taguig, Metro Manila, Philippines"');
console.log('  Parsed:', parseLocation('Bonifacio Global City, Taguig, Metro Manila, Philippines'));
console.log('  Trimmed:', trimLocationForDB('Bonifacio Global City, Taguig, Metro Manila, Philippines'));

console.log('\n=== Tests Complete ===\n');
