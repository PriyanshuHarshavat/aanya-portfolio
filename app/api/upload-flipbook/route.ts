import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if it's a zip file
    if (!file.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'File must be a .zip file' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Path to flipbook directory
    const flipbookDir = path.join(process.cwd(), 'public', 'flipbook');

    // Clear existing flipbook directory if it exists
    if (existsSync(flipbookDir)) {
      await rm(flipbookDir, { recursive: true });
    }

    // Create fresh flipbook directory
    await mkdir(flipbookDir, { recursive: true });

    // Save the zip temporarily
    const tempZipPath = path.join(process.cwd(), 'temp-flipbook.zip');
    await writeFile(tempZipPath, buffer);

    // Extract the zip
    const zip = new AdmZip(tempZipPath);
    const zipEntries = zip.getEntries();

    // Check if files are in a subdirectory or at root
    let rootPrefix = '';
    const hasRootIndex = zipEntries.some(entry => entry.entryName === 'index.html');

    if (!hasRootIndex) {
      // Files might be in a subdirectory, find the index.html
      const indexEntry = zipEntries.find(entry => entry.entryName.endsWith('index.html'));
      if (indexEntry) {
        // Get the directory prefix
        rootPrefix = indexEntry.entryName.replace('index.html', '');
      }
    }

    // Extract files
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      let targetPath = entry.entryName;

      // Remove root prefix if exists
      if (rootPrefix && targetPath.startsWith(rootPrefix)) {
        targetPath = targetPath.substring(rootPrefix.length);
      }

      // Skip if empty path
      if (!targetPath) continue;

      const fullPath = path.join(flipbookDir, targetPath);
      const dir = path.dirname(fullPath);

      // Create directory if needed
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      // Write file
      await writeFile(fullPath, entry.getData());
    }

    // Clean up temp file
    await rm(tempZipPath);

    // Verify index.html exists
    const indexPath = path.join(flipbookDir, 'index.html');
    if (!existsSync(indexPath)) {
      return NextResponse.json({
        error: 'No index.html found in zip file',
        hint: 'Make sure your zip contains index.html at the root level'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Flipbook uploaded and extracted successfully',
      path: '/flipbook/index.html',
    });
  } catch (error) {
    console.error('Flipbook upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
