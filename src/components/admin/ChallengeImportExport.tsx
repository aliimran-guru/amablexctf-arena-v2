import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAdminChallenges, useCreateChallenge } from "@/hooks/useAdminChallenges";
import { Download, Upload, FileJson, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChallengeExport {
  title: string;
  description: string;
  flag: string;
  category_slug: string;
  difficulty: string;
  scoring_type: string;
  static_points: number;
  max_points: number;
  min_points: number;
  decay_rate: number;
  is_active: boolean;
  is_hidden: boolean;
  author?: string;
  source_url?: string;
  docker_image?: string;
}

interface ChallengeImportExportProps {
  categories: Array<{ id: string; slug: string; name: string }>;
}

export function ChallengeImportExport({ categories }: ChallengeImportExportProps) {
  const { data: challenges = [] } = useAdminChallenges();
  const createChallenge = useCreateChallenge();
  
  const [importOpen, setImportOpen] = useState(false);
  const [importData, setImportData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const exportData: ChallengeExport[] = challenges.map((c) => ({
      title: c.title,
      description: c.description,
      flag: c.flag,
      category_slug: c.categories?.slug || "misc",
      difficulty: c.difficulty || "medium",
      scoring_type: c.scoring_type || "dynamic",
      static_points: c.static_points || 100,
      max_points: c.max_points,
      min_points: c.min_points,
      decay_rate: c.decay_rate || 25,
      is_active: c.is_active ?? true,
      is_hidden: c.is_hidden ?? false,
      author: c.author || undefined,
      source_url: c.source_url || undefined,
      docker_image: c.docker_image || undefined,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `challenges-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${exportData.length} challenges`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
      setImportOpen(true);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error("No data to import");
      return;
    }

    try {
      setIsImporting(true);
      const data: ChallengeExport[] = JSON.parse(importData);
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid format: expected an array of challenges");
      }

      let successCount = 0;
      let errorCount = 0;

      for (const item of data) {
        // Find category by slug
        const category = categories.find((c) => c.slug === item.category_slug);
        if (!category) {
          console.warn(`Category not found for slug: ${item.category_slug}`);
          errorCount++;
          continue;
        }

        try {
          await createChallenge.mutateAsync({
            title: item.title,
            description: item.description,
            flag: item.flag,
            category_id: category.id,
            difficulty: item.difficulty as "easy" | "medium" | "hard" | "insane",
            scoring_type: item.scoring_type || "dynamic",
            static_points: item.static_points || 100,
            max_points: item.max_points || 500,
            min_points: item.min_points || 50,
            decay_rate: item.decay_rate || 25,
            is_active: item.is_active ?? true,
            is_hidden: item.is_hidden ?? false,
            author: item.author || null,
            source_url: item.source_url || null,
            docker_image: item.docker_image || null,
            current_points: item.scoring_type === "static" ? item.static_points : item.max_points,
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to import: ${item.title}`, err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Imported ${successCount} challenges`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} challenges`);
      }

      setImportOpen(false);
      setImportData("");
    } catch (error) {
      toast.error("Invalid JSON format");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Import Challenges
            </DialogTitle>
            <DialogDescription>
              Paste JSON data or upload a file to import challenges
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder='[{"title": "Challenge 1", "flag": "CTF{...}", ...}]'
            className="min-h-[300px] font-mono text-sm"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={isImporting} className="gap-2">
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
