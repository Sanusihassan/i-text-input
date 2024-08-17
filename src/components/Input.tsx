import { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { Wrapper } from './Wrapper';
import useUndo from 'use-undo';

interface WrapperData {
    id: number;
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const Input = ({ width, height, className, style, onFocus, onInput }: {
    width: string | number; height: string | number, className?: string, style?: CSSProperties,
    onFocus?: () => void;
    onInput?: () => void;
}) => {
    const [wrappersState, {
        set: setWrappers,
        undo: undoWrappers,
        redo: redoWrappers,
        canUndo,
        canRedo,
    }] = useUndo<WrapperData[]>([
        { id: 1, content: 'type something...', x: 0, y: 0, width: 200, height: 100 }
    ]);

    const { present: wrappers } = wrappersState;

    const updateWrappers = useCallback((newWrappers: WrapperData[]) => {
        setWrappers(newWrappers);
    }, [setWrappers]);

    const handleDuplicate = (id: number) => {
        const wrapperToDuplicate = wrappers.find(w => w.id === id);
        if (wrapperToDuplicate) {
            const canvasRect = document.querySelector('.canvas')?.getBoundingClientRect();
            const newX = Math.min(wrapperToDuplicate.x + 10, (canvasRect?.width || 0) - wrapperToDuplicate.width);
            const newY = Math.min(wrapperToDuplicate.y + 10, (canvasRect?.height || 0) - wrapperToDuplicate.height);

            const newWrappers = [
                ...wrappers,
                {
                    ...wrapperToDuplicate,
                    id: Date.now(),
                    x: newX,
                    y: newY
                }
            ];
            updateWrappers(newWrappers);
        }
    };

    const handleDelete = (id: number) => {
        const newWrappers = wrappers.filter(w => w.id !== id);
        updateWrappers(newWrappers);
    };

    const handleMove = (id: number, x: number, y: number) => {
        const newWrappers = wrappers.map(w =>
            w.id === id ? { ...w, x, y } : w
        );
        updateWrappers(newWrappers);
    };

    const handleResize = (id: number, width: number, height: number) => {
        const newWrappers = wrappers.map(w =>
            w.id === id ? { ...w, width, height } : w
        );
        updateWrappers(newWrappers);
    };

    const handleContentChange = (id: number, content: string) => {
        const newWrappers = wrappers.map(w =>
            w.id === id ? { ...w, content } : w
        );
        updateWrappers(newWrappers);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'z' && canUndo) {
                e.preventDefault();
                undoWrappers();
            } else if (e.ctrlKey && e.key === 'y' && canRedo) {
                e.preventDefault();
                redoWrappers();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, undoWrappers, redoWrappers]);
    const canvasRef = useRef(null);


    return (
        <div className="canvas" style={{ width, height, position: 'relative' }} ref={canvasRef}>
            {wrappers.map(wrapper => (
                <Wrapper
                    key={wrapper.id}
                    id={wrapper.id}
                    initialContent={wrapper.content}
                    initialX={wrapper.x}
                    initialY={wrapper.y}
                    initialWidth={wrapper.width}
                    initialHeight={wrapper.height}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onMove={handleMove}
                    onResize={handleResize}
                    onContentChange={handleContentChange}
                    className={className}
                    style={style}
                    onFocus={onFocus}
                    onInput={onInput}
                />
            ))}
        </div>
    );
};

export default Input;