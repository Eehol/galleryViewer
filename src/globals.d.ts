interface Window {
  electronAPI: {
    writeFile: (path: string, content: string) => void;
    readFile: (path: string) => string | null;
    exists: (path: string) => boolean;
    mkdir: (folderPath: string) => void;
    pathDirname: (filePath: string) => string;
  };
}
