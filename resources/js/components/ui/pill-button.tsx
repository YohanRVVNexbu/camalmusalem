type PillButtonProps = {
    children: React.ReactNode;
    variant?: 'outline' | 'solid';
    active?: boolean;
    onClick?: () => void;
    className?: string;
};

export function PillButton({ children, variant = 'outline', active = false, onClick, className = '' }: PillButtonProps) {
    const base = 'cursor-pointer rounded-[60px] px-5 py-2.5 text-base leading-none transition shrink-0';
    const variants = {
        outline: active
            ? 'border border-black bg-black text-white'
            : 'border border-black/80 text-black/80 hover:bg-black/5',
        solid: 'bg-black text-white hover:bg-black/85',
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}
