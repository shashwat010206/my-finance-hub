import { useRef } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface DataActionsProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onClear: () => void;
  transactionCount: number;
}

export function DataActions({ onExport, onImport, onClear, transactionCount }: DataActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      toast({
        title: 'Data Imported! 📥',
        description: 'Your transactions have been loaded.',
      });
      e.target.value = '';
    }
  };

  const handleExport = () => {
    onExport();
    toast({
      title: 'Data Exported! 📤',
      description: 'Check your downloads folder.',
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        Import
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={transactionCount === 0}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={transactionCount === 0}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bangers text-xl">Clear All Data? 🔥</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete ALL your transactions ({transactionCount} items). This action cannot be undone!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClear();
                toast({
                  title: 'All Data Cleared! 🗑️',
                  description: 'Fresh start activated!',
                });
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, nuke it all! 💀
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
