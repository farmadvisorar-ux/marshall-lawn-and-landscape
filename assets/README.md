# Media Assets Folder: Marshall Lawn and Landscape

Place your high-resolution photos and project videos in this directory:

## 📁 Subfolders
- `assets/images/gallery/` — Drop all your lawn, patio, flower bed, and sod photos here (JPG, PNG, WEBP).
- `assets/videos/` — Drop any MP4 project walkthroughs or time-lapses here.

## 🚀 How to Link New Photos or Videos
1. Drop your image file into `assets/images/gallery/your-photo.jpg`.
2. In `index.html`, add a new gallery card with your image path:
```html
<div class="gallery-item" data-category="mowing" data-title="Your Project Title" data-img="assets/images/gallery/your-photo.jpg">
  <img src="assets/images/gallery/your-photo.jpg" alt="Marshall Lawn Care" class="gallery-item-img" loading="lazy">
  <div class="gallery-item-overlay">
    <div class="gallery-item-title">Your Project Title</div>
    <div class="gallery-item-tag">Precision Mowing</div>
  </div>
</div>
```
3. Run `git add .`, `git commit -m "add new project photos"`, and `git push` (or run `push_to_github.bat`) to update your live website instantly!
