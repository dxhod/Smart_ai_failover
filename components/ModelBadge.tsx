import { modelLabel } from '@/lib/mappers';
import type { ProviderModel } from '@/lib/types';

type Props = {
  model: ProviderModel;
};

export function ModelBadge({ model }: Props) {
  const className =
    model === 'claude'
      ? 'border-warn/30 bg-warn/10 text-warn'
      : 'border-accent/30 bg-accent/10 text-accent';

  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-xs font-semibold ${className}`}>
      {modelLabel(model)}
    </span>
  );
}
