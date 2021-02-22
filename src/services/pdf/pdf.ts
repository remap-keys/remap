const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
import KeyboardModel from '../../models/KeyboardModel';
const LunakeyMiniKeymap = require('../../assets/keymaps/LunakeyMiniKeymap');

run().catch((err) => console.log(err));

function dummy() {
  const keyboardModel = new KeyboardModel(LunakeyMiniKeymap);
  const { keymaps, width, height, left } = keyboardModel.getKeymap();
}
async function run() {
  dummy();

  // Create a new document and add a new page
  const doc = await PDFDocument.create();
  const page = doc.addPage();

  // Load the image and store it as a Node.js buffer in memory
  let img = fs.readFileSync('../../assets/images/logo.png');
  img = await doc.embedPng(img);

  // Draw the image on the center of the page
  const { width, height } = img.scale(1);
  page.drawImage(img, {
    x: page.getWidth() / 2 - width / 2,
    y: page.getHeight() / 2 - height / 2,
  });

  // Write the PDF to a file
  fs.writeFileSync('./test.pdf', await doc.save());
}
