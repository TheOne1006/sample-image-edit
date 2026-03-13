import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import useImage from 'use-image';
import { CanvasElement, TextElement, ImageElement } from '../types';

interface CanvasEditorProps {
  bgImageSrc: string | null;
  elements: CanvasElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (newAttrs: CanvasElement) => void;
  stageRef: React.RefObject<any>;
}

const URLImage = ({ element, isSelected, onSelect, onChange }: any) => {
  const [image] = useImage(element.src);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaImage
        image={image}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...element}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...element,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          onChange({
            ...element,
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const EditableText = ({ element, isSelected, onSelect, onChange }: any) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...element}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...element,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          onChange({
            ...element,
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default function CanvasEditor({
  bgImageSrc,
  elements,
  selectedId,
  onSelect,
  onChange,
  stageRef,
}: CanvasEditorProps) {
  const [bgImage] = useImage(bgImageSrc || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && bgImage) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        const scale = Math.min(
          containerWidth / bgImage.width,
          containerHeight / bgImage.height
        );

        setDimensions({
          width: bgImage.width * scale,
          height: bgImage.height * scale,
          scale: scale,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [bgImage]);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'bgImage';
    if (clickedOnEmpty) {
      onSelect(null);
    }
  };

  if (!bgImageSrc) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl m-4">
        <p className="text-gray-500">Please upload a background image to start editing.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-50 p-4" ref={containerRef}>
      {bgImage && dimensions.width > 0 && (
        <div className="shadow-lg border border-gray-200 bg-white" style={{ width: dimensions.width, height: dimensions.height }}>
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            scaleX={dimensions.scale}
            scaleY={dimensions.scale}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            ref={stageRef}
          >
            <Layer>
              <KonvaImage image={bgImage} name="bgImage" />
              {elements.map((el) => {
                if (el.type === 'text') {
                  return (
                    <EditableText
                      key={el.id}
                      element={el as TextElement}
                      isSelected={el.id === selectedId}
                      onSelect={() => onSelect(el.id)}
                      onChange={onChange}
                    />
                  );
                } else if (el.type === 'image') {
                  return (
                    <URLImage
                      key={el.id}
                      element={el as ImageElement}
                      isSelected={el.id === selectedId}
                      onSelect={() => onSelect(el.id)}
                      onChange={onChange}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  );
}
