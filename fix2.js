const fs = require('fs');
let content = fs.readFileSync('app/globals.css', 'utf8');
content = content.replace(/text-decoration: none !important;\s*\/\* Custom Dropdown Menus \*\//g, 'text-decoration: none !important;\n}\n\nbody.dark-theme .custom-tooltip-wrapper .custom-tooltip, [data-theme="dark"] .custom-tooltip-wrapper .custom-tooltip {\n    background-color: #fff;\n    color: #000;\n}\n\n.custom-tooltip-wrapper:hover .custom-tooltip {\n    visibility: visible;\n    opacity: 1;\n}\n\n/* Custom Dropdown Menus */');
fs.writeFileSync('app/globals.css', content);
