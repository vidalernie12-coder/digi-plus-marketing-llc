import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Get project root directory */
export const getProjectRootDir = (): string => {
  const mode = import.meta.env.MODE;
  return mode === 'production' ? path.join(__dirname, '../') : path.join(__dirname, '../../');
};

const __srcFolder = path.join(getProjectRootDir(), '/src');

/** Get relative URL by file path */
export const getRelativeUrlByFilePath = (filepath: string): string => {
  return filepath.replace(__srcFolder, '');
};
