export function getHeightFromWidth(widthNew, width, height) {
    return ( widthNew * height ) / width;
}

export function getWidthFromHeight(heightNew, width, height) {
    return ( heightNew * width ) / height;
}

export function preventMultipleSubmit() {
    let isLocked = false;
    function func(callback) {
        if(!isLocked) {
            isLocked = true;
            callback();
            setTimeout(() => {
                isLocked = false;
            }, 750);
        }
    }
    return func;
}