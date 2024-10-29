export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const textDecoder = new TextDecoder('utf-8');
        const text = textDecoder.decode(arrayBuffer);
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to extract text from PDF'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };

    reader.readAsArrayBuffer(file);
  });
}