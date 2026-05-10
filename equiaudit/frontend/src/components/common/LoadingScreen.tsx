export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-20 h-20 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />

        <p className="mt-6 uppercase tracking-widest text-primary text-sm">
          Initializing Audit System...
        </p>
      </div>
    </div>
  );
}