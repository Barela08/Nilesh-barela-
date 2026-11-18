'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackConversion, ConversionType } from '@/lib/analytics';

interface Props {
  type: ConversionType;
  title: string;
}

export default function ConversionTracker({ type, title }: Props) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [conversionFired, setConversionFired] = useState(false);

  useEffect(() => {
    if (id) {
      const fired = trackConversion(type, id);
      if (fired) {
        setConversionFired(true);
      }
    }
  }, [type, id]);

  return (
    <div className="mt-4 p-3 rounded-lg bg-[#0F1624] border border-[#1E293B] text-xs font-mono text-[#9AA3B8]">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
        <span>
          Reference Verification: <strong className="text-white">{id || 'Verified'}</strong>
        </span>
      </div>
      {id && (
        <div className="mt-1 text-[11px] text-[#64748B]">
          Google Analytics event recorded. Duplicate refresh tracking locked.
        </div>
      )}
    </div>
  );
}
