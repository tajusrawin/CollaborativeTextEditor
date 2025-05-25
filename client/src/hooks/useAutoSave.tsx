import { useEffect } from "react";
import { Document } from "@/types/document";

export function useAutoSave(document: Document) {
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('current-document', JSON.stringify(document));
        console.log('Document auto-saved');
      } catch (error) {
        console.error('Failed to auto-save document:', error);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [document]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      try {
        localStorage.setItem('current-document', JSON.stringify(document));
      } catch (error) {
        console.error('Failed to save document before unload:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [document]);
}
