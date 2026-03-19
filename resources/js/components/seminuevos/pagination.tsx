import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | '...')[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="mt-10 flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
                <ChevronLeft className="size-5 text-black" />
            </button>

            {getPages().map((page, i) =>
                page === '...' ? (
                    <span key={`dots-${i}`} className="flex size-10 items-center justify-center text-black/40">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`flex size-10 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition ${
                            page === currentPage
                                ? 'bg-black text-white'
                                : 'border border-black/10 bg-white text-black hover:bg-black/5'
                        }`}
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
                <ChevronRight className="size-5 text-black" />
            </button>
        </div>
    );
}
