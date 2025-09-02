// app.js
const { load } = window['tf']['styleTransfer'];

async function main() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <h1 class="text-3xl font-bold mb-4 text-center">StyleMuse</h1>
    <input id="upload" type="file" accept="image/*" class="mb-4" />
    <div class="flex flex-col items-center space-y-4">
      <canvas id="inputCanvas" class="max-w-full border"></canvas>
      <div id="buttons" class="space-x-2"></div>
      <canvas id="outputCanvas" class="max-w-full border"></canvas>
      <a id="downloadBtn" class="mt-2 text-blue-600 underline hidden">Download stylized image</a>
    </div>`;
  
  const upload = document.getElementById('upload');
  const inputCanvas = document.getElementById('inputCanvas');
  const outputCanvas = document.getElementById('outputCanvas');
  const buttonsDiv = document.getElementById('buttons');
  const downloadBtn = document.getElementById('downloadBtn');

  const styles = [
    { name: 'Wave', url: 'https://storage.googleapis.com/tfjs-models/savedmodel/style-transfer/arbitrary-style-transfer/saved_model_waves.pb' },
    { name: 'Candy', url: 'https://storage.googleapis.com/tfjs-models/savedmodel/style-transfer/arbitrary-style-transfer/saved_model_candy.pb' },
    { name: 'Udnie', url: 'https://storage.googleapis.com/tfjs-models/savedmodel/style-transfer/arbitrary-style-transfer/saved_model_udnie.pb' },
  ];

  let inputImg = null;
  let styleModel = null;

  upload.onchange = event => {
    const file = event.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      inputCanvas.width = img.width;
      inputCanvas.height = img.height;
      const ctx = inputCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      inputImg = img;
    };
    img.src = URL.createObjectURL(file);
  };

  styles.forEach(style => {
    const btn = document.createElement('button');
    btn.textContent = `Apply ${style.name}`;
    btn.className = 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600';
    btn.onclick = async () => {
      if (!inputImg) return alert('Please upload an image first');
      styleModel = await load(style.url);
      const inputTensor = tf.browser.fromPixels(inputCanvas);
      const stylized = await styleModel.stylize(inputTensor);
      await tf.browser.toPixels(stylized, outputCanvas);
      downloadBtn.href = outputCanvas.toDataURL();
      downloadBtn.download = `stylemuse_${style.name}.png`;
      downloadBtn.classList.remove('hidden');
    };
    buttonsDiv.appendChild(btn);
  });
}

main();
