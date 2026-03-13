import React, { useRef } from 'react';
import { Type, Image as ImageIcon, Download, Trash2, Upload } from 'lucide-react';
import { CanvasElement, TextElement } from '../types';

interface SidebarProps {
  onBgUpload: (src: string) => void;
  onAddText: () => void;
  onAddImage: (src: string) => void;
  onExport: () => void;
  selectedElement: CanvasElement | null;
  onUpdateElement: (el: CanvasElement) => void;
  onDeleteElement: (id: string) => void;
}

export default function Sidebar({
  onBgUpload,
  onAddText,
  onAddImage,
  onExport,
  selectedElement,
  onUpdateElement,
  onDeleteElement,
}: SidebarProps) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onBgUpload(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAddImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm z-10">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Image Editor</h1>
        <p className="text-sm text-gray-500 mt-1">Simple pure frontend editor</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-8">
        {/* Global Actions */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Canvas</h2>
          
          <button
            onClick={() => bgInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 px-4 rounded-xl transition-colors text-sm font-medium"
          >
            <Upload size={18} />
            Upload Background
          </button>
          <input
            type="file"
            accept="image/*"
            ref={bgInputRef}
            onChange={handleBgUpload}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onAddText}
              className="flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-4 rounded-xl transition-colors border border-gray-200"
            >
              <Type size={20} />
              <span className="text-xs font-medium">Add Text</span>
            </button>
            <button
              onClick={() => imgInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-4 rounded-xl transition-colors border border-gray-200"
            >
              <ImageIcon size={20} />
              <span className="text-xs font-medium">Add Image</span>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={imgInputRef}
              onChange={handleImgUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Properties Panel */}
        {selectedElement && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Properties</h2>
              <button
                onClick={() => onDeleteElement(selectedElement.id)}
                className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                title="Delete Element"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {selectedElement.type === 'text' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Text Content</label>
                  <textarea
                    value={(selectedElement as TextElement).text}
                    onChange={(e) =>
                      onUpdateElement({ ...selectedElement, text: e.target.value } as TextElement)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Font Size</label>
                  <input
                    type="number"
                    value={(selectedElement as TextElement).fontSize}
                    onChange={(e) =>
                      onUpdateElement({
                        ...selectedElement,
                        fontSize: parseInt(e.target.value) || 12,
                      } as TextElement)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Font Family</label>
                  <select
                    value={(selectedElement as TextElement).fontFamily || 'SimSun'}
                    onChange={(e) =>
                      onUpdateElement({ ...selectedElement, fontFamily: e.target.value } as TextElement)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="'Ma Shan Zheng', cursive">粗体新中式书法 (Ma Shan Zheng)</option>
                    <option value="'SimSun', 'Songti SC', serif">宋体 (SimSun)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Color</label>
                  <div className="flex items-center gap-3">
                    {[
                      { label: 'Dark Red', value: '#8B0000' },
                      { label: 'Dark Brown', value: '#5D4037' },
                      { label: 'Black', value: '#000000' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => onUpdateElement({ ...selectedElement, fill: color.value } as TextElement)}
                        className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all ${
                          (selectedElement as TextElement).fill === color.value
                            ? 'border-indigo-500 scale-110'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedElement.type === 'image' && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                Use the handles on the canvas to resize and rotate the image.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100">
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl transition-colors font-medium shadow-sm"
        >
          <Download size={18} />
          Export Image
        </button>
      </div>
    </div>
  );
}
