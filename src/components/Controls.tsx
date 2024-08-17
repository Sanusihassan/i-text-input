import React from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { HiOutlineDuplicate } from 'react-icons/hi';

interface ControlsProps {
    position: 'top' | 'bottom';
    onDuplicate: () => void;
    onDelete: () => void;
    show: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ position, onDuplicate, onDelete, show, }) => {
    return (
        <div className={`controls ${position}${show ? "" : " clear"}`} onClick={(e) => {
            e.stopPropagation();
        }}>
            <button className="btn" onClick={onDelete}><RiDeleteBinLine /></button>
            <button className="btn" onClick={onDuplicate}><HiOutlineDuplicate /></button>
        </div>
    );
};