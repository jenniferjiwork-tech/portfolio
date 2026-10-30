# Homepage video exports

The website uses compressed MP4 files in `assets/videos/home/`.
Original Figma exports are preserved in `assets/videos/originals/home/`; this folder is excluded from Git. Keep a separate backup of these originals before moving computers.

Compression preserves 1404 × 1054 pixels, 30 FPS and full duration, using H.264 CRF 20 with fast-start metadata. Audio is omitted. Each video has a lightweight JPEG still in `assets/images/home/`.

Website sizes (decimal MB):
- Conversion: 1.25 MB (original 9.57 MB)
- Cari: 0.68 MB (original 3.26 MB)
- JENNY BIRD: 0.74 MB (original 9.55 MB)

Video downloads are deferred until within 200 pixels of the viewport; playback pauses offscreen. Reduced-motion visitors see the still images. Homepage controls remain hidden; future project pages can use `data-video-controls="true"`.

For future replacements, save the new master export separately and ask for a compressed website copy. Avoid overwriting the only original with a compressed file.
