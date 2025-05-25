import { useState } from "react";
import { Plus, FileText, Heading, Table, FileSpreadsheet, Settings, Download, Link, Mail, HardDrive } from "lucide-react";
import { Document, DocumentSettings } from "@/types/document";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: 'editor' | 'sheets' | 'settings' | 'export';
  onTabChange: (tab: 'editor' | 'sheets' | 'settings' | 'export') => void;
  document: Document;
  onSettingsChange: (settings: Partial<DocumentSettings>) => void;
  onExport: (format: 'pdf' | 'docx' | 'html' | 'json') => void;
}

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  document, 
  onSettingsChange, 
  onExport 
}: SidebarProps) {
  const tabs = [
    { id: 'editor' as const, label: 'Editor' },
    { id: 'sheets' as const, label: 'Sheets' },
    { id: 'settings' as const, label: 'Settings' },
    { id: 'export' as const, label: 'Export' }
  ];

  return (
    <div className="w-64 bg-subtle border-r border-light flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-light">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'editor' && (
          <EditorTab document={document} />
        )}
        
        {activeTab === 'sheets' && (
          <SheetsTab />
        )}
        
        {activeTab === 'settings' && (
          <SettingsTab 
            settings={document.content.settings}
            onSettingsChange={onSettingsChange}
          />
        )}
        
        {activeTab === 'export' && (
          <ExportTab onExport={onExport} />
        )}
      </div>
    </div>
  );
}

function EditorTab({ document }: { document: Document }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-gray-900">Document Structure</h3>
      <div className="space-y-2">
        {document.content.blocks.map((block) => (
          <div 
            key={block.id}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            {block.type === 'heading' && <Heading className="w-3 h-3 text-gray-400" />}
            {block.type === 'paragraph' && <FileText className="w-3 h-3 text-gray-400" />}
            {block.type === 'table' && <Table className="w-3 h-3 text-gray-400" />}
            <span className="text-sm">
              {block.type === 'heading' ? `Heading: ${String(block.content).substring(0, 30)}` :
               block.type === 'paragraph' ? `Paragraph: ${String(block.content).substring(0, 30)}` :
               block.type === 'table' ? 'Table' :
               block.type === 'image' ? 'Image' :
               'Content'}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-light pt-4">
        <h3 className="font-medium text-sm text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
            <Plus className="w-3 h-3 mr-2 inline" />Add Heading
          </button>
          <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
            <Plus className="w-3 h-3 mr-2 inline" />Add Table
          </button>
          <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
            <Plus className="w-3 h-3 mr-2 inline" />Add Page Break
          </button>
        </div>
      </div>
    </div>
  );
}

function SheetsTab() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-gray-900">Google Sheets Import</h3>
      
      <Button className="w-full bg-google-blue text-white hover:bg-blue-600">
        <Link className="w-4 h-4 mr-2" />
        Connect Google Sheets
      </Button>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-700">Available Sheets</Label>
        <div className="text-sm text-gray-500 text-center py-8">
          No sheets connected. Click above to connect your Google Sheets.
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ 
  settings, 
  onSettingsChange 
}: { 
  settings: DocumentSettings; 
  onSettingsChange: (settings: Partial<DocumentSettings>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-sm text-gray-900 mb-3">Page Settings</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-1">Paper Size</Label>
            <Select 
              value={settings.paperSize} 
              onValueChange={(value) => onSettingsChange({ paperSize: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
                <SelectItem value="A5">A5</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-1">Orientation</Label>
            <Select 
              value={settings.orientation} 
              onValueChange={(value) => onSettingsChange({ orientation: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm text-gray-900 mb-3">Typography</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-1">Default Font</Label>
            <Select 
              value={settings.defaultFont} 
              onValueChange={(value) => onSettingsChange({ defaultFont: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-1">Line Spacing</Label>
            <Select 
              value={settings.lineSpacing.toString()} 
              onValueChange={(value) => onSettingsChange({ lineSpacing: parseFloat(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">1.0</SelectItem>
                <SelectItem value="1.15">1.15</SelectItem>
                <SelectItem value="1.5">1.5</SelectItem>
                <SelectItem value="2.0">2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm text-gray-900 mb-3">Margins (inches)</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-1">Top</Label>
            <Input 
              type="number" 
              value={settings.margins.top} 
              onChange={(e) => onSettingsChange({ 
                margins: { ...settings.margins, top: parseFloat(e.target.value) }
              })}
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-1">Bottom</Label>
            <Input 
              type="number" 
              value={settings.margins.bottom} 
              onChange={(e) => onSettingsChange({ 
                margins: { ...settings.margins, bottom: parseFloat(e.target.value) }
              })}
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-1">Left</Label>
            <Input 
              type="number" 
              value={settings.margins.left} 
              onChange={(e) => onSettingsChange({ 
                margins: { ...settings.margins, left: parseFloat(e.target.value) }
              })}
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-1">Right</Label>
            <Input 
              type="number" 
              value={settings.margins.right} 
              onChange={(e) => onSettingsChange({ 
                margins: { ...settings.margins, right: parseFloat(e.target.value) }
              })}
              step="0.1"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportTab({ onExport }: { onExport: (format: 'pdf' | 'docx' | 'html' | 'json') => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm text-gray-900">Export Document</h3>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => onExport('pdf')}
        >
          <FileText className="w-4 h-4 mr-2 text-red-500" />
          Export as PDF
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => onExport('docx')}
        >
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          Export as DOCX
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => onExport('html')}
        >
          <FileText className="w-4 h-4 mr-2 text-orange-500" />
          Export as HTML
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => onExport('json')}
        >
          <FileText className="w-4 h-4 mr-2 text-green-600" />
          Export as JSON
        </Button>
      </div>

      <div className="border-t border-light pt-4">
        <h4 className="font-medium text-sm text-gray-900 mb-3">Share Options</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Mail className="w-4 h-4 mr-2 text-gray-600" />
            Share via Email
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <HardDrive className="w-4 h-4 mr-2 text-green-500" />
            Save to Google Drive
          </Button>
        </div>
      </div>
    </div>
  );
}
