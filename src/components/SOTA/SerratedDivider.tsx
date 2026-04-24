export default function SerratedDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`h-[10px] w-full serrated-edge bg-stone-black relative z-10 ${className}`} />
  );
}
