import { useRef, useState } from 'react';
import { ImagePlus, Trash2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGetSosImage, useUploadSosImage } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSosImageUpload() {
  const { data: sosImage, isLoading } = useGetSosImage();
  const uploadMutation = useUploadSosImage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);
    setUploadProgress(0);

    // Validate JPEG/JPG format
    if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
      setValidationError('Only JPG/JPEG images are accepted.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate 4:3 aspect ratio
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    const ratio = img.width / img.height;
    const expected = 4 / 3;
    const tolerance = 0.05;

    if (Math.abs(ratio - expected) > tolerance) {
      setValidationError(
        `Image must have a 4:3 aspect ratio (e.g. 800×600, 1200×900). Detected: ${img.width}×${img.height}.`
      );
      URL.revokeObjectURL(objectUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPreviewUrl(objectUrl);

    // Read file as bytes and upload
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    try {
      await uploadMutation.mutateAsync({
        blob: bytes,
        onProgress: (pct) => setUploadProgress(pct),
      });
      setUploadProgress(100);
    } catch {
      setValidationError('Upload failed. Please try again.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentImageUrl = sosImage ? sosImage.getDirectURL() : null;
  const displayUrl = uploadMutation.isSuccess && previewUrl ? previewUrl : currentImageUrl;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <ImagePlus size={18} className="text-primary" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">SOS Section Image</h3>
          <p className="text-xs text-muted-foreground">JPG/JPEG · 4:3 ratio (e.g. 800×600)</p>
        </div>
      </div>

      {/* Current image preview */}
      {isLoading ? (
        <Skeleton className="w-full aspect-[4/3] rounded-xl" />
      ) : displayUrl ? (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border bg-secondary">
          <img
            src={displayUrl}
            alt="SOS section banner"
            className="w-full h-full object-cover"
          />
          {uploadMutation.isSuccess && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <CheckCircle2 size={16} />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-secondary flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImagePlus size={32} className="opacity-40" />
          <p className="text-sm">No image uploaded yet</p>
        </div>
      )}

      {/* Upload progress */}
      {uploadMutation.isPending && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Upload size={12} /> Uploading…
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Success message */}
      {uploadMutation.isSuccess && !uploadMutation.isPending && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle2 size={16} />
          <span>Image uploaded successfully!</span>
        </div>
      )}

      {/* Validation / upload error */}
      {validationError && (
        <div className="flex items-start gap-2 text-destructive text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* File input + button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex gap-2">
        <Button
          onClick={() => {
            setValidationError(null);
            uploadMutation.reset();
            fileInputRef.current?.click();
          }}
          disabled={uploadMutation.isPending}
          className="flex-1 gap-2"
          size="sm"
        >
          {uploadMutation.isPending ? (
            <>
              <Upload size={15} className="animate-bounce" />
              Uploading…
            </>
          ) : displayUrl ? (
            <>
              <Trash2 size={15} />
              Replace Image
            </>
          ) : (
            <>
              <Upload size={15} />
              Upload Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
