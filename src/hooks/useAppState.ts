import { useReducer, useCallback } from 'react';

export interface AppState {
  uploadedImage: UploadedImage | null;
  processedImage: string | null;
  isProcessing: boolean;
  processingStep: ProcessingStep;
  error: string | null;
  faceDetectionResult: FaceDetectionResult | null;
  segmentationResult: SegmentationResult | null;
}

export interface FaceDetectionResult {
  hasFace: boolean;
  faceCount: number;
  faces: Array<{
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    confidence: number;
  }>;
}

export interface SegmentationResult {
  mask: string;
  segmentedImage: string;
  processingTime: number;
}

export type ProcessingStep =
  | 'idle'
  | 'uploading'
  | 'face_detection'
  | 'validation'
  | 'segmentation'
  | 'generation'
  | 'complete';

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  originalSize: { width: number; height: number };
}

type AppAction =
  | { type: 'SET_UPLOADED_IMAGE'; payload: UploadedImage }
  | { type: 'SET_PROCESSED_IMAGE'; payload: string }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_PROCESSING_STEP'; payload: ProcessingStep }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FACE_DETECTION_RESULT'; payload: FaceDetectionResult }
  | { type: 'SET_SEGMENTATION_RESULT'; payload: SegmentationResult }
  | { type: 'RESET' };

const initialState: AppState = {
  uploadedImage: null,
  processedImage: null,
  isProcessing: false,
  processingStep: 'idle',
  error: null,
  faceDetectionResult: null,
  segmentationResult: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_UPLOADED_IMAGE':
      return {
        ...state,
        uploadedImage: action.payload,
        processedImage: null,
        error: null,
        processingStep: 'idle',
        faceDetectionResult: null,
        segmentationResult: null,
      };
    case 'SET_PROCESSED_IMAGE':
      return {
        ...state,
        processedImage: action.payload,
        isProcessing: false,
        processingStep: 'complete',
        error: null,
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      };
    case 'SET_PROCESSING_STEP':
      return {
        ...state,
        processingStep: action.payload,
        isProcessing: action.payload !== 'idle' && action.payload !== 'complete',
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isProcessing: false,
        processingStep: 'idle',
      };
    case 'SET_FACE_DETECTION_RESULT':
      return {
        ...state,
        faceDetectionResult: action.payload,
      };
    case 'SET_SEGMENTATION_RESULT':
      return {
        ...state,
        segmentationResult: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

/**
 * 自定义Hook：应用状态管理
 */
export const useAppState = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setUploadedImage = useCallback((image: UploadedImage) => {
    dispatch({ type: 'SET_UPLOADED_IMAGE', payload: image });
  }, []);

  const setProcessedImage = useCallback((url: string) => {
    dispatch({ type: 'SET_PROCESSED_IMAGE', payload: url });
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    dispatch({ type: 'SET_PROCESSING', payload: isProcessing });
  }, []);

  const setProcessingStep = useCallback((step: ProcessingStep) => {
    dispatch({ type: 'SET_PROCESSING_STEP', payload: step });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setFaceDetectionResult = useCallback((result: FaceDetectionResult) => {
    dispatch({ type: 'SET_FACE_DETECTION_RESULT', payload: result });
  }, []);

  const setSegmentationResult = useCallback((result: SegmentationResult) => {
    dispatch({ type: 'SET_SEGMENTATION_RESULT', payload: result });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    actions: {
      setUploadedImage,
      setProcessedImage,
      setProcessing,
      setProcessingStep,
      setError,
      setFaceDetectionResult,
      setSegmentationResult,
      reset,
    },
  };
};
