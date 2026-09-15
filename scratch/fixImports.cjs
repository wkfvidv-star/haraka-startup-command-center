const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/Goals.tsx',
  'src/pages/Initiatives.tsx',
  'src/pages/Growth.tsx',
  'src/pages/CompanyHealth.tsx',
  'src/pages/Team.tsx',
  'src/pages/Performance.tsx',
  'src/pages/Executive.tsx'
];

filesToFix.forEach(f => {
  const p = path.join('c:/Users/User/Desktop/HARAKA STARTUP COMMAND CENTER', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/'\.\.\/components\/ui\/Card'/g, "'../components/ui/card'");
    content = content.replace(/'\.\.\/components\/ui\/Badge'/g, "'../components/ui/badge'");
    
    if (f.includes('Team.tsx')) {
      content = content.replace(/\{m\.avatarUrl \? \([\s\S]*?\) \: \([\s\S]*?\)\}/g, '{m.name.charAt(0)}');
      content = content.replace(/m\.status === 'Onboarding'/g, "m.status === 'External'");
      content = content.replace(/'قيد التهيئة'/g, "'خارجي'");
    }
    
    fs.writeFileSync(p, content);
  }
});
console.log('Fixed imports and team logic');
