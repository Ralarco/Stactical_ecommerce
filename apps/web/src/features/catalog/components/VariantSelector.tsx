import type { Variant } from '@stactical/shared-types';

interface VariantSelectorProps {
  variants: Variant[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function VariantSelector({ variants, selectedId, onChange }: VariantSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedId;
        const isOutOfStock = variant.availableStock === 0;
        
        return (
          <button
            key={variant.id}
            onClick={() => onChange(variant.id)}
            disabled={isOutOfStock}
            className={`
              relative min-w-[80px] border px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all
              ${isSelected 
                ? 'border-gold bg-gold/5 text-gold' 
                : 'border-surface-container-high bg-pure-white text-on-surface-variant hover:border-gold/40'
              }
              ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {variant.size || variant.color || variant.sku}
            {isSelected && (
              <div className="absolute -right-1 -top-1 h-2 w-2 bg-gold" />
            )}
          </button>
        );
      })}
    </div>
  );
}
