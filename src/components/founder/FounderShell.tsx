import FounderSidebar from './FounderSidebar';
import FounderTopbar from './FounderTopbar';

interface FounderShellProps {
  children: React.ReactNode;
}

export default function FounderShell({ children }: FounderShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <FounderSidebar />
      <div className="flex-1 flex flex-col">
        <FounderTopbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


