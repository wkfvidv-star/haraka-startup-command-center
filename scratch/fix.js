const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/layout/Sidebar.tsx',
  'src/pages/Goals.tsx',
  'src/pages/Initiatives.tsx',
  'src/pages/Growth.tsx',
  'src/pages/CompanyHealth.tsx',
  'src/pages/Team.tsx',
  'src/pages/Executive.tsx'
];

filesToFix.forEach(f => {
  const p = path.join('c:/Users/User/Desktop/HARAKA STARTUP COMMAND CENTER', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    // Replace \` with `
    content = content.replace(/\\`/g, '`');
    // Replace \$ with $
    content = content.replace(/\\\$/g, '$');
    fs.writeFileSync(p, content);
  }
});
console.log('Fixed escaped backticks and dollar signs');
