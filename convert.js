document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const ascii = convertImageToAscii(img);
            document.getElementById('ascii').textContent = ascii;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

function convertImageToAscii(img) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = 100; // width of the ASCII art
    const scaleFactor = img.width / width;
    const height = img.height / scaleFactor;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(img, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);

    let asciiImage = '';
    const grayScales = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        const alpha = imageData.data[i + 3];
        if (alpha === 0) {
            grayScales.push(255);
        } else {
            const red = imageData.data[i];
            const green = imageData.data[i + 1];
            const blue = imageData.data[i + 2];
            const grayScale = (red * 0.3 + green * 0.59 + blue * 0.11);
            grayScales.push(grayScale);
        }
    }

    for (let i = 0; i < grayScales.length; i += width) {
        const row = grayScales.slice(i, i + width);
        asciiImage += row.reduce((asciiRow, grayScale) => asciiRow + getAsciiChar(grayScale), '') + '\n';
    }

    return asciiImage;
}

function getAsciiChar(grayScale) {
    const asciiChars = ' @#S%?*+;:,."';
    const index = Math.floor((asciiChars.length - 1) * grayScale / 255);
    return asciiChars[index];
}
