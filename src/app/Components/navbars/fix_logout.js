const fs = require('fs');
const path = require('path');

const dir = 'd:/REPOSITORIO_NUEVO_APLICATIVO_HUSRT/FrontApphusrt/src/app/Components/navbars';
const subdirs = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());

subdirs.forEach(s => {
  const file = path.join(dir, s, `${s}.component.ts`);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // import UserService
  if (!content.includes('UserService')) {
     content = content.replace("from '@angular/core';", "from '@angular/core';\nimport { UserService } from '../../../Services/appServices/userServices/user.service';");
  }
  
  // Inject UserService
  if (!content.includes('userService = inject(UserService)')) {
     content = content.replace(/export class .*? \{/, match => match + '\n    userService = inject(UserService);');
  }
  
  // Replace navigateToAbout / navigateToLogin
  content = content.replace(/(navigateTo(About|Login)\s*\(\)\s*\{)([^}]*\})/g, (match, p1) => {
     return p1 + '\n        this.userService.logout();\n    }';
  });
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
