import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Image,
  Table,
  Link,
  Minus,
  Palette,
  Highlighter
} from "lucide-react";
import { FormatToolbarState } from "@/types/document";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormatToolbarProps {
  currentFormat: FormatToolbarState;
  onFormat: (format: Partial<FormatToolbarState>) => void;
  onInsertImage: () => void;
  onInsertTable: () => void;
  onInsertDivider: () => void;
}

export default function FormatToolbar({ 
  currentFormat, 
  onFormat, 
  onInsertImage, 
  onInsertTable,
  onInsertDivider 
}: FormatToolbarProps) {
  const fontFamilies = ['Georgia', 'Arial', 'Times New Roman', 'Helvetica', 'Verdana'];
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  return (
    <div className="bg-subtle border-b border-light sticky top-16 z-40">
      <div className="px-4 py-3">
        <div className="flex items-center space-x-6 overflow-x-auto">
          {/* Font and Size Controls */}
          <div className="flex items-center space-x-2">
            <Select 
              value={currentFormat.fontFamily} 
              onValueChange={(value) => onFormat({ fontFamily: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(font => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={currentFormat.fontSize.toString()} 
              onValueChange={(value) => onFormat({ fontSize: parseInt(value) })}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center space-x-1">
            <button 
              className={`toolbar-button ${currentFormat.bold ? 'active' : ''}`}
              onClick={() => onFormat({ bold: !currentFormat.bold })}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              className={`toolbar-button ${currentFormat.italic ? 'active' : ''}`}
              onClick={() => onFormat({ italic: !currentFormat.italic })}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              className={`toolbar-button ${currentFormat.underline ? 'active' : ''}`}
              onClick={() => onFormat({ underline: !currentFormat.underline })}
            >
              <Underline className="w-4 h-4" />
            </button>
            <button 
              className={`toolbar-button ${currentFormat.strikethrough ? 'active' : ''}`}
              onClick={() => onFormat({ strikethrough: !currentFormat.strikethrough })}
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Text Color and Highlight */}
          <div className="flex items-center space-x-1">
            <button className="toolbar-button relative">
              <Palette className="w-4 h-4" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-500 rounded"></div>
            </button>
            <button className="toolbar-button relative">
              <Highlighter className="w-4 h-4" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-yellow-400 rounded"></div>
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Alignment */}
          <div className="flex items-center space-x-1">
            <button 
              className={`toolbar-button ${currentFormat.alignment === 'left' ? 'active' : ''}`}
              onClick={() => onFormat({ alignment: 'left' })}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              className={`toolbar-button ${currentFormat.alignment === 'center' ? 'active' : ''}`}
              onClick={() => onFormat({ alignment: 'center' })}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              className={`toolbar-button ${currentFormat.alignment === 'right' ? 'active' : ''}`}
              onClick={() => onFormat({ alignment: 'right' })}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button 
              className={`toolbar-button ${currentFormat.alignment === 'justify' ? 'active' : ''}`}
              onClick={() => onFormat({ alignment: 'justify' })}
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Lists and Indentation */}
          <div className="flex items-center space-x-1">
            <button className="toolbar-button">
              <List className="w-4 h-4" />
            </button>
            <button className="toolbar-button">
              <ListOrdered className="w-4 h-4" />
            </button>
            <button className="toolbar-button">
              <Outdent className="w-4 h-4" />
            </button>
            <button className="toolbar-button">
              <Indent className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Insert Elements */}
          <div className="flex items-center space-x-1">
            <button className="toolbar-button" onClick={onInsertImage}>
              <Image className="w-4 h-4" />
            </button>
            <button className="toolbar-button" onClick={onInsertTable}>
              <Table className="w-4 h-4" />
            </button>
            <button className="toolbar-button">
              <Link className="w-4 h-4" />
            </button>
            <button className="toolbar-button" onClick={onInsertDivider}>
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
