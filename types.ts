
export interface QualityOption {
  id: string;
  label: string;
  resolution: string;
  size: string;
  isAudio?: boolean;
}

export interface VideoInfo {
  title: string;
  creator: string;
  duration: string;
  thumbnail: string;
  qualities: QualityOption[];
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  data: VideoInfo;
}
