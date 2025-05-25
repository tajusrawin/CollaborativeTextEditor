export interface DocumentBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'image' | 'divider';
  content: any;
  formatting?: {
    fontSize?: number;
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    color?: string;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';
  };
}

export interface DocumentSettings {
  paperSize: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  defaultFont: string;
  lineSpacing: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface Document {
  id: string;
  title: string;
  content: {
    blocks: DocumentBlock[];
    settings: DocumentSettings;
  };
  lastModified: Date;
  ownerId: string;
}

export interface FormatToolbarState {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  color: string;
  backgroundColor: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
}
