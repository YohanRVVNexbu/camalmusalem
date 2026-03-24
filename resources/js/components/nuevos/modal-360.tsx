import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowIcon } from '@/components/landing/arrow-icon';

import img360_00 from '@images/nuevos/360/360_00.png?format=webp';
import img360_02 from '@images/nuevos/360/360_02.png?format=webp';
import img360_03 from '@images/nuevos/360/360_03.png?format=webp';
import img360_04 from '@images/nuevos/360/360_04.png?format=webp';
import img360_05 from '@images/nuevos/360/360_05.png?format=webp';
import img360_06 from '@images/nuevos/360/360_06.png?format=webp';
import img360_07 from '@images/nuevos/360/360_07.png?format=webp';
import img360_08 from '@images/nuevos/360/360_08.png?format=webp';
import img360_09 from '@images/nuevos/360/360_09.png?format=webp';
import img360_10 from '@images/nuevos/360/360_10.png?format=webp';
import img360_11 from '@images/nuevos/360/360_11.png?format=webp';
import img360_12 from '@images/nuevos/360/360_12.png?format=webp';

export const frames360 = [
    img360_00, img360_02, img360_03, img360_04,
    img360_05, img360_06, img360_07, img360_08,
    img360_09, img360_10, img360_11, img360_12,
];

type Modal360Props = {
    open: boolean;
    onClose: () => void;
    name: string;
    subtitle: string;
};

function Icon360Large() {
    return (
        <svg width="46" height="64" viewBox="0 0 46 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5176 26.176C9.72823 26.176 9.02956 26.0267 8.42156 25.728C7.81356 25.4187 7.33356 25.0293 6.98156 24.56L7.58956 23.6C8.36823 24.6027 9.34423 25.104 10.5176 25.104C11.3176 25.104 11.9576 24.8907 12.4376 24.464C12.9282 24.0267 13.1736 23.4613 13.1736 22.768C13.1736 22 12.8696 21.424 12.2616 21.04C11.6536 20.656 10.8429 20.464 9.82956 20.464V19.472C10.4589 19.4613 10.9869 19.3547 11.4136 19.152C11.8509 18.9387 12.1709 18.6667 12.3736 18.336C12.5869 18.0053 12.6936 17.648 12.6936 17.264C12.6936 16.752 12.5069 16.3413 12.1336 16.032C11.7709 15.712 11.2696 15.552 10.6296 15.552C9.64823 15.552 8.72023 15.9893 7.84556 16.864L7.30156 15.904C8.29356 14.9547 9.42423 14.48 10.6936 14.48C11.3122 14.48 11.8562 14.5973 12.3256 14.832C12.8056 15.056 13.1789 15.3707 13.4456 15.776C13.7122 16.1813 13.8456 16.6453 13.8456 17.168C13.8456 17.7973 13.6536 18.3467 13.2696 18.816C12.8962 19.2853 12.3522 19.6267 11.6376 19.84C12.5229 20.0427 13.1949 20.4053 13.6536 20.928C14.1122 21.44 14.3416 22.0693 14.3416 22.816C14.3416 23.4453 14.1816 24.016 13.8616 24.528C13.5416 25.04 13.0882 25.4453 12.5016 25.744C11.9256 26.032 11.2642 26.176 10.5176 26.176ZM20.4221 18.768C21.0834 18.768 21.6754 18.9227 22.1981 19.232C22.7207 19.5413 23.1314 19.9733 23.4301 20.528C23.7287 21.0827 23.8781 21.712 23.8781 22.416C23.8781 23.0987 23.7127 23.728 23.3821 24.304C23.0621 24.8693 22.6194 25.3227 22.0541 25.664C21.4994 25.9947 20.8861 26.16 20.2141 26.16C19.4781 26.16 18.8061 25.9787 18.1981 25.616C17.6007 25.2427 17.1261 24.6933 16.7741 23.968C16.4221 23.232 16.2461 22.3413 16.2461 21.296C16.2461 20.016 16.4754 18.8693 16.9341 17.856C17.3927 16.8427 18.1234 16.0427 19.1261 15.456C20.1287 14.8587 21.4141 14.56 22.9821 14.56L23.2381 15.552C19.7394 15.552 17.7981 17.104 17.4141 20.208C17.7447 19.7813 18.1714 19.4347 18.6941 19.168C19.2167 18.9013 19.7927 18.768 20.4221 18.768ZM20.1821 25.12C20.6727 25.12 21.1101 25.0027 21.4941 24.768C21.8887 24.5333 22.1927 24.2133 22.4061 23.808C22.6301 23.392 22.7421 22.9333 22.7421 22.432C22.7421 21.6427 22.5074 21.0027 22.0381 20.512C21.5794 20.0107 20.9821 19.76 20.2461 19.76C19.5954 19.76 19.0034 19.9413 18.4701 20.304C17.9474 20.656 17.5741 21.0827 17.3501 21.584C17.3821 22.736 17.6594 23.616 18.1821 24.224C18.7154 24.8213 19.3821 25.12 20.1821 25.12ZM29.3826 26.16C28.0066 26.16 27.0412 25.648 26.4866 24.624C25.9426 23.5893 25.6706 22.1653 25.6706 20.352C25.6706 18.5387 25.9479 17.1093 26.5026 16.064C27.0572 15.008 28.0172 14.48 29.3826 14.48C30.7479 14.48 31.7079 15.008 32.2626 16.064C32.8172 17.1093 33.0946 18.5387 33.0946 20.352C33.0946 22.1547 32.8119 23.5733 32.2466 24.608C31.6919 25.6427 30.7372 26.16 29.3826 26.16ZM29.3826 25.072C30.0759 25.072 30.6092 24.864 30.9826 24.448C31.3559 24.032 31.6012 23.488 31.7186 22.816C31.8466 22.1333 31.9106 21.3067 31.9106 20.336C31.9106 18.832 31.7346 17.664 31.3826 16.832C31.0412 15.9893 30.3746 15.568 29.3826 15.568C28.6892 15.568 28.1559 15.776 27.7826 16.192C27.4199 16.608 27.1746 17.1627 27.0466 17.856C26.9186 18.5387 26.8546 19.3707 26.8546 20.352C26.8546 21.3227 26.9186 22.1493 27.0466 22.832C27.1746 23.504 27.4199 24.048 27.7826 24.464C28.1559 24.8693 28.6892 25.072 29.3826 25.072ZM36.9671 19.536C36.5191 19.536 36.1084 19.4293 35.7351 19.216C35.3617 18.992 35.0631 18.6933 34.8391 18.32C34.6257 17.9467 34.5191 17.536 34.5191 17.088C34.5191 16.64 34.6257 16.2293 34.8391 15.856C35.0631 15.4827 35.3617 15.1893 35.7351 14.976C36.1084 14.752 36.5191 14.64 36.9671 14.64C37.4151 14.64 37.8257 14.752 38.1991 14.976C38.5831 15.1893 38.8817 15.4827 39.0951 15.856C39.3191 16.2293 39.4311 16.64 39.4311 17.088C39.4311 17.536 39.3191 17.9467 39.0951 18.32C38.8817 18.6933 38.5831 18.992 38.1991 19.216C37.8257 19.4293 37.4151 19.536 36.9671 19.536ZM36.9671 18.624C37.3937 18.624 37.7564 18.4747 38.0551 18.176C38.3537 17.8773 38.5031 17.5147 38.5031 17.088C38.5031 16.6613 38.3537 16.2987 38.0551 16C37.7564 15.7013 37.3937 15.552 36.9671 15.552C36.5404 15.552 36.1777 15.7013 35.8791 16C35.5911 16.2987 35.4471 16.6613 35.4471 17.088C35.4471 17.5147 35.5911 17.8773 35.8791 18.176C36.1777 18.4747 36.5404 18.624 36.9671 18.624Z" fill="black"/>
            <path d="M16.4626 53L15.1252 51.6822L19.158 47.6822C15.491 47.2025 12.3813 46.3004 9.82878 44.9758C7.27626 43.6511 6 42.1445 6 40.4557C6 38.4501 7.64837 36.7061 10.9451 35.2237C14.2419 33.7412 18.2601 33 23 33C27.7399 33 31.7581 33.7412 35.0549 35.2237C38.3516 36.7061 40 38.4501 40 40.4557C40 41.8089 39.1412 43.0913 37.4236 44.3029C35.7059 45.5144 33.4166 46.4452 30.5556 47.0951V45.2088C32.9796 44.5875 34.8452 43.8189 36.1523 42.9031C37.4594 41.9873 38.1124 41.1715 38.1111 40.4557C38.1111 39.3896 36.7656 38.1911 34.0746 36.8602C31.3835 35.5294 27.692 34.8639 23 34.8639C18.308 34.8639 14.6165 35.5294 11.9254 36.8602C9.23441 38.1911 7.88889 39.3896 7.88889 40.4557C7.88889 41.3454 8.93407 42.3402 11.0244 43.4399C13.1148 44.5409 15.7605 45.3194 18.9616 45.7754L15.1233 41.9897L16.4588 40.6719L22.7072 46.836L16.4626 53Z" fill="black"/>
        </svg>
    );
}

export function Modal360({ open, onClose, name, subtitle }: Modal360Props) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [frameIndex, setFrameIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragStartFrame = useRef(0);

    useEffect(() => {
        if (open) {
            setFrameIndex(0);
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else {
            setVisible(false);
            const t = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(t);
        }
    }, [open]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        setIsDragging(true);
        dragStartX.current = e.clientX;
        dragStartFrame.current = frameIndex;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, [frameIndex]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX.current;
        const sensitivity = 30;
        const frameDelta = Math.round(dx / sensitivity);
        let newIndex = (dragStartFrame.current + frameDelta) % frames360.length;
        if (newIndex < 0) newIndex += frames360.length;
        setFrameIndex(newIndex);
    }, [isDragging]);

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${visible ? 'bg-black/50' : 'bg-black/0'}`}
            onClick={onClose}
        >
            <div
                className={`relative flex w-[1000px] flex-col items-center rounded-[30px] bg-[#EBEBEB] px-10 py-10 transition-all duration-300 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                style={{ height: '731px' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 flex size-10 cursor-pointer items-center justify-center rounded-[60px] border border-black transition-colors hover:bg-black/5"
                    style={{ backdropFilter: 'blur(15px)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6.40331 18.3084L5.69531 17.6004L11.2953 12.0004L5.69531 6.40038L6.40331 5.69238L12.0033 11.2924L17.6033 5.69238L18.3113 6.40038L12.7113 12.0004L18.3113 17.6004L17.6033 18.3084L12.0033 12.7084L6.40331 18.3084Z" fill="black"/>
                    </svg>
                </button>

                {/* Title */}
                <h2 className="mt-6 text-center text-[32px] font-semibold leading-none text-black">
                    {name}
                </h2>

                {/* Subtitle */}
                <p className="mt-3 text-center text-[32px] leading-none text-black">
                    {subtitle}
                </p>

                {/* 360 icon */}
                <div className="mt-4">
                    <Icon360Large />
                </div>

                {/* 360 Viewer */}
                <div
                    className={`mt-4 flex w-full flex-1 items-center justify-center overflow-hidden rounded-[20px] select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    {frames360.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`${name} vista ${i}`}
                            className={`max-h-full max-w-full object-contain transition-opacity duration-150 ${i === frameIndex ? 'block' : 'hidden'}`}
                            draggable={false}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="mt-6 flex items-center gap-4">
                    <a
                        href="#"
                        className="flex items-center gap-2.5 rounded-[60px] border border-black p-1 pl-4 text-base leading-none text-black transition hover:bg-black/5"
                    >
                        Ver detalles
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[60px] border border-black bg-black" style={{ backdropFilter: 'blur(15px)' }}>
                            <ArrowIcon className="text-white" />
                        </span>
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2.5 rounded-[60px] bg-black p-1 pl-4 text-base leading-none text-white transition hover:bg-black/85"
                    >
                        Cotizar
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[60px] bg-white">
                            <ArrowIcon className="text-black" />
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
