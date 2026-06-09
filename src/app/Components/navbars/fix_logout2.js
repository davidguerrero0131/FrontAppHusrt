const fs = require('fs');
const path = require('path');

const dir = 'd:/REPOSITORIO_NUEVO_APLICATIVO_HUSRT/FrontApphusrt/src/app/Components/navbars';
const subdirs = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());

subdirs.forEach(s => {
  const file = path.join(dir, s, `${s}.component.ts`);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix the syntax error:
  content = content.replace(/\n        this\.userService\.logout\(\);\n    \}\n *(.*this\.router\.navigate.*)\n    \}/g, '\n        this.userService.logout();\n    }');
  content = content.replace(/\n        this\.userService\.logout\(\);\n    \}\n(.*navigateto(login|about).*)\n    \}/gi, '\n        this.userService.logout();\n    }');
  
  // Actually the broken code is:
  /*
      navigateToAbout() {
        this.userService.logout();
    }
        this.router.navigate(['/login'])
    }
  */
  
  let original = content;
  content = content.replace(/this\.userService\.logout\(\);\n    \}\n[ \t]*this\.router\.navigate\(\['\/login'\]\);?[ \t]*\n    \}/g, "this.userService.logout();\n    }");
  
  if (original !== content) {
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
});
