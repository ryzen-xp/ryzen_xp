const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Startup-Research-Bible');
const destDir = path.join(__dirname, 'content', 'book');

// Create dest dir if not exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md') && f !== 'SUMMARY.md' && f !== 'README.md');

files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file.replace('.md', '.mdx'));
    
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Extract title from first H1 if present
    let title = file.replace('.md', '').replace(/-/g, ' ');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
        title = titleMatch[1].trim();
        // Remove the H1 from content since it will be rendered by the page layout
        content = content.replace(/^#\s+(.+)$/m, '').trim();
    }
    
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
publishedAt: "2024-01-01"
summary: "Chapter from the Startup Research Bible."
---

`;
    
    fs.writeFileSync(destPath, frontmatter + content);
});

console.log('Migration complete. Processed ' + files.length + ' files.');
