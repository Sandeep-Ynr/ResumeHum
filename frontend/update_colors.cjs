const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'components');

const replacements = [
  { regex: /color:\s*['"]white['"]/g, replace: "color: 'var(--text-primary)'" },
  { regex: /color=["']white["']/g, replace: 'color="var(--text-primary)"' },
  { regex: /color:\s*['"]#9ca3af['"]/gi, replace: "color: 'var(--text-secondary)'" },
  { regex: /color=["']#9ca3af["']/gi, replace: 'color="var(--text-secondary)"' },
  { regex: /color:\s*['"]#a78bfa['"]/gi, replace: "color: 'var(--text-secondary)'" },
  { regex: /color=["']#8b5cf6["']/gi, replace: 'color="var(--primary)"' },
  { regex: /color:\s*['"]#8b5cf6['"]/gi, replace: "color: 'var(--primary)'" },
  { regex: /color:\s*['"]#d1d5db['"]/gi, replace: "color: 'var(--text-primary)'" },
  { regex: /background:\s*['"]rgba\(139,\s*92,\s*246,\s*0\.[12]\)['"]/g, replace: "background: 'var(--primary-light)'" },
  { regex: /border:\s*['"]1px solid rgba\(139,\s*92,\s*246,\s*0\.3\)['"]/g, replace: "border: '1px solid var(--border-color)'" },
  { regex: /background:\s*['"]rgba\(0,\s*0,\s*0,\s*0\.2\)['"]/g, replace: "background: 'var(--input-bg)'" },
  { regex: /borderBottom:\s*['"]1px solid rgba\(255,255,255,0\.1\)['"]/g, replace: "borderBottom: '1px solid var(--border-color)'" },
  { regex: /borderBottom:\s*['"]1px solid rgba\(255,\s*255,\s*255,\s*0\.05\)['"]/g, replace: "borderBottom: '1px solid var(--border-color)'" },
  { regex: /border:\s*['"]1px solid rgba\(255,\s*255,\s*255,\s*0\.1\)['"]/g, replace: "border: '1px solid var(--border-color)'" }
];

fs.readdir(directoryPath, (err, files) => {
  if (err) return console.error('Unable to scan directory: ' + err);
  
  files.forEach(file => {
    if (file.endsWith('.jsx')) {
      const filePath = path.join(directoryPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      let modified = false;
      replacements.forEach(({ regex, replace }) => {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated colors in ${file}`);
      }
    }
  });
});
