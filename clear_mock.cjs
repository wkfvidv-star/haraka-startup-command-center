const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'services');

const skipServices = [
  'revenueService.ts',
  'teamService.ts',
  'growthService.ts',
  'allocationService.ts'
];

skipServices.forEach(file => {
  const filePath = path.join(servicesDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace array initialization
  content = content.replace(/private store:.*?=.*?\[.*?\];/g, 'private store: any[] = [];');
  content = content.replace(/private config:.*?=.*?structuredClone.*?;/g, 'private config: any = {};');
  
  fs.writeFileSync(filePath, content);
  console.log('Cleared mock data for', file);
});
