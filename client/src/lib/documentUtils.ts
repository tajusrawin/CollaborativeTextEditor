import { Document, DocumentBlock } from "@/types/document";

export function createEmptyDocument(): Document {
  return {
    id: generateId(),
    title: "Untitled Document",
    content: {
      blocks: [],
      settings: {
        paperSize: 'A4',
        orientation: 'portrait',
        defaultFont: 'Georgia',
        lineSpacing: 1.15,
        margins: {
          top: 1,
          bottom: 1,
          left: 1,
          right: 1
        }
      }
    },
    lastModified: new Date(),
    ownerId: "current-user"
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createTextBlock(content: string, type: 'paragraph' | 'heading' = 'paragraph'): Omit<DocumentBlock, 'id'> {
  return {
    type,
    content,
    formatting: {
      fontFamily: 'Georgia',
      fontSize: type === 'heading' ? 24 : 16,
      alignment: 'left'
    }
  };
}

export function createImageBlock(src: string, alt: string): Omit<DocumentBlock, 'id'> {
  return {
    type: 'image',
    content: {
      src,
      alt,
      width: 'auto',
      height: 'auto'
    }
  };
}

export function createTableBlock(rows: number, cols: number): Omit<DocumentBlock, 'id'> {
  return {
    type: 'table',
    content: {
      rows,
      cols,
      data: Array(rows).fill(null).map(() => Array(cols).fill(''))
    }
  };
}

export function exportToHTML(document: Document): string {
  const { blocks, settings } = document.content;
  
  const styles = `
    <style>
      body { 
        font-family: ${settings.defaultFont}; 
        line-height: ${settings.lineSpacing};
        max-width: 8.5in;
        margin: 0 auto;
        padding: ${settings.margins.top}in ${settings.margins.right}in ${settings.margins.bottom}in ${settings.margins.left}in;
      }
      h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
      h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
      h3 { font-size: 1.2em; font-weight: bold; margin-bottom: 0.5em; }
      p { margin-bottom: 1em; }
      table { width: 100%; border-collapse: collapse; margin: 1em 0; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background-color: #f5f5f5; }
      img { max-width: 100%; height: auto; }
      hr { margin: 2em 0; border: none; border-top: 1px solid #ccc; }
    </style>
  `;

  const content = blocks.map(block => {
    switch (block.type) {
      case 'heading':
        const level = block.content.level || 1;
        return `<h${level}>${block.content.text || block.content}</h${level}>`;
      case 'paragraph':
        return `<p>${block.content}</p>`;
      case 'image':
        return `<img src="${block.content.src}" alt="${block.content.alt}" />`;
      case 'table':
        const tableRows = Array(block.content.rows).fill(null).map((_, rowIndex) => {
          const cells = Array(block.content.cols).fill(null).map((_, colIndex) => {
            const cellContent = block.content.data?.[rowIndex]?.[colIndex] || '';
            return `<td>${cellContent}</td>`;
          }).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `<table>${tableRows}</table>`;
      case 'divider':
        return '<hr />';
      default:
        return '';
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${document.title}</title>
  ${styles}
</head>
<body>
  ${content}
</body>
</html>`;
}

export function exportToJSON(document: Document): string {
  return JSON.stringify(document, null, 2);
}
