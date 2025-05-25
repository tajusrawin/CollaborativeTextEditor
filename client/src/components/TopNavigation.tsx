import { FileText, Share, Cloud } from "lucide-react";
import { Document } from "@/types/document";

interface TopNavigationProps {
  document: Document;
  onTitleChange: (title: string) => void;
  onShare: () => void;
}

export default function TopNavigation({ document, onTitleChange, onShare }: TopNavigationProps) {
  return (
    <header className="bg-white border-b border-light sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <FileText className="text-blue-600 text-xl" />
            <span className="font-medium text-sm text-gray-600">DocEditor</span>
          </div>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={document.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-lg font-normal border-none outline-none bg-transparent focus:bg-gray-50 px-2 py-1 rounded"
            />
            <div className="flex items-center space-x-4 text-xs text-gray-500 px-2">
              <span>Last edit was {new Date(document.lastModified).toLocaleString()}</span>
              <span className="flex items-center space-x-1">
                <Cloud className="w-3 h-3 text-green-500" />
                <span>All changes saved</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={onShare}
            className="bg-google-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            <Share className="w-4 h-4 mr-2 inline" />
            Share
          </button>
          <div className="w-8 h-8 bg-google-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
