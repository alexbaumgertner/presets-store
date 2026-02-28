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
  previewVideoUrl?: string;
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
  addedAt?: string;
  title?: string;
  description?: string;
  processorType?: string;
  previewAudioUrl?: string;
  previewVideoUrl?: string;
  coverImageUrl?: string;
  authorId?: string;
}

export interface ReviewDto {
  _id: string;
  presetId: string;
  userId: string;
  userName?: string | null;
  userImage?: string | null;
  score: number;
  comment?: string | null;
  createdAt: string;
}