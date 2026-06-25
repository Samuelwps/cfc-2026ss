# Quick Start Guide - Documents Refactor

## ⚡ 30-Second Setup

1. **Update Database**: Run migration in Supabase SQL Editor
   - File: `sql/migrate-documents.sql`
   - Or execute fresh setup: `sql/setup-supabase.sql`

2. **Verify Storage**: Check `documents` bucket in Supabase Storage
   - Set to Public ✓
   - RLS policies enabled ✓

3. **Test It**: Upload a PDF file in the Documents section

## 📁 What Changed

### New Files Created
```
✓ src/utils/fileHelpers.js
✓ src/contexts/ToastContext.jsx  
✓ src/components/DocumentCard.jsx
✓ src/components/ToastContainer.jsx
✓ src/components/SkeletonCard.jsx
✓ src/components/FileIcon.jsx
✓ src/components/PdfViewer.jsx
✓ src/components/ImageViewer.jsx
✓ sql/migrate-documents.sql
```

### Files Modified
```
✓ src/components/Documents.jsx (complete rewrite)
✓ src/App.jsx (added ToastProvider)
✓ src/styles/global.js (overflow fixes)
```

## 🎯 Key Features

| Feature | Before | After |
|---------|--------|-------|
| Layout | Simple list | Modern cards |
| Preview | None | PDF + Images |
| Mobile | Basic | Fully responsive |
| Feedback | Alerts | Toast notifications |
| Search | Basic | Advanced filter |
| Loading | None | Skeleton states |
| Error Handling | Alert dialogs | Toast messages |

## 📱 Responsive Behavior

### Mobile (< 640px)
- Single column
- Full-width cards
- Large buttons
- Touch-optimized

### Tablet (640px - 768px)  
- 2-3 columns
- Optimized spacing
- Touch-friendly

### Desktop (> 1024px)
- 4 columns
- Hover effects
- Full features

## 🚀 What Works Now

✅ Upload PDFs with file size tracking
✅ View PDFs in responsive modal  
✅ View images with zoom
✅ Download files directly
✅ Delete with confirmation
✅ Search by filename
✅ Filter by category
✅ Toast notifications
✅ Skeleton loading
✅ Mobile responsive
✅ No horizontal scrolling
✅ Improved performance

## 🧪 Quick Tests

### Upload Test
1. Click "+ ADICIONAR"
2. Select a PDF
3. Choose category
4. Wait for success toast
5. Verify in grid

### Preview Test
1. Click "👁 Ver" button
2. Modal should open
3. PDF should display
4. Click download if needed
5. Close with X button

### Delete Test
1. Click "🗑 Deletar"
2. Confirm dialog appears
3. Click "Deletar"
4. File removed from list

## 🔧 Database Schema

```sql
-- New columns in documents table
size BIGINT DEFAULT 0              -- File size in bytes
mime_type TEXT DEFAULT 'application/pdf'  -- File MIME type

-- Run migration to add these
```

## 📊 Component Map

```
App
├── ToastProvider
│   ├── ToastContainer ← Displays toasts
│   ├── Header
│   ├── Documents ← Main component
│   │   ├── DocumentCard (for each file)
│   │   │   ├── FileIcon
│   │   │   └── Actions
│   │   ├── PdfViewer (modal)
│   │   ├── ImageViewer (modal)
│   │   └── SkeletonCard (loading)
│   ├── Students
│   └── Songs
```

## 🎨 Color Scheme

- **Primary**: #FF6A00 (Orange)
- **Background**: #0B0F14 (Dark)
- **Text**: #E8EAED (Light)
- **Muted**: #7a8088 (Gray)
- **Danger**: #D72638 (Red)

## 📞 Common Issues

### Issue: Files not uploading
**Solution**: 
- Check Supabase bucket exists
- Check bucket is public
- Check file is PDF
- Check file < 10MB

### Issue: No preview showing
**Solution**:
- Run migration script
- Verify database connection
- Check browser console for errors

### Issue: Mobile layout broken
**Solution**:
- Clear browser cache
- Check viewport meta tag
- Disable zoom
- Test in private/incognito

### Issue: Toasts not showing
**Solution**:
- Check ToastProvider in App.jsx
- Verify ToastContainer imported
- Check z-index in CSS

## 💡 Tips

1. **Better organization**: Use meaningful file names
2. **Fast uploads**: Use PDF format
3. **Easy search**: Name files with descriptors
4. **Storage**: Delete old files regularly
5. **Backup**: Export documents periodically

## 📚 Documentation Files

- `DOCUMENTS_REFACTOR.md` - Detailed guide
- `REFACTOR_SUMMARY.md` - Implementation details
- This file - Quick reference

## ✨ What Makes This Better

1. **Modern Design** - Professional card-based layout
2. **Better UX** - Toast notifications, modals, loaders
3. **Responsive** - Works perfectly on all devices
4. **Accessible** - Keyboard navigation, ARIA labels
5. **Performance** - Optimized rendering, lazy loading
6. **Error Handling** - Clear messages, graceful degradation
7. **Mobile-First** - Designed for smallest screens first

## 🎓 Learning Path

1. Read `REFACTOR_SUMMARY.md` for overview
2. Check `Documents.jsx` for implementation
3. Review `ToastContext.jsx` for state management
4. Explore `fileHelpers.js` for utilities
5. Study individual components

## 🔒 Security Notes

- Files stored separately in Supabase Storage
- Database records in Supabase DB
- RLS policies restrict access
- No sensitive data in URLs
- Secure deletion of files

## 📈 Performance

- Skeleton cards show while loading
- Images lazy loaded
- Handlers memoized
- No unnecessary re-renders
- Blob URLs cleaned up

## 🚀 Next Steps

1. ✅ Update database schema
2. ✅ Test file upload
3. ✅ Test file preview
4. ✅ Test on mobile
5. ✅ Test on tablet
6. ✅ Test on desktop
7. ✅ Go live!

---

**Status**: ✅ Ready to Use
**Last Update**: 2024
**Version**: 2.0 Refactored
