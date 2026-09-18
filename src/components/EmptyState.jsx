import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionText,
  onAction,
  icon: Icon = Layers,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center max-w-lg mx-auto my-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 mb-4 shadow-inner">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} icon={ArrowRight}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
