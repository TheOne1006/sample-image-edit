import React, { useState, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CanvasEditor from './components/CanvasEditor';
import { CanvasElement } from './types';

export default function App() {
  const [bgImageSrc, setBgImageSrc] = useState<string | null>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);

  const handleAddText = useCallback(() => {
    if (!bgImageSrc) {
      alert('Please upload a background image first.');
      return;
    }
    const newText: CanvasElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      x: 50,
      y: 50,
      text: 'Double click to edit',
      fontSize: 24,
      fontFamily: "'SimSun', 'Songti SC', serif",
      fill: '#000000',
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
    setElements([...elements, newText]);
    setSelectedId(newText.id);
  }, [bgImageSrc, elements]);

  const handleAddImage = useCallback((src: string) => {
    if (!bgImageSrc) {
      alert('Please upload a background image first.');
      return;
    }
    const newImage: CanvasElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'image',
      x: 50,
      y: 50,
      src,
      width: 200,
      height: 200,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
    setElements([...elements, newImage]);
    setSelectedId(newImage.id);
  }, [bgImageSrc, elements]);

  const handleUpdateElement = useCallback((updatedElement: CanvasElement) => {
    setElements(elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)));
  }, [elements]);

  const handleDeleteElement = useCallback((id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }, [elements, selectedId]);

  const handleExport = useCallback(() => {
    if (!stageRef.current || !bgImageSrc) return;
    
    // Deselect everything before export
    setSelectedId(null);
    
    // Wait for the next tick so the transformer disappears
    setTimeout(() => {
      const uri = stageRef.current.toDataURL({ pixelRatio: 1 / stageRef.current.scaleX() });
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 100);
  }, [bgImageSrc]);

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      <Sidebar
        onBgUpload={setBgImageSrc}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onExport={handleExport}
        selectedElement={elements.find((el) => el.id === selectedId) || null}
        onUpdateElement={handleUpdateElement}
        onDeleteElement={handleDeleteElement}
      />
      <CanvasEditor
        bgImageSrc={bgImageSrc}
        elements={elements}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onChange={handleUpdateElement}
        stageRef={stageRef}
      />
    </div>
  );
}
