// === RESIZE ====
function resizeMe(img) {
    const max_width = 1000;
    const max_height = 1000;
    var canvas = document.createElement('canvas');

    var width = img.width;
    var height = img.height;

    console.log('width: ', width, ', height: ', height);

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > max_width) {
            //height *= max_width / width;
            height = Math.round(height *= max_width / width);
            width = max_width;
        }
    } else {
        if (height > max_height) {
            //width *= max_height / height;
            width = Math.round(width *= max_height / height);
            height = max_height;
        }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(preprocessImage(img), 0, 0, width, height);
    const result = canvas.toDataURL("image/jpeg", 1);
    return result; // get the data from canvas as 70% JPG (can be also PNG, etc.)

}

const preprocessImage = (img) => {


}
export { resizeMe };