import { fileStorage } from './fileStorage';
import { splitPDFIntoPages } from './pdfSplitter';
import { processFullDocument, processIndividualPages } from './pdfProcessor';
import { processLocalDocument } from './localProcessor';

export interface BatchProcessingOptions {
  mode: 'full' | 'pages';
  engine: 'local' | 'openai';
  onProgress?: (fileIndex: number, progress: number) => void;
  onFileComplete?: (fileIndex: number, results: any) => void;
  onError?: (fileIndex: number, error: Error) => void;
}

export async function processBatch(
  files: File[],
  options: BatchProcessingOptions
): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      
      // Store original file
      const storedFile = await fileStorage.storeFile(file, { type: 'original' });
      
      if (options.mode === 'pages') {
        // Split PDF into individual pages
        const { pages, pageCount } = await splitPDFIntoPages(file);
        
        // Store individual pages
        const storedPages = await Promise.all(
          pages.map((page, pageIndex) => 
            fileStorage.storeFile(page, {
              type: 'split',
              pageNumber: pageIndex + 1,
              totalPages: pageCount
            })
          )
        );

        // Process each page based on selected engine
        for (let j = 0; j < pages.length; j++) {
          const progress = (j / pages.length) * 100;
          options.onProgress?.(i, progress);

          const analysis = options.engine === 'openai'
            ? await processIndividualPages(pages[j], (p) => {
                options.onProgress?.(i, progress + (p / pages.length));
              })
            : await processLocalDocument(pages[j], (p) => {
                options.onProgress?.(i, progress + (p / pages.length));
              });

          await fileStorage.storeAnalysis(analysis, {
            fileId: storedFile.id,
            type: 'page',
            pageNumber: j + 1
          });
        }
      } else {
        // Process full document based on selected engine
        const analysis = options.engine === 'openai'
          ? await processFullDocument(file, (progress) => {
              options.onProgress?.(i, progress);
            })
          : await processLocalDocument(file, (progress) => {
              options.onProgress?.(i, progress);
            });

        await fileStorage.storeAnalysis(analysis, {
          fileId: storedFile.id,
          type: 'full'
        });

        options.onFileComplete?.(i, analysis);
      }
    } catch (error) {
      options.onError?.(i, error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}