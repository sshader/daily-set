export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="z-50 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center fixed top-0 left-0">
      {children}
    </div>
  );
}
