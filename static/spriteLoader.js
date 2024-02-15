let names = [
    'dirt', 'RgrassOverlay',
    'Rtest'
]

var bitmaps = {};

// Function to load images and create bitmaps
function loadImagesAndCreateBitmaps(names) {
    var promises = [];
    console.groupCollapsed('Individual bitmap loading.');

    // Load each image and create a bitmap
    names.forEach(function (name) {
        let promise;
        if (name[0] == 'R') {
            let img = new Image();
            img.src = window.location.href + `/resources/sprites/${name.substring(1)}.png`;
            promise = new Promise(function (resolve, reject) {
                img.onload = function () {
                    for (let i=0; i<4; i++) {
                        let cvs = document.createElement('canvas');
                        let ctx = cvs.getContext('2d');
                        ctx.save();
                        ctx.translate(img.width / 2, img.height / 2);
                        ctx.rotate(Math.PI / 2 * i);
                        ctx.drawImage(img, -img.width / 2, -img.height / 2);
                        ctx.restore();

                        createImageBitmap(ctx.getImageData(0, 0, img.width, img.height))
                            .then(function (bitmap) {
                                bitmaps[name.substring(1) + i] = bitmap;
                                console.log(`Loaded [${name}] and created bitmap.`);
                                resolve();
                            })
                            .catch(function (error) {
                                console.error(`Error creating bitmap for ${name}:`, error);
                                reject();
                            });
                    }
                };

                img.onerror = function () {
                    console.error(`Error loading ${name}`);
                    reject();
                };
            });
        }
        else {
            let img = new Image();
            img.src = window.location.href + `/resources/sprites/${name}.png`;
            promise = new Promise(function (resolve, reject) {
                img.onload = function () {
                    // let cvs = document.createElement('canvas');
                    // cvs.width = img.width;
                    // cvs.height = img.height;
                    // let ctx = cvs.getContext('2d');
                    // ctx.save();
                    // ctx.translate(img.width / 2, img.height / 2);
                    // ctx.rotate(Math.PI / 2);
                    // ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    // ctx.restore();

                    createImageBitmap(img)
                        .then(function (bitmap) {
                            bitmaps[name] = bitmap;
                            console.log(`Loaded [${name}] and created bitmap.`);
                            resolve();
                        })
                        .catch(function (error) {
                            console.error(`Error creating bitmap for ${name}:`, error);
                            reject();
                        });
                };

                img.onerror = function () {
                    console.error(`Error loading ${name}`);
                    reject();
                };
            });
        }

        promises.push(promise);
    });

    // Wait for all promises to resolve
    return Promise.all(promises);
}

// Call the function to load images and create bitmaps
loadImagesAndCreateBitmaps(names)
    .then(function () {
        console.groupEnd();
        console.log('Bitmaps all loaded.')
        init(bitmaps);
        // loadFont(bitmaps);
    })
    .catch(function (error) {
        console.error("Error loading images:", error);
    });