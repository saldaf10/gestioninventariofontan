const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup-data.json');
const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

console.log('--- BACKUP STATUS ---');
console.log('Devices:', data.devices.length);
console.log('Responsibles:', data.responsibles.length);
const withResp = data.devices.filter(d => d.responsibleId).length;
console.log('Devices with Responsible:', withResp);
console.log('----------------------');
