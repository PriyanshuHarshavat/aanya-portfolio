'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Video, Check, X, Trash2, RefreshCw, FolderOpen, Scissors, BookOpen, FileArchive, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import * as pdfjsLib from 'pdfjs-dist';

interface UploadedFile {
  name: string;
  path: string;
  type: 'image' | 'video';
  preview?: string;
}

interface UploadSlot {
  id: string;
  label: string;
  description: string;
  filename: string;
}

interface PendingFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
  compressing?: boolean;
  compressed?: boolean;
  originalSize?: number;
  compressedSize?: number;
}

const uploadSlots: UploadSlot[] = [
  {
    id: 'headshot',
    label: 'Headshot',
    description: 'Main hero photo (circular)',
    filename: 'headshot.jpg',
  },
  {
    id: 'about-photo',
    label: 'About Photo',
    description: 'Photo for About section',
    filename: 'about-photo.jpg',
  },
  {
    id: 'book-cover',
    label: 'Book Cover',
    description: 'Cover image or PDF (auto-converts)',
    filename: 'book-cover.jpg',
  },
];

// Initialize PDF.js worker from local file
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

// Convert PDF first page to image
async function pdfToImage(file: File): Promise<{ file: File; preview: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const scale = 2; // Higher scale = better quality
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95);
  });

  const imageFile = new File([blob], file.name.replace('.pdf', '.jpg'), { type: 'image/jpeg' });
  const preview = URL.createObjectURL(blob);

  return { file: imageFile, preview };
}

export default function AdminPage() {
  const [uploads, setUploads] = useState<Record<string, { file?: File; preview?: string; status: 'idle' | 'uploading' | 'success' | 'error'; converting?: boolean }>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<UploadedFile[]>([]);
  const [generalFiles, setGeneralFiles] = useState<PendingFile[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();

    ffmpeg.on('progress', ({ progress }) => {
      setCompressionProgress(Math.round(progress * 100));
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegRef.current = ffmpeg;
    setFfmpegLoaded(true);
    return ffmpeg;
  };

  const compressVideo = async (index: number) => {
    const fileData = generalFiles[index];
    if (!fileData || fileData.type !== 'video') return;

    setGeneralFiles(prev => prev.map((f, i) =>
      i === index ? { ...f, compressing: true, originalSize: f.file.size } : f
    ));
    setCompressing(true);
    setCompressionProgress(0);

    try {
      const ffmpeg = await loadFFmpeg();

      const inputName = 'input' + fileData.file.name.substring(fileData.file.name.lastIndexOf('.'));
      const outputName = 'output.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(fileData.file));

      // Compress with good quality but smaller size
      await ffmpeg.exec([
        '-i', inputName,
        '-c:v', 'libx264',
        '-crf', '28',
        '-preset', 'fast',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-vf', 'scale=-2:720',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: 'video/mp4' });
      const compressedFile = new File([blob], fileData.file.name.replace(/\.[^/.]+$/, '.mp4'), { type: 'video/mp4' });

      // Clean up
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      setGeneralFiles(prev => prev.map((f, i) =>
        i === index ? {
          ...f,
          file: compressedFile,
          compressing: false,
          compressed: true,
          compressedSize: compressedFile.size
        } : f
      ));
    } catch (error) {
      console.error('Compression failed:', error);
      setGeneralFiles(prev => prev.map((f, i) =>
        i === index ? { ...f, compressing: false } : f
      ));
    } finally {
      setCompressing(false);
      setCompressionProgress(0);
    }
  };

  const compressAllVideos = async () => {
    const videoIndices = generalFiles
      .map((f, i) => f.type === 'video' && !f.compressed ? i : -1)
      .filter(i => i !== -1);

    for (const index of videoIndices) {
      await compressVideo(index);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDrop = useCallback(async (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOver(null);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Handle PDF files (convert to image)
    if (file.type === 'application/pdf') {
      setUploads((prev) => ({
        ...prev,
        [slotId]: { status: 'idle', converting: true },
      }));
      try {
        const { file: imageFile, preview } = await pdfToImage(file);
        setUploads((prev) => ({
          ...prev,
          [slotId]: { file: imageFile, preview, status: 'idle', converting: false },
        }));
      } catch (err) {
        console.error('PDF conversion failed:', err);
        setUploads((prev) => ({
          ...prev,
          [slotId]: { status: 'error', converting: false },
        }));
      }
      return;
    }

    // Handle image files
    if (file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      setUploads((prev) => ({
        ...prev,
        [slotId]: { file, preview, status: 'idle' },
      }));
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, slotId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Handle PDF files (convert to image)
    if (file.type === 'application/pdf') {
      setUploads((prev) => ({
        ...prev,
        [slotId]: { status: 'idle', converting: true },
      }));
      try {
        const { file: imageFile, preview } = await pdfToImage(file);
        setUploads((prev) => ({
          ...prev,
          [slotId]: { file: imageFile, preview, status: 'idle', converting: false },
        }));
      } catch (err) {
        console.error('PDF conversion failed:', err);
        setUploads((prev) => ({
          ...prev,
          [slotId]: { status: 'error', converting: false },
        }));
      }
      return;
    }

    // Handle image files
    if (file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      setUploads((prev) => ({
        ...prev,
        [slotId]: { file, preview, status: 'idle' },
      }));
    }
  };

  const handleGeneralFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: PendingFile[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
    }));

    setGeneralFiles((prev) => [...prev, ...newFiles]);
  };

  const handleGeneralDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);

    const files = e.dataTransfer.files;
    const newFiles: PendingFile[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
      }));

    setGeneralFiles((prev) => [...prev, ...newFiles]);
  };

  const uploadFile = async (slotId: string, filename: string) => {
    const upload = uploads[slotId];
    if (!upload?.file) return;

    setUploads((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], status: 'uploading' },
    }));

    try {
      const formData = new FormData();
      formData.append('file', upload.file);
      formData.append('filename', filename);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploads((prev) => ({
          ...prev,
          [slotId]: { ...prev[slotId], status: 'success' },
        }));
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      setUploads((prev) => ({
        ...prev,
        [slotId]: { ...prev[slotId], status: 'error' },
      }));
    }
  };

  const uploadGeneralFile = async (index: number) => {
    const fileData = generalFiles[index];
    if (!fileData) return;

    try {
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('filename', fileData.file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMediaLibrary((prev) => [
          ...prev,
          {
            name: fileData.file.name,
            path: data.path,
            type: fileData.type,
            preview: fileData.preview,
          },
        ]);
        setGeneralFiles((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const uploadAllGeneral = async () => {
    for (let i = generalFiles.length - 1; i >= 0; i--) {
      await uploadGeneralFile(i);
    }
  };

  const clearUpload = (slotId: string) => {
    setUploads((prev) => {
      const newUploads = { ...prev };
      if (newUploads[slotId]?.preview) {
        URL.revokeObjectURL(newUploads[slotId].preview!);
      }
      delete newUploads[slotId];
      return newUploads;
    });
  };

  const removeGeneralFile = (index: number) => {
    setGeneralFiles((prev) => {
      const file = prev[index];
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const hasUncompressedVideos = generalFiles.some(f => f.type === 'video' && !f.compressed);

  // Flipbook upload state
  const [flipbookFile, setFlipbookFile] = useState<File | null>(null);
  const [flipbookStatus, setFlipbookStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [flipbookError, setFlipbookError] = useState<string>('');

  const handleFlipbookSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setFlipbookFile(file);
      setFlipbookStatus('idle');
      setFlipbookError('');
    } else {
      setFlipbookError('Please select a .zip file');
    }
  };

  const handleFlipbookDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      setFlipbookFile(file);
      setFlipbookStatus('idle');
      setFlipbookError('');
    } else {
      setFlipbookError('Please drop a .zip file');
    }
  };

  const uploadFlipbook = async () => {
    if (!flipbookFile) return;

    setFlipbookStatus('uploading');
    setFlipbookError('');

    try {
      const formData = new FormData();
      formData.append('file', flipbookFile);

      const response = await fetch('/api/upload-flipbook', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFlipbookStatus('success');
        setFlipbookFile(null);
      } else {
        setFlipbookStatus('error');
        setFlipbookError(data.error || 'Upload failed');
      }
    } catch {
      setFlipbookStatus('error');
      setFlipbookError('Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Asset Manager</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload images and videos. Videos are automatically compressed for faster loading.
          </p>
        </motion.div>

        {/* Compression Progress */}
        {compressing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-primary/10 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <Scissors className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-semibold">Compressing video... {compressionProgress}%</span>
            </div>
            <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${compressionProgress}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Key Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Key Images
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {uploadSlots.map((slot) => {
              const upload = uploads[slot.id];

              return (
                <motion.div key={slot.id} className="glass rounded-xl p-4">
                  <div
                    className={`relative w-full aspect-square rounded-xl overflow-hidden mb-4 transition-all ${
                      dragOver === slot.id ? 'upload-zone dragover' : 'upload-zone'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(slot.id); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => handleDrop(e, slot.id)}
                  >
                    {upload?.preview ? (
                      <Image src={upload.preview} alt={slot.label} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-10 h-10 mb-2" />
                        <span className="text-xs">Drop here</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*,.pdf,application/pdf"
                      onChange={(e) => handleFileSelect(e, slot.id)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {upload?.converting && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                        <FileText className="w-8 h-8 animate-pulse mb-2" />
                        <span className="text-xs">Converting PDF...</span>
                      </div>
                    )}
                    {upload?.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                    {upload?.status === 'success' && (
                      <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{slot.label}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{slot.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => uploadFile(slot.id, slot.filename)}
                      disabled={!upload?.file || upload?.status === 'uploading'}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </Button>
                    {upload?.preview && (
                      <Button size="sm" variant="outline" onClick={() => clearUpload(slot.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Media Library */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            Media Library (Photos & Videos)
          </h2>

          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all mb-6 ${
              dragOver === 'general' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver('general'); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={handleGeneralDrop}
          >
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleGeneralFiles}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div>
                <p className="font-semibold">Drop images or videos here</p>
                <p className="text-sm text-muted-foreground">Videos will be compressed automatically</p>
              </div>
            </div>
          </div>

          {/* Pending Files */}
          {generalFiles.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <h3 className="font-semibold">Ready to Upload ({generalFiles.length} files)</h3>
                <div className="flex gap-2">
                  {hasUncompressedVideos && (
                    <Button variant="outline" onClick={compressAllVideos} disabled={compressing}>
                      <Scissors className="w-4 h-4 mr-2" />
                      Compress Videos
                    </Button>
                  )}
                  <Button onClick={uploadAllGeneral} disabled={compressing}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {generalFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className={`aspect-square rounded-lg overflow-hidden bg-muted ${file.compressing ? 'animate-pulse' : ''}`}>
                      {file.type === 'video' ? (
                        <video src={file.preview} className="w-full h-full object-cover" muted />
                      ) : (
                        <Image src={file.preview} alt={file.file.name} fill className="object-cover" />
                      )}
                      {file.compressing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Scissors className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeGeneralFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {file.type === 'video' && !file.compressed && !file.compressing && (
                      <button
                        onClick={() => compressVideo(index)}
                        className="absolute top-1 left-1 p-1 bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Compress video"
                      >
                        <Scissors className="w-3 h-3" />
                      </button>
                    )}
                    <p className="text-xs truncate mt-1">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(file.file.size)}
                      {file.compressed && file.originalSize && (
                        <span className="text-green-500 ml-1">
                          (-{Math.round((1 - file.file.size / file.originalSize) * 100)}%)
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded */}
          {mediaLibrary.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Uploaded ({mediaLibrary.length} files)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaLibrary.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted border-2 border-green-500/30">
                      {file.type === 'video' ? (
                        <video src={file.preview} className="w-full h-full object-cover" muted />
                      ) : file.preview ? (
                        <Image src={file.preview} alt={file.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs truncate mt-1 text-green-600">{file.path}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Flipbook Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Flipbook Upload
          </h2>

          <div className="glass rounded-xl p-6">
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all mb-4 ${
                dragOver === 'flipbook' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver('flipbook'); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={handleFlipbookDrop}
            >
              <input
                type="file"
                accept=".zip"
                onChange={handleFlipbookSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileArchive className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Drop your flipbook .zip file here</p>
                  <p className="text-sm text-muted-foreground">Must contain index.html and assets folder</p>
                </div>
              </div>
            </div>

            {flipbookFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <FileArchive className="w-5 h-5 text-primary" />
                  <span className="font-medium">{flipbookFile.name}</span>
                  <span className="text-sm text-muted-foreground">({formatSize(flipbookFile.size)})</span>
                </div>
                <Button
                  onClick={() => { setFlipbookFile(null); setFlipbookError(''); }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {flipbookError && (
              <p className="text-red-500 text-sm mb-4">{flipbookError}</p>
            )}

            {flipbookStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <Check className="w-5 h-5" />
                <span>Flipbook uploaded successfully! View it at <a href="/book" className="underline font-medium">/book</a></span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={uploadFlipbook}
                disabled={!flipbookFile || flipbookStatus === 'uploading'}
              >
                {flipbookStatus === 'uploading' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Extract
                  </>
                )}
              </Button>
              {flipbookStatus === 'success' && (
                <Button variant="outline" asChild>
                  <a href="/book">View Flipbook</a>
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg mb-8"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Video compression:</strong> Reduces file size by ~50-70% while maintaining good quality (720p).
            <br />
            <strong>Files saved to:</strong> <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/public/uploads/</code>
            <br />
            <strong>Flipbook:</strong> Extracted to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/public/flipbook/</code> and viewable at <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/book</code>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button variant="outline" asChild>
            <a href="/">← Back to Site</a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
