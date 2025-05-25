import { useEffect, useRef } from "react";
import { Document, DocumentBlock } from "@/types/document";

interface DocumentEditorProps {
  document: Document;
  onBlockUpdate: (blockId: string, content: any) => void;
  onBlockAdd: (block: Omit<DocumentBlock, 'id'>) => void;
  onBlockDelete: (blockId: string) => void;
  selectedBlockId: string | null;
  onBlockSelect: (blockId: string | null) => void;
}

export default function DocumentEditor({
  document,
  onBlockUpdate,
  onBlockAdd,
  onBlockDelete,
  selectedBlockId,
  onBlockSelect
}: DocumentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleContentChange = () => {
    if (editorRef.current) {
      // In a real implementation, this would parse the content and update blocks
      // For now, we'll simulate block updates
      console.log('Content changed');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onBlockAdd({
        type: 'paragraph',
        content: '',
        formatting: {
          fontFamily: document.content.settings.defaultFont,
          fontSize: 16,
          alignment: 'left'
        }
      });
    }
  };

  const renderBlock = (block: DocumentBlock) => {
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
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onBlockUpdate(block.id, { 
              ...block.content, 
              text: e.currentTarget.textContent 
            })}
          >
            {block.content.text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p
            key={block.id}
            style={style}
            className="mb-4 leading-relaxed"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onBlockUpdate(block.id, e.currentTarget.textContent)}
          >
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
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newData = [...(block.content.data || [])];
                          if (!newData[rowIndex]) newData[rowIndex] = [];
                          newData[rowIndex][colIndex] = e.currentTarget.textContent;
                          onBlockUpdate(block.id, { ...block.content, data: newData });
                        }}
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
    <div className="flex-1 bg-white overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
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
            <div
              ref={editorRef}
              className="editor-content rich-editor"
              onInput={handleContentChange}
              onKeyDown={handleKeyDown}
            >
              {document.content.blocks.length > 0 ? (
                document.content.blocks.map(renderBlock)
              ) : (
                <p 
                  className="text-gray-500 italic"
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={(e) => {
                    if (e.currentTarget.textContent === "Start typing your document...") {
                      e.currentTarget.textContent = "";
                      e.currentTarget.classList.remove('text-gray-500', 'italic');
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.textContent.trim()) {
                      e.currentTarget.textContent = "Start typing your document...";
                      e.currentTarget.classList.add('text-gray-500', 'italic');
                    } else {
                      onBlockAdd({
                        type: 'paragraph',
                        content: e.currentTarget.textContent,
                        formatting: {
                          fontFamily: document.content.settings.defaultFont,
                          fontSize: 16,
                          alignment: 'left'
                        }
                      });
                    }
                  }}
                >
                  Start typing your document...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
