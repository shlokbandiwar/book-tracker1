import fs from 'fs';
import path from 'path';

const files = ['Dashboard.jsx', 'Discover.jsx', 'MyLibrary.jsx', 'Profile.jsx'];

files.forEach(file => {
    let content = fs.readFileSync(path.join('src/pages', file), 'utf-8');
    
    // Fix `/ />` and `/> />` 
    content = content.replace(/\/ \/>/g, '/>');
    content = content.replace(/\/> \/>/g, '/>');
    content = content.replace(/\/><\/img>/g, '/>');
    content = content.replace(/<\/input>/g, '');
    
    fs.writeFileSync(path.join('src/pages', file), content);
});
console.log('Fixed JSX syntax.');
