import { useState } from "react";
import { X, Copy, Mail } from "lucide-react";
import { Document } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShareModalProps {
  document: Document;
  onClose: () => void;
}

export default function ShareModal({ document, onClose }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [shareLink] = useState(`https://doceditor.app/doc/${document.id}`);

  const handleSendInvite = () => {
    if (email) {
      console.log(`Sending invite to ${email}`);
      // In a real implementation, this would send an email invitation
      setEmail("");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    console.log("Link copied to clipboard");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Share Document</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Share with specific people
              </Label>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Enter email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendInvite}
                  className="bg-google-blue hover:bg-blue-600"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Or get shareable link
              </Label>
              <div className="flex space-x-2">
                <Input 
                  type="text" 
                  value={shareLink} 
                  readOnly
                  className="flex-1 bg-gray-50"
                />
                <Button 
                  onClick={handleCopyLink}
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
