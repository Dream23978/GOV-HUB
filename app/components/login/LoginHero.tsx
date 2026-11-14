import Image from "next/image";

export function LoginHero() {
  return (
    <div className="relative w-full h-full min-h-[300px]">
      <Image
        src="/garuda.png"
        alt="Garuda Pancasila — Lambang Negara Republik Indonesia"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center"
        priority
      />
    </div>
  );
}
