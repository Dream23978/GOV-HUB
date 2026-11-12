import { motion, AnimatePresence } from "motion/react";

// Daftar aturan password beserta fungsi test-nya
const rules = [
  { label: "Minimal 8 karakter", test: (p: string) => p.length >= 8 },
  { label: "Minimal 1 huruf besar (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Minimal 1 huruf kecil (a–z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "Minimal 1 angka (0–9)", test: (p: string) => /[0-9]/.test(p) },
  { label: "Minimal 1 karakter khusus ( @, #, $, %, !, ? )", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

// Tampilkan checklist rule password secara real-time saat user mengetik
// Masing-masing rule berubah jadi hijau + centang kalau sudah terpenuhi
export function PasswordRulesChecklist({ password }: { password: string }) {
  if (!password) return null; // sembunyikan checklist kalau input masih kosong

  return (
    <AnimatePresence>
      <motion.ul
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-1.5 mt-2 mb-1"
      >
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <motion.li
              key={rule.label}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs"
            >
              <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300 ${
                passed ? "bg-green-500" : "bg-gray-200"
              }`}>
                {passed && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </span>
              <span className={`transition-colors duration-300 ${passed ? "text-green-600 line-through" : "text-gray-400"}`}>
                {rule.label}
              </span>
            </motion.li>
          );
        })}
      </motion.ul>
    </AnimatePresence>
  );
}
