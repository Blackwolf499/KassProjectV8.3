import { APIError } from '../../errors';

export async function uploadFileToServer(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Failed to parse error response' };
      }

      throw new APIError(
        errorData.message || `Upload failed with status ${response.status}`,
        response.status,
        {
          fileName: file.name,
          fileSize: file.size,
          originalError: errorData,
          timestamp: new Date().toISOString()
        }
      );
    }

    const data = await response.json();
    
    if (!data.success || !data.fileId) {
      throw new APIError(
        'Invalid server response',
        500,
        {
          fileName: file.name,
          fileSize: file.size,
          originalError: data
        }
      );
    }

    return data.fileId;
  } catch (error) {
    console.error('File upload failed:', {
      fileName: file.name,
      fileSize: file.size,
      error,
      timestamp: new Date().toISOString()
    });

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      'Failed to upload file to server',
      500,
      {
        originalError: error,
        fileName: file.name,
        fileSize: file.size
      }
    );
  }
}