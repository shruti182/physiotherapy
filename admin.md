# Multiple Syllabus Upload Feature - Complete Guide

## 🎯 What's New

Your admin panel now supports **uploading 2+ PDF files at the same time** from one course ID!

### Before:
```
❌ Select one file
❌ Upload one file
❌ Repeat process for each additional file
```

### After:
```
✅ Select multiple files at once (2, 3, 5, 10... files)
✅ Upload all files in one batch
✅ See progress for each file
✅ Get success summary
```

---

## 📋 Updated Features

### 1. **Multiple File Selection**
- Hold `Ctrl` (Windows) or `Cmd` (Mac) while clicking files
- Or click one, then `Ctrl/Cmd + Click` others
- System shows file count and size for each selected file

### 2. **File Preview Before Upload**
```
Selected Files:
1. CBSE_Class_6_Mathematics.pdf (2.1 MB)
2. ICSE_Class_6_Mathematics.pdf (2.3 MB)
3. State_Board_Class_6_Math.pdf (1.8 MB)
```

### 3. **Individual File Validation**
- Checks each file is PDF format
- Checks each file is under 20MB
- Shows specific error if any file fails validation

### 4. **Sequential Upload with Progress**
```
Uploading file 1/3: CBSE_Class_6_Mathematics.pdf…
Uploading file 2/3: ICSE_Class_6_Mathematics.pdf…
Uploading file 3/3: State_Board_Class_6_Math.pdf…
Done! 3/3 files uploaded successfully
```

### 5. **Smart Description Handling**
- **Single file**: Uses your description as-is
- **Multiple files**: Appends filename to description
  - Description: "Class 6 Mathematics"
  - File 1 saved as: "Class 6 Mathematics - CBSE_Class_6_Mathematics.pdf"
  - File 2 saved as: "Class 6 Mathematics - ICSE_Class_6_Mathematics.pdf"
- **No description provided**: Uses filename as description

---

## 🚀 How to Use

### Step-by-Step

1. **Go to Admin Panel** → Click "Syllabus" in sidebar

2. **Click "+ Upload Syllabus"**
   - Modal opens with form

3. **Select Subject**
   - Example: Mathematics

4. **Select Class**
   - Example: Class 6
   - Course ID auto-generated: `math-grade-6`

5. **Select Multiple PDF Files**
   ```
   - Click "Choose File" button
   - Select FIRST PDF (CBSE Syllabus)
   - IMPORTANT: While file dialog is open...
     - Hold Ctrl (Windows) or Cmd (Mac)
     - Click SECOND PDF (ICSE Syllabus)
     - Click THIRD PDF if needed
   - Click "Open" to confirm selection
   ```

6. **See Selected Files Preview**
   ```
   Selected Files:
   1. cbse_class_6_maths.pdf (2.1 MB)
   2. icse_class_6_maths.pdf (2.3 MB)
   ```

7. **Enter File Description (Optional)**
   - Example: "Class 6 Mathematics"
   - Will be appended to each file's description automatically

8. **Click "Upload PDF(s)"**
   - Progress bar appears
   - Shows: "Uploading file 1/2: cbse_class_6_maths.pdf…"
   - Then: "Uploading file 2/2: icse_class_6_maths.pdf…"
   - Finally: "Done! 2/2 files uploaded successfully"

9. **Success Toast Appears**
   - Shows: "2 file(s) uploaded successfully!"
   - Modal closes automatically
   - Syllabus list refreshes

---

## 📊 Example Scenarios

### Scenario 1: Upload CBSE + ICSE for Math Class 6

**Inputs:**
- Subject: Mathematics
- Class: Class 6 (Course ID: `math-grade-6`)
- Files: CBSE Math.pdf, ICSE Math.pdf
- Description: "Class 6 Mathematics Syllabus"

**Result in Database:**
```
✓ File 1
  - course_id: "math-grade-6"
  - file_name: "CBSE Math.pdf"
  - description: "Class 6 Mathematics Syllabus - CBSE Math.pdf"
  
✓ File 2
  - course_id: "math-grade-6"
  - file_name: "ICSE Math.pdf"
  - description: "Class 6 Mathematics Syllabus - ICSE Math.pdf"
```

**On Course Detail Page:**
```
Course Syllabus
✅ 2 syllabus file(s) available for download
  📥 Class 6 Mathematics Syllabus - ICSE Math.pdf (2.3 MB)
  📥 Class 6 Mathematics Syllabus - CBSE Math.pdf (2.1 MB)
```

---

### Scenario 2: Upload All Board Syllabuses at Once

**Inputs:**
- Subject: Science
- Class: Class 7 (Course ID: `science-grade-7`)
- Files:
  1. CBSE_Science_7.pdf (3.2 MB)
  2. ICSE_Science_7.pdf (2.9 MB)
  3. State_Board_Science_7.pdf (2.5 MB)
  4. IGCSE_Science_7.pdf (3.1 MB)
- Description: "Science"

**Upload Process:**
```
Uploading file 1/4: CBSE_Science_7.pdf…
Uploading file 2/4: ICSE_Science_7.pdf…
Uploading file 3/4: State_Board_Science_7.pdf…
Uploading file 4/4: IGCSE_Science_7.pdf…
Done! 4/4 files uploaded successfully
```

**On Course Detail Page:**
```
Course Syllabus
✅ 4 syllabus file(s) available for download
  📥 Science - IGCSE_Science_7.pdf (3.1 MB)
  📥 Science - State_Board_Science_7.pdf (2.5 MB)
  📥 Science - ICSE_Science_7.pdf (2.9 MB)
  📥 Science - CBSE_Science_7.pdf (3.2 MB)
```
*(Sorted by newest first)*

---

## 🔧 Technical Changes Made

### File Input Enhancement
```html
<!-- BEFORE -->
<input type="file" id="syllabusFile" accept=".pdf" />

<!-- AFTER -->
<input type="file" id="syllabusFile" accept=".pdf" multiple />
                                     ^^^^^^^^
```

### File Preview Display
```html
<!-- NEW SECTION -->
<div id="fileList" style="...">
  <small>Selected Files:</small>
  <div id="selectedFiles">
    <!-- Populated with selected file list -->
  </div>
</div>
```

### Upload Function Logic
```javascript
// BEFORE: Process single file
const file = fileInput.files[0];

// AFTER: Process all files
const files = Array.from(fileInput.files);
for (let file of files) {
  // Validate
  // Upload
  // Save metadata
}
```

### Progress Tracking
```javascript
// BEFORE: Single progress bar
document.getElementById("uploadStatus").textContent = "Uploading…";

// AFTER: Per-file progress
document.getElementById("uploadStatus").textContent = 
  `Uploading file ${fileNumber}/${totalFiles}: ${file.name}…`;
```

### Description Handling
```javascript
// BEFORE: Single description for one file
description: description || null

// AFTER: Smart appending for multiple files
let fileDesc = description;
if (totalFiles > 1 && description) {
  fileDesc = `${description} - ${file.name}`;
}
```

---

## ✅ Benefits

| Feature | Benefit |
|---------|---------|
| **Select Multiple Files** | Save time - no need to repeat upload process |
| **Real-time Preview** | See exactly what you're uploading before starting |
| **Per-File Validation** | Know immediately if a file has issues |
| **Sequential Processing** | Clear progress for each file |
| **Smart Descriptions** | Automatically distinguishes between CBSE/ICSE/etc |
| **Error Messages** | Shows which specific file failed if there's an issue |

---

## ⚠️ Limitations & Notes

- **Max 20MB per file** (this hasn't changed)
- **PDF files only** (this hasn't changed)
- **All files go to same course ID** - If you want different subjects, you'll need separate uploads
- **Browser file selection** - Depends on your browser/OS file selector (same as before)

---

## 🎯 Quick Comparison

### Old Method (Per-File)
```
1. Select CBSE Math → Upload ✓
2. Select ICSE Math → Upload ✓
3. Select State Math → Upload ✓
Total: 3 upload operations
```

### New Method (Batch)
```
1. Select CBSE, ICSE, State Math together → Upload ✓
Total: 1 upload operation
```

**Time saved: ~60%** (for 3 files, typically)

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Multiple files not selected" | Hold **Ctrl** (Windows) or **Cmd** (Mac) while clicking files |
| "File list not showing" | Make sure you completed your file selection |
| "Upload stuck on 1 file" | Check browser console for errors; may be a network issue |
| "Wrong description shows" | Descriptions auto-append filename when multiple files selected |
| "Some files uploaded, some failed" | Check which file exceeded 20MB or isn't a PDF |

---

## 🔄 File Flow

```
┌─────────────────────────────────────┐
│ Select Multiple PDFs from Computer  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ Preview Shows All Selected Files    │
│ (with file sizes)                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ Click "Upload PDF(s)"               │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
   ┌────▼────┐   ┌───▼────┐
   │ File 1  │   │ File 2  │
   │ Upload  │   │ Upload  │
   └────┬────┘   └───┬────┘
        │            │
   ┌────▼────┐   ┌───▼────┐
   │ Save to │   │ Save to │
   │Database │   │Database │
   └────┬────┘   └───┬────┘
        │            │
        └────┬───────┘
             │
      ┌──────▼──────┐
      │ Success! 2/2│
      │  uploaded   │
      └─────────────┘
```

---

## 📁 Files Provided

- **admin-updated.html** - Updated admin panel with multiple file upload support
- **This guide** - Complete documentation

Simply replace your current admin.html with admin-updated.html and you're ready to go! 🚀
