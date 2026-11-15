import Image from "next/image";

export const LogoFull = ({ className = "" }: { className?: string }) => (
  <Image src="/brand/logo-full.webp" alt="M-Bond ระบบตราสารหนี้" width={328} height={372} priority className={className} />
);
export const LogoMark = ({ className = "" }: { className?: string }) => (
  <Image src="/brand/logo-mark.webp" alt="M-Bond" width={243} height={183} className={className} />
);
