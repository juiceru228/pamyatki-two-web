import React, { useRef, useState } from 'react';

const DragAndDropField = ({ onFileDrop, setFile, reset}) => {
    const fileInputRef = useRef(null);
    const [isFileDropped, setIsFileDropped] = useState(false);
    const [fileName, setFileName] = useState('');
    const [highlighted, setHighlighted] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setHighlighted(true);
    };
    

    
    const handleDragLeave = () => {
        setHighlighted(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setHighlighted(false);
        const file = e.dataTransfer.files[0];
        setIsFileDropped(true);
        if (typeof onFileDrop === 'function') {
            onFileDrop(file);
        }
        if (typeof setFileName === 'function') {
            setFileName(file.name);
        }
    };
    

    const handleFileClick = () => {
        setFile(null);
        setIsFileDropped(false);
        setHighlighted(false);
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onClick={handleFileClick}
                
            />
            <div
                className={highlighted ? 'drag-drop-field highlighted' : 'drag-drop-field'}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ border: '1px solid #ccc', padding: '10px', cursor: 'pointer' }}
                reset={reset}
            >
                {!isFileDropped && <p>Click/Drag and drop/ctrl + v</p>}
            {isFileDropped && <p>{fileName} succesfully downloaded!</p>}
            </div>
        </div>
    );
};

export default DragAndDropField;