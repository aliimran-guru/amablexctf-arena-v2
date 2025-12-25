import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, File, FileArchive, FileCode, FileImage, FileText } from "lucide-react";

interface ChallengeFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
}

interface ChallengeFilesListProps {
  files: ChallengeFile[];
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  
  if (["zip", "tar", "gz", "rar", "7z"].includes(ext ?? "")) {
    return <FileArchive className="h-5 w-5" />;
  }
  if (["py", "js", "ts", "c", "cpp", "go", "rs", "java", "php"].includes(ext ?? "")) {
    return <FileCode className="h-5 w-5" />;
  }
  if (["png", "jpg", "jpeg", "gif", "bmp", "svg"].includes(ext ?? "")) {
    return <FileImage className="h-5 w-5" />;
  }
  if (["txt", "md", "pdf", "doc", "docx"].includes(ext ?? "")) {
    return <FileText className="h-5 w-5" />;
  }
  
  return <File className="h-5 w-5" />;
}

function formatFileSize(bytes: number | null) {
  if (bytes === null) return "Unknown size";
  
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function ChallengeFilesList({ files }: ChallengeFilesListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="h-5 w-5" />
          Files
        </CardTitle>
        <CardDescription>
          Download the challenge files to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(file.file_name)}
              <div>
                <p className="font-medium text-sm">{file.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.file_size)}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={file.file_url} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
