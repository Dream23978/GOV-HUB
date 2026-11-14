interface EmailPhoneInputFieldProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

// Input field Email/No Handphone untuk form registrasi
export function EmailPhoneInputField({
  value,
  onChange,
  error,
}: EmailPhoneInputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-3 bg-[#DDE9F5] rounded-2xl px-4 py-3 ${
          error ? "ring-2 ring-red-400" : ""
        }`}
      >
        {/* Mail icon */}
        <div className="flex-shrink-0 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        </div>

        {/* Label + input */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor="email-phone"
            className="text-sm font-bold text-gray-800 leading-none mb-0.5"
          >
            Email/No Handphone
          </label>
          <input
            id="email-phone"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Masukkan email atau no. handphone Anda"
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-0.5 px-1">{error}</p>}
    </div>
  );
}
