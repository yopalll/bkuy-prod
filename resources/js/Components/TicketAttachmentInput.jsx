import { useRef } from 'react';

const MAX_FILES = 5;
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

/**
 * Input lampiran gambar untuk tiket bantuan.
 * `files` adalah array File, `onChange` menerima array File baru.
 */
export default function TicketAttachmentInput({ files = [], onChange, error }) {
    const inputRef = useRef(null);

    function addFiles(fileList) {
        const incoming = Array.from(fileList).filter(
            (f) => f.type.startsWith('image/') && f.size <= MAX_SIZE
        );
        const next = [...files, ...incoming].slice(0, MAX_FILES);
        onChange(next);
        if (inputRef.current) inputRef.current.value = '';
    }

    function removeAt(idx) {
        onChange(files.filter((_, i) => i !== idx));
    }

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                {files.map((file, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-outline-variant group">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeAt(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Hapus gambar"
                        >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                    </div>
                ))}

                {files.length < MAX_FILES && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant flex flex-col items-center justify-center gap-0.5 hover:border-primary hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-[22px]">add_photo_alternate</span>
                        <span className="text-[10px] font-medium">Gambar</span>
                    </button>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
            />

            <p className="text-[11px] text-on-surface-variant mt-1.5">
                Maks {MAX_FILES} gambar · JPG/PNG/WebP/GIF · ≤ 4MB per file
            </p>
            {error && <p className="text-xs text-error mt-1">{error}</p>}
        </div>
    );
}
