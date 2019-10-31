import React, { PureComponent } from 'react';
import { Desk } from './';

const MOUSE_MAIN_BUTTON = 0;
const MOUSE_SECONDARY_BUTTON = 2;
const MOUSE_MIDDLE_BUTTON = 1;

class DeskDrawing extends PureComponent {

    handlerMouseDown = (e) => {
        const { button, clientX, clientY, target } = e;
        const { onDrawig } = this.props;
        const { lineOptions } = this.state;
        if(button === MOUSE_MAIN_BUTTON) {
            this.isDrawing = true;
            this.updateLine();
            this.context.beginPath();
            let { left, top } = target.getBoundingClientRect();
            let [x, y] = [clientX - left, clientY - top];
            this.context.moveTo(x, y);
            onDrawig({
                action: 'moveTo',
                coords: {x, y},
                lineOptions,
            });
        }
    }

    handlerMouseUp = (e) => {
        const { button } = e;
        if(button === MOUSE_MAIN_BUTTON) this.isDrawing = false;
    }

    handlerMouseMove = (e) => {
        if(this.isDrawing) {
            const { onDrawig } = this.props;
            const { lineOptions } = this.state;
            const { clientX, clientY, target } = e;
            let { left, top } = target.getBoundingClientRect();
            let [x, y] = [clientX - left, clientY - top];
            this.context.lineTo(x, y);
            this.context.stroke();
            onDrawig({
                action: 'lineTo',
                coords: {x, y},
                lineOptions,
            });
        }
    }

    render() {
        return <Desk />
    }
}

export default DeskDrawing;