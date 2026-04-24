export default function CatalogLabel({ 
  fig, 
  status = "Active",
  className = "" 
}: { 
  fig: string; 
  status?: string;
  className?: string;
}) {
  return (
    <div className={`absolute top-4 left-4 z-20 glass-nav px-3 py-1.5 rounded-full flex items-center gap-3 ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-tighter opacity-60">Fig. {fig}</span>
      <div className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-pulse" />
      <span className="font-mono text-[10px] uppercase tracking-widest">{status}</span>
    </div>
  );
}
