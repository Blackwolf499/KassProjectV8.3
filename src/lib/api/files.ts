import { ServerFile } from '../../api/files';
import { StoredFile } from '../storage/TempFileStore';

const API_URL = 'http://localhost:3000/api';

export async function uploadFileToServer(file: StoredFile): Promise<ServerFile> {
  try {
    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(file),
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to server');
    }

    return response.json();
  } catch (error) {
    console.error('Server upload error:', error);
    throw new Error('Failed to upload file to server');
  }
}

export async function getServerFiles(): Promise<ServerFile[]> {
  try {
    const response = await fetch(`${API_URL}/files`);
    
    if (!response.ok) {
      throw new Error('Failed to get server files');
    }

    return response.json();
  } catch (error) {
    console.error('Get server files error:', error);
    throw new Error('Failed to get server files');
  }
}

export async function deleteServerFile(fileId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/files/${fileId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete server file');
    }
  } catch (error) {
    console.error('Delete server file error:', error);
    throw new Error('Failed to delete server file');
  }
}