import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export default function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              {action.icon && (
                <span className="text-2xl">{action.icon}</span>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}




