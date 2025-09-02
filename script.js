const styles = {
  wave: 'https://storage.googleapis.com/tfjs-models/savedmodel/style-transfer/style/wave',
  candy: 'https://storage.googleapis.com/tfjs-models/savedmodel/style-transfer/style/candy',
  udnie: 'https://storage.googleapis.com/tfjs-models/savedmodel/style-transfer/style/udnie',
};

let styleNet;
let styleModelLoaded = false;
let imageTensor;

const inputCanvas = document.getElementById('inputCanvas');
const outputCanvas = document.getElementById('outputCanvas');
const ctx = inputCanvas.getContext('2d');

document.getElementById('imageUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    inputCanvas.width = img.width;
    inputCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    imageTensor = tf.browser.fromPixels(inputCanvas);
  };
  img.src = URL.createObjectURL(file);
});

document.querySelectorAll('button[data-style]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const style = btn.getAttribute('data-style');
    if (!imageTensor) return alert('Please upload an image first.');

    btn.textContent = 'Loading...';
    btn.disabled = true;

    // Load style model
    const styleNet = await tf.loadGraphModel(styles[style] + '/model.json');

    // Load style bottleneck from style image
    const styleImage = new Image();
    styleImage.crossOrigin = '';
    styleImage.src = styles[style] + '/style.jpg';

    styleImage.onload = async () => {
      const styleCanvas = document.createElement('canvas');
      styleCanvas.width = 256;
      styleCanvas.height = 256;
      styleCanvas.getContext('2d').drawImage(styleImage, 0, 0, 256, 256);
      const styleTensor = tf.browser.fromPixels(styleCanvas).toFloat().div(255).expandDims();

      // Apply style
      const content = imageTensor.toFloat().div(255).expandDims();
      const stylized = await tf.styleTransfer.stylize(content, styleTensor);

      await tf.browser.toPixels(stylized.squeeze(), outputCanvas);

      document.getElementById('downloadLink').href = outputCanvas.toDataURL();
      document.getElementById('downloadLink').classList.remove('hidden');

      btn.textContent = `Apply ${style.charAt(0).toUpperCase() + style.slice(1)}`;
      btn.disabled = false;
    };
  });
});
