// Backend mode config (V15/V16 switch)
export function getBackendMode(): 'v15' | 'v16' {
  if (typeof window !== 'undefined') {
    return (window as any).NEXT_PUBLIC_BACKEND_MODE || process.env.NEXT_PUBLIC_BACKEND_MODE || 'v15';
  }
  return process.env.NEXT_PUBLIC_BACKEND_MODE === 'v16' ? 'v16' : 'v15';
}
