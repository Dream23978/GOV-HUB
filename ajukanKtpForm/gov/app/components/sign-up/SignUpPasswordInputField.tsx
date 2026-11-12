"use client";

import { useState } from "react";

interface SignUpPasswordInputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

// Input field password dengan toggle show/hide — dipakai untuk Password & Konfirmasi Password
export function SignUpPasswordInputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
}: SignUpPasswordInputFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-3 bg-[#DDE9F5] rounded-2xl px-4 py-3 ${
          error ? "ring-2 ring-red-400" : ""
        }`}
      >
        {/* Lock icon */}
        <div className="flex-shrink-0 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Label + input */}
        <div className="flex flex-col flex-1">
          <label
            htmlFor={id}
            className="text-sm font-bold text-gray-800 leading-none mb-0.5"
          >
            {label}
          </label>
          <input
            id={id}
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>

        {/* Show/hide toggle */}
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        >
          {show ? (
            /* Eye open */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
            </svg>
          ) : (
            /* Eye slash */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577A11.217 11.217 0 0112 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113zM15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.5 15.713l-4.244-4.244a3.75 3.75 0 004.244 4.243zM1.33 11.447C2.82 6.976 7.028 3.75 12 3.75c.85 0 1.678.105 2.47.303L12.5 6.023A5.25 5.25 0 007.5 12c0 .818.197 1.59.543 2.273L4.86 16.556A11.248 11.248 0 011.33 12.553a1.75 1.75 0 010-1.106z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-0.5 px-1">{error}</p>}
    </div>
  );
}
