interface NikInputFieldProps {
  value: string;
  onChange: (val: string) => void;
}

// Input field NIK (Nomor Induk Kependudukan) — hanya menerima angka, max 16 digit
export function NikInputField({ value, onChange }: NikInputFieldProps) {
  return (
    <div className="flex items-center gap-3 bg-[#DDE9F5] rounded-2xl px-4 py-3">
      {/* Person icon */}
      <div className="flex-shrink-0 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Label + input */}
      <div className="flex flex-col flex-1">
        <label htmlFor="nik" className="text-sm font-bold text-gray-800 leading-none mb-0.5">
          NIK
        </label>
        <input
          id="nik"
          type="text"
          inputMode="numeric"
          maxLength={16}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} // strip non-angka sebelum update state
          placeholder="Masukkan 16 digit NIK Anda"
          className="bg-transparent text-sm text-gray-400 placeholder:text-gray-400 outline-none"
        />
      </div>
    </div>
  );
}
