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
  coverImageUrl: string;
  isPublished: boolean;
}
