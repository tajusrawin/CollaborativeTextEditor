import { Sun, RotateCcw } from "lucide-react";
import { Document } from "@/types/document";

interface LivePreviewProps {
  document: Document;
  isDarkMode: boolean;
}

export default function LivePreview({ document, isDarkMode }: LivePreviewProps) {
  const renderPreviewBlock = (block: any) => {
    const style = {
      fontFamily: block.formatting?.fontFamily || document.content.settings.defaultFont,
      fontSize: `${block.formatting?.fontSize || 16}px`,
      fontWeight: block.formatting?.bold ? 'bold' : 'normal',
      fontStyle: block.formatting?.italic ? 'italic' : 'normal',
      textDecoration: [
        block.formatting?.underline ? 'underline' : '',
        block.formatting?.strikethrough ? 'line-through' : ''
      ].filter(Boolean).join(' ') || 'none',
      color: block.formatting?.color || '#1e1e1e',
      backgroundColor: block.formatting?.backgroundColor || 'transparent',
      textAlign: block.formatting?.alignment || 'left',
      lineHeight: document.content.settings.lineSpacing
    } as React.CSSProperties;

    switch (block.type) {
      case 'heading':
        const level = block.content.level || 1;
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={block.id}
            style={style}
            className={`mb-4 ${level === 1 ? 'text-3xl font-bold' : 
                           level === 2 ? 'text-2xl font-semibold' : 
                           'text-xl font-semibold'}`}
          >
            {block.content.text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p key={block.id} style={style} className="mb-4 leading-relaxed">
            {block.content}
          </p>
        );

      case 'image':
        return (
          <div key={block.id} className="my-8 text-center">
            <img
              src={block.content.src}
              alt={block.content.alt}
              className="rounded-lg shadow-md max-w-full mx-auto"
              style={{
                width: block.content.width === 'auto' ? 'auto' : block.content.width,
                height: block.content.height === 'auto' ? 'auto' : block.content.height
              }}
            />
          </div>
        );

      case 'table':
        return (
          <div key={block.id} className="my-8 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {Array(block.content.rows).fill(null).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array(block.content.cols).fill(null).map((_, colIndex) => (
                      <td 
                        key={colIndex}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {block.content.data?.[rowIndex]?.[colIndex] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'divider':
        return <hr key={block.id} className="my-8 border-gray-300" />;

      default:
        return null;
    }
  };

  return (
    <div className="w-2/5 bg-gray-50 border-l border-light overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-light p-4 z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm text-gray-900">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <Sun className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="preview-content">
          <div 
            className="document-page"
            style={{
              fontFamily: document.content.settings.defaultFont,
              lineHeight: document.content.settings.lineSpacing
            }}
          >
            <div 
              className="document-content"
              style={{
                paddingTop: `${document.content.settings.margins.top}in`,
                paddingBottom: `${document.content.settings.margins.bottom}in`,
                paddingLeft: `${document.content.settings.margins.left}in`,
                paddingRight: `${document.content.settings.margins.right}in`
              }}
            >
              <div className="rich-editor">
                {document.content.blocks.length > 0 ? (
                  document.content.blocks.map(renderPreviewBlock)
                ) : (
                  <p className="text-gray-400 italic">
                    Start typing to see your document preview here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
