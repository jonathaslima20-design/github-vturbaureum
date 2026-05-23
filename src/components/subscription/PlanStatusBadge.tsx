import { Badge } from '@/components/ui/badge';
import { Crown, CircleAlert as AlertCircle, Ban, Sparkles } from 'lucide-react';
import type { PlanStatus } from '@/types';

interface PlanStatusBadgeProps {
  status?: PlanStatus;
  className?: string;
}

export default function PlanStatusBadge({ status, className }: PlanStatusBadgeProps) {
  switch (status) {
    case 'active':
      return (
        <Badge className={`bg-green-500 hover:bg-green-600 text-white ${className}`}>
          <Crown className="h-3 w-3 mr-1" />
          Plano Ativo
        </Badge>
      );
    case 'free':
      return (
        <Badge variant="outline" className={`border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 ${className}`}>
          <Sparkles className="h-3 w-3 mr-1" />
          Plano Free
        </Badge>
      );
    case 'suspended':
      return (
        <Badge variant="destructive" className={className}>
          <Ban className="h-3 w-3 mr-1" />
          Plano Suspenso
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={className}>
          <AlertCircle className="h-3 w-3 mr-1" />
          Plano Inativo
        </Badge>
      );
  }
}