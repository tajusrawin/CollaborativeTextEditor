import { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import FormatToolbar from "@/components/FormatToolbar";
import Sidebar from "@/components/Sidebar";
import DocumentEditor from "@/components/DocumentEditor";
import LivePreview from "@/components/LivePreview";
import ShareModal from "@/components/ShareModal";
import { useDocument } from "@/hooks/useDocument";
import { useAutoSave } from "@/hooks/useAutoSave";

export default function Editor() {
  const [activeTab, setActiveTab] = useState<'editor' | 'sheets' | 'settings' | 'export'>('editor');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  const {
    document,
    updateDocument,
    updateBlock,
    addBlock,
    deleteBlock,
    updateSettings,
    formatSelection,
    currentFormat
  } = useDocument();

  useAutoSave(document);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <TopNavigation 
        document={document}
        onTitleChange={(title) => updateDocument({ title })}
        onShare={() => setShowShareModal(true)}
      />
      
      <FormatToolbar 
        currentFormat={currentFormat}
        onFormat={formatSelection}
        onInsertImage={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                addBlock({
                  type: 'image',
                  content: {
                    src: reader.result,
                    alt: file.name,
                    width: 'auto',
                    height: 'auto'
                  }
                });
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
        }}
        onInsertTable={() => {
          addBlock({
            type: 'table',
            content: {
              rows: 3,
              cols: 3,
              data: Array(3).fill(null).map(() => Array(3).fill(''))
            }
          });
        }}
        onInsertDivider={() => {
          addBlock({
            type: 'divider',
            content: {}
          });
        }}
      />

      <div className="flex h-screen" style={{ height: 'calc(100vh - 120px)' }}>
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          document={document}
          onSettingsChange={updateSettings}
          onExport={(format) => {
            // Export functionality will be implemented in exportUtils
            console.log(`Exporting as ${format}`);
          }}
        />

        <div className="flex-1 flex">
          <DocumentEditor 
            document={document}
            onBlockUpdate={updateBlock}
            onBlockAdd={addBlock}
            onBlockDelete={deleteBlock}
            selectedBlockId={selectedBlockId}
            onBlockSelect={setSelectedBlockId}
          />

          <LivePreview 
            document={document}
            isDarkMode={false}
          />
        </div>
      </div>

      {showShareModal && (
        <ShareModal 
          document={document}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
