import { useState, useCallback } from "react";
import { Document, DocumentBlock, DocumentSettings, FormatToolbarState } from "@/types/document";
import { nanoid } from "nanoid";

const createDefaultDocument = (): Document => ({
  id: nanoid(),
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
});

export function useDocument() {
  const [document, setDocument] = useState<Document>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('current-document');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastModified: new Date(parsed.lastModified)
        };
      } catch {
        // If parsing fails, return default
        return createDefaultDocument();
      }
    }
    return createDefaultDocument();
  });

  const [currentFormat, setCurrentFormat] = useState<FormatToolbarState>({
    fontFamily: 'Georgia',
    fontSize: 16,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    color: '#1e1e1e',
    backgroundColor: 'transparent',
    alignment: 'left'
  });

  const updateDocument = useCallback((updates: Partial<Document>) => {
    setDocument(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date()
    }));
  }, []);

  const updateBlock = useCallback((blockId: string, content: any) => {
    setDocument(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: prev.content.blocks.map(block =>
          block.id === blockId ? { ...block, content } : block
        )
      },
      lastModified: new Date()
    }));
  }, []);

  const addBlock = useCallback((blockData: Omit<DocumentBlock, 'id'>) => {
    const newBlock: DocumentBlock = {
      ...blockData,
      id: nanoid()
    };

    setDocument(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: [...prev.content.blocks, newBlock]
      },
      lastModified: new Date()
    }));
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setDocument(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: prev.content.blocks.filter(block => block.id !== blockId)
      },
      lastModified: new Date()
    }));
  }, []);

  const updateSettings = useCallback((settings: Partial<DocumentSettings>) => {
    setDocument(prev => ({
      ...prev,
      content: {
        ...prev.content,
        settings: {
          ...prev.content.settings,
          ...settings
        }
      },
      lastModified: new Date()
    }));
  }, []);

  const formatSelection = useCallback((format: Partial<FormatToolbarState>) => {
    setCurrentFormat(prev => ({ ...prev, ...format }));
    
    // In a real implementation, this would apply formatting to the selected text
    console.log('Applying format:', format);
  }, []);

  return {
    document,
    updateDocument,
    updateBlock,
    addBlock,
    deleteBlock,
    updateSettings,
    formatSelection,
    currentFormat
  };
}
