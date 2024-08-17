// i'm sorry the interact.js version was working let's integrate the set boundries of the drag 
// also the wrapper should be dragged and dropped within the boundries of the canvas.
// the wrpper is not accuretely folowing the mouse
import React, { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import { RiDeleteBinLine } from 'react-icons/ri';
import { HiOutlineDuplicate } from 'react-icons/hi';
 

export const Input= ({width, height}: {width: string | number; height: string | number}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [controlsPosition, setControlsPosition] = useState<'top' | 'bottom'>('top');

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (wrapper) {
            interact(wrapper)
                .draggable({
                    onmove: dragMoveListener,
                    listeners: {
                        move: updateControlPosition,
                    }
                })
                .resizable({
                    edges: { top: true, left: true, bottom: true, right: true },
                    listeners: {
                        move(event) {
                            const target = event.target as HTMLDivElement;
                            let x = (parseFloat(target.getAttribute('data-x')!) || 0);
                            let y = (parseFloat(target.getAttribute('data-y')!) || 0);

                            // Update element's style
                            target.style.width = `${event.rect.width}px`;
                            target.style.height = `${event.rect.height}px`;

                            // Translate element
                            x += event.deltaRect.left;
                            y += event.deltaRect.top;

                            target.style.transform = `translate(${x}px, ${y}px)`;

                            target.setAttribute('data-x', x.toString());
                            target.setAttribute('data-y', y.toString());

                            // Update the position of control buttons
                            updateControlPosition(event);
                        }
                    },
                    modifiers: [
                        interact.modifiers.restrictEdges({
                            outer: 'parent',
                        }),
                        interact.modifiers.restrictSize({
                            min: { width: 50, height: 20 },
                        }),
                    ],
                    inertia: true,
                });
        }
    }, []);

    const updateControlPosition = (event: any) => {
        const wrapper = wrapperRef.current;
        if (wrapper) {
            const rect = wrapper.getBoundingClientRect();
            const parentRect = wrapper.parentElement!.getBoundingClientRect();
            
            if (rect.top < 40) {
                setControlsPosition('bottom');
            } else {
                setControlsPosition('top');
            }
        }
    };

    return (
        <div className="canvas" style={{width, height}}>
        <div className="wrapper" ref={wrapperRef}>
            <div className={`controls ${controlsPosition}`}>
                <button className="btn"><RiDeleteBinLine /></button>
                <button className="btn"><HiOutlineDuplicate /></button>
            </div>
            <div className="resize-handle top-left"></div>
            <div className="resize-handle top-center"></div>
            <div className="resize-handle top-right"></div>
            <div className="resize-handle right-center"></div>
            <div className="resize-handle bottom-right"></div>
            <div className="resize-handle bottom-center"></div>
            <div className="resize-handle bottom-left"></div>
            <div className="resize-handle left-center"></div>

            <div className="input" contentEditable>
                test
            </div>
        </div>
        </div>
    );
};

function dragMoveListener(event: any) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

export default Input;
