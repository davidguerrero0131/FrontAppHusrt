const fs = require('fs');
const path = require('path');

const dir = 'd:/REPOSITORIO_NUEVO_APLICATIVO_HUSRT/FrontApphusrt/src/app/Components/navbars';
const subdirs = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());

subdirs.forEach(s => {
  const file = path.join(dir, s, `${s}.component.ts`);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let lines = content.split('\n');
  let newLines = [];
  
  for(let i = 0; i < lines.length; i++) {
     if (lines[i].includes("this.router.navigate(['/login'])") && 
         i - 1 >= 0 && lines[i-1].includes('}')) {
         // Skip this line and the next line if it is a closing brace
         if (i + 1 < lines.length && lines[i+1].includes('}')) {
             i++; // skip the closing brace too
         }
         continue; // skip the current line
     }
     newLines.push(lines[i]);
  }
  
  const finalContent = newLines.join('\n');
  if (finalContent !== content) {
    fs.writeFileSync(file, finalContent);
    console.log(`Fixed ${file}`);
  }
});
