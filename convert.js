import fs from 'fs';
import path from 'path';

const files = ['dashboard.html', 'discover.html', 'library.html', 'profile.html'];
fs.mkdirSync('src/pages', { recursive: true });

files.forEach(file => {
    let content = fs.readFileSync(path.join('stitch', file), 'utf-8');
    
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) return;
    
    let jsx = bodyMatch[1];
    
    // React JSX conversions
    jsx = jsx.replace(/class=/g, 'className=');
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    jsx = jsx.replace(/tabindex=/gi, 'tabIndex=');
    jsx = jsx.replace(/stroke-width=/gi, 'strokeWidth=');
    jsx = jsx.replace(/stroke-linecap=/gi, 'strokeLinecap=');
    jsx = jsx.replace(/stroke-linejoin=/gi, 'strokeLinejoin=');
    
    // Fix inline styles - just remove them and map manually later if needed
    // Looked like `style="font-variation-settings: 'FILL' 1;"`
    jsx = jsx.replace(/style="([^"]*)"/g, '');
    
    // Self-closing tags
    jsx = jsx.replace(/<img(.*?)>/gi, '<img$1 />');
    jsx = jsx.replace(/<img(.*?)\/>\s*\/>/gi, '<img$1/>'); // In case it was already closed
    jsx = jsx.replace(/<input(.*?)>/gi, '<input$1 />');
    jsx = jsx.replace(/<input(.*?)\/>\s*\/>/gi, '<input$1/>');
    jsx = jsx.replace(/<br>/gi, '<br />');
    jsx = jsx.replace(/<hr>/gi, '<hr />');
    
    // Fix HTML comments
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

    // Convert anchor tags to standard links to prevent warnings
    jsx = jsx.replace(/href="#"/g, 'href="/"');

    let compName = file.charAt(0).toUpperCase() + file.slice(1).replace('.html', '');
    if (compName === 'Library') compName = 'MyLibrary';

    const out = `import React from 'react';

export default function ${compName}() {
    return (
        <div className="bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen">
            <div className="grain-overlay"></div>
            ${jsx}
        </div>
    );
}
`;
    fs.writeFileSync(`src/pages/${compName}.jsx`, out);
});
console.log('Conversion complete.');
