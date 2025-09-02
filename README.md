# StyleMuse

**Instant Artistic Style Transfer in Your Browser**

## ⭐ Features
- Apply multiple artistic styles to your photos in real time.
- Stylish, minimal UI with Tailwind CSS.
- Drag-and-drop and download functionality.

Methodology
We use TensorFlow.js and an arbitrary style transfer model—a feed‑forward CNN that accepts content and style, then generates stylized output. The lighter-weight models are hosted externally and fetched via URL. Styles (e.g., Candy, Wave, Udnie) are selectable presets. The input image is processed into a tensor, passed through the model, and rendered to canvas—all within the React/Tailwind frontend.
