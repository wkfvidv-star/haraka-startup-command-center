const fs = require('fs');
const path = require('path');

function replaceInFile(f, replacements) {
  const p = path.join('c:/Users/User/Desktop/HARAKA STARTUP COMMAND CENTER', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    replacements.forEach(([regex, replaceWith]) => {
      content = content.replace(regex, replaceWith);
    });
    fs.writeFileSync(p, content);
  }
}

// CompanyHealth.tsx
replaceInFile('src/pages/CompanyHealth.tsx', [
  [/companyHealth\.metrics\.operationalScore/g, 'companyHealth.operational'],
  [/companyHealth\.metrics\.financialScore/g, 'companyHealth.financial'],
  [/companyHealth\.metrics\.productScore/g, 'companyHealth.product'],
  [/companyHealth\.metrics\.marketScore/g, 'companyHealth.market'],
  [/companyHealth\.metrics\.teamScore/g, 'companyHealth.team'],
  [/companyHealth\.metrics\.growthScore/g, 'companyHealth.growth'],
  [/companyHealth\.totalScore/g, 'companyHealth.overall'],
]);

// Executive.tsx
replaceInFile('src/pages/Executive.tsx', [
  [/status !== 'Achieved'/g, "status !== 'Completed'"],
  [/companyHealth\.totalScore/g, 'companyHealth.overall'],
  [/ceoNextMove\.priority/g, 'ceoNextMove.priority1'],
  [/ceoNextMove\.category/g, "'CEO ACTION'"],
  [/ceoNextMove\.action/g, 'ceoNextMove.decision'],
  [/companyHealth\.metrics\.financialScore/g, 'companyHealth.financial'],
  [/companyHealth\.metrics\.marketScore/g, 'companyHealth.market'],
]);

// Goals.tsx
replaceInFile('src/pages/Goals.tsx', [
  [/'Achieved'/g, "'Completed'"],
  [/goal\.metric/g, 'goal.unit'],
  [/goal\.deadline/g, 'goal.endDate'],
  [/منجز/g, 'مكتمل'], // For translation
]);

// Growth.tsx
replaceInFile('src/pages/Growth.tsx', [
  [/g\.timeframe/g, 'g.period'],
  [/g\.category/g, 'g.metric'],
]);

// Initiatives.tsx
replaceInFile('src/pages/Initiatives.tsx', [
  [/'Delayed'/g, "'Paused'"], // Using Paused as alternative for Delayed
  [/متأخر/g, 'موقوف'],
  [/init\.title/g, 'init.name'],
]);

// Performance.tsx
replaceInFile('src/pages/Performance.tsx', [
  [/tp\.tasksCompleted/g, 'tp.completedTasks'],
  [/tp\.tasksOverdue/g, 'tp.overdueTasks'],
  [/tp\.projectsInvolved/g, 'tp.workload'],
  [/tp\.overallScore/g, 'tp.completionRate'],
]);

console.log('Types fixed!');
