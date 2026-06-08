const content = 
![Pranav R](https://supabase.com/pranav.jpg)
### Pranav R
Documentation Lead

- Managed comprehensive project documentation
;
const regex = /(?:^|\n\n)!\[([^\]]+)\]\(([^)]+)\)(?:\r?\n)+###\s+([^\n]+)(?:\r?\n)+([^\n]+)(?:\r?\n)+([\s\S]*?)(?=\r?\n!\[|\r?\n#+\s|$)/g;
console.log(content.match(regex));
