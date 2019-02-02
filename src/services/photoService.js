const sizeOf = require('image-size');
// const watermark = require('dynamic-watermark');
const watermark = require('image-watermark');

const addWatermarkToPhoto = async filePath => {
	const dimensions = await sizeOf(filePath);
	const width = dimensions.width;
	const height = dimensions.height;
	console.log(width, height);

	const options = {
		'text' : 'sample watermark',
		'override-image' : true
	};
	watermark.embedWatermark("C:\\Users\\iBavtovich\\AppData\\Local\\Temp\\express-busboy\\474530f3-d6c1-4851-a886-742f73a71226\\photo\\1.png", options);
	// watermark.embedWatermark(filePath, options);
};

module.exports.addWatermarkToPhoto = addWatermarkToPhoto;