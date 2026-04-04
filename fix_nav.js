import fs from 'fs';
import path from 'path';

const files = ['Dashboard.jsx', 'Discover.jsx', 'MyLibrary.jsx', 'Profile.jsx'];

files.forEach(file => {
    let content = fs.readFileSync(path.join('src/pages', file), 'utf-8');
    
    // Replace all links by converting them temporarily
    let sections = content.split('<nav');
    if (sections.length > 1) {
        let navHtml = '<nav' + sections[1];
        
        let linkCounter = 0;
        navHtml = navHtml.replace(/href="\/"/g, (match) => {
            linkCounter++;
            if (linkCounter === 1) return 'href="/"';
            if (linkCounter === 2) return 'href="/discover"';
            if (linkCounter === 3) return 'href="/library"';
            if (linkCounter === 4) return 'href="/profile"';
            return 'href="/"';
        });
        
        content = sections[0] + navHtml;
        fs.writeFileSync(path.join('src/pages', file), content);
    }
});
console.log('Nav fixed');
