const fs = require('fs');
const path = require('path');

const replaceImports = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace relative imports with absolute imports
  const importReplacements = [
    { from: './components/', to: '@/components/' },
    { from: 'components/', to: '@/components/' },
    { from: './pages/', to: '@/pages/' },
    { from: 'pages/', to: '@/pages/' },
    { from: './styles/', to: '@/styles/' },
    { from: 'styles/', to: '@/styles/' }
  ];

  importReplacements.forEach(replacement => {
    content = content.replace(
      new RegExp(`from ['"]${replacement.from}`, 'g'), 
      `from '${replacement.to}`
    );
  });

  fs.writeFileSync(filePath, content);
  console.log(`Updated imports in ${filePath}`);
};

const findJSFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findJSFiles(filePath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
};

const projectRoot = path.resolve(__dirname, '..');
const jsFiles = findJSFiles(projectRoot);
jsFiles.forEach(replaceImports);
