export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PresetDto {
  _id: string;
  title: string;
  description: string;
  processorType: string;
  tags: string[];
  price: number;
  previewAudioUrl: string;
  presetFileUrl?: string | null;
  coverImageUrl: string;
  isPublished: boolean;
}

export interface CartDto {
  userId: string;
  items: CartItemDto[];
}

export interface CartItemDto {
  presetId: string;
  price: number;
  addedAt: Date;
}