import Link from "next/link";
import React from "react";

interface KtpServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  href: string;
}

export function KtpServiceCard({
  icon,
  title,
  description,
  href,
}: KtpServiceCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group min-h-[270px]">
      {/* Top content area */}
      <div className="pt-8 pb-6 px-6 flex flex-col items-center justify-center text-center flex-1">
        {/* Rounded icon badge */}
        {icon}

        {/* Title */}
        <h2 className="text-[15px] md:text-base font-bold text-gray-900 dark:text-white leading-tight mt-1">
          {title}
        </h2>

        {/* Description */}
        <div className="text-xs md:text-[13px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          {description}
        </div>
      </div>

      {/* Horizontal divider line & Masuk action */}
      <div className="border-t border-gray-200 dark:border-slate-700">
        <Link
          href={href}
          className="block w-full py-3.5 text-center text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
}
