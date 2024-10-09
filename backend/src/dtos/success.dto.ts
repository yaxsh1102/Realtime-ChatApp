export interface SuccessResponseDTO<T> {
    success: boolean;
    data?: T;
    message: string;
  }
  