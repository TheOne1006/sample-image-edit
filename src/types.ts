export type ElementType = 'text' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle?: string;
  fill: string;
  width?: number;
  height?: number;
  scaleX: number;
  scaleY: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
}

export type CanvasElement = TextElement | ImageElement;
