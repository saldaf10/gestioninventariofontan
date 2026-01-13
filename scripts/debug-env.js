const fs = require('fs');
const path = require('path');

function getHost() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return 'No .env found';

  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/DATABASE_URL="?postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^"?\s]+)/);

  if (match) {
    return {
      user: match[1],
      host: match[3],
      db: match[4]
    };
  }
  return 'No match';
}

console.log(JSON.stringify(getHost(), null, 2));
