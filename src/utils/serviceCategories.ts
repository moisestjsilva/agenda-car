import { ServiceCategory } from '../types';

export const serviceCategories = [
  { value: 'washing', label: 'Lavagem' },
  { value: 'polishing', label: 'Polimento' },
  { value: 'coating', label: 'Vitrificação' },
  { value: 'detailing', label: 'Detalhamento' },
  { value: 'other', label: 'Outros' },
] as const;

export function formatServiceCategory(category: ServiceCategory): string {
  return serviceCategories.find((c) => c.value === category)?.label || category;
}