const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const frontendPaths = new Set();
const backendRoutes = new Set();

// 1. Find all api.xxx calls in frontend
walkDir('/run/media/shahid-ansari/data/abcd/frontend/src/pages', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /api\.(get|post|put|patch|delete)\(\s*[`'"]([^`'"]+)[`'"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      // replace variables like ${id} with :id to match express routes
      let routePath = match[2].replace(/\$\{[^}]+\}/g, ':id');
      frontendPaths.add(`${match[1].toUpperCase()} ${routePath}`);
    }
  }
});

// 2. Find all router.xxx in backend
const routeFiles = fs.readdirSync('/run/media/shahid-ansari/data/abcd/backend/src/routes');

const mountPoints = {
  'auth.routes.js': '/auth',
  'student.routes.js': '/student',
  'industry.routes.js': '/industry',
  'institution.routes.js': '/institution',
  'academician.routes.js': '/academician',
  'opportunity.routes.js': '/opportunities',
  'application.routes.js': '/applications',
  'skill.routes.js': '/skill',
  'verification.routes.js': '/verification',
  'challenge.routes.js': '/challenges',
  'assessment.routes.js': '/assessment',
  'community.routes.js': '/community',
  'workspace.routes.js': '/workspaces',
  'messaging.routes.js': '/messages',
  'matching.routes.js': '/match'
};

routeFiles.forEach(file => {
  if (file === 'index.js') return;
  const basePath = mountPoints[file] || '';
  const content = fs.readFileSync(`/run/media/shahid-ansari/data/abcd/backend/src/routes/${file}`, 'utf8');
  
  const routeBlockRegex = /router\.route\(['"]([^'"]+)['"]\)([\s\S]*?)(?=router\.|$)/g;
  let blockMatch;
  while ((blockMatch = routeBlockRegex.exec(content)) !== null) {
     const routePath = blockMatch[1];
     const methods = blockMatch[2];
     const methodRegex = /\.(get|post|put|patch|delete)\(/g;
     let methodMatch;
     while ((methodMatch = methodRegex.exec(methods)) !== null) {
       let fullPath = (basePath + routePath).replace(/\/+/g, '/');
       backendRoutes.add(`${methodMatch[1].toUpperCase()} ${fullPath}`);
     }
  }

  const methodRegex = /router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g;
  let methodMatch;
  while ((methodMatch = methodRegex.exec(content)) !== null) {
    let fullPath = (basePath + methodMatch[2]).replace(/\/+/g, '/');
    backendRoutes.add(`${methodMatch[1].toUpperCase()} ${fullPath}`);
  }
});

console.log("=== FRONTEND CALLS ===");
Array.from(frontendPaths).sort().forEach(p => console.log(p));

console.log("\n=== BACKEND ROUTES ===");
Array.from(backendRoutes).sort().forEach(p => console.log(p));

console.log("\n=== ANALYSIS ===");
let missingInBackend = [];
frontendPaths.forEach(p => {
  let matched = false;
  for (let br of backendRoutes) {
     // replace express dynamic params with :id for comparison
     const brRegexStr = br.replace(/:[a-zA-Z0-9_]+/g, ':id').replace(/\//g, '\\/');
     const brRegex = new RegExp(`^${brRegexStr}$`);
     if (brRegex.test(p.replace(/:[a-zA-Z0-9_]+/g, ':id'))) {
       matched = true;
       break;
     }
  }
  if (!matched) {
    missingInBackend.push(p);
  }
});

console.log("Endpoints called by Frontend but MISSING in Backend:");
if (missingInBackend.length === 0) {
  console.log("None! All frontend calls have a corresponding backend route.");
} else {
  missingInBackend.forEach(p => console.log(`- ${p}`));
}
