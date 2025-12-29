const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    // 1. Parse the path to get type and id
    // e.g., /share/certificate/python-course -> ['share', 'certificate', 'python-course']
    const pathParts = event.path.split('/').filter(p => p);
    if (pathParts.length < 3) throw new Error('Invalid path');
    
    const itemType = pathParts[1]; // 'certificate'
    const itemId = pathParts[2];   // 'python-course'

    // 2. Load the data
    // Note: The path is relative to where the function is built, not the source.
    const dataPath = path.resolve(process.cwd(), 'data/share-data.json');
    const shareData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    const itemData = shareData[itemType]?.[itemId];

    if (!itemData) throw new Error('Item not found');

    // 3. Define the destination URL for real users
    const siteUrl = "https://pranavr.netlify.app";
    const destinationUrl = `${siteUrl}/${itemType}.html#${itemId}`;
    const shareImageUrl = itemData.image.startsWith('http') ? itemData.image : `${siteUrl}${itemData.image}`;

    // 4. Generate the HTML with dynamic meta tags
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${itemData.title}</title>
        <meta name="description" content="${itemData.description}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="${siteUrl}${event.path}">
        <meta property="og:title" content="${itemData.title}">
        <meta property="og:description" content="${itemData.description}">
        <meta property="og:image" content="${shareImageUrl}">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="${siteUrl}${event.path}">
        <meta name="twitter:title" content="${itemData.title}">
        <meta name="twitter:description" content="${itemData.description}">
        <meta name="twitter:image" content="${shareImageUrl}">

        <!-- Redirect for real users -->
        <meta http-equiv="refresh" content="0; url=${destinationUrl}">
      </head>
      <body>
        <p>Redirecting to <a href="${destinationUrl}">${destinationUrl}</a>...</p>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html,
    };

  } catch (error) {
    // If item not found or any other error, redirect to the homepage
    return {
      statusCode: 302,
      headers: { 'Location': 'https://pranavr.netlify.app/' },
    };
  }
};