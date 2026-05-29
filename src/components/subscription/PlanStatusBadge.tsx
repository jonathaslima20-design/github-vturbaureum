import { Badge } from '@/components/ui/badge';
import { Gem, CircleAlert as AlertCircle, Ban, Sparkles, Clock } from 'lucide-react';
import type { PlanStatus } from '@/types';

interface PlanStatusBadgeProps {
  status?: PlanStatus;
  planName?: string;
  className?: string;
}

export default function PlanStatusBadge({ status, planName, className }: PlanStatusBadgeProps) {
  switch (status) {
    case 'active':
      return (
        <Badge className={`bg-foreground text-background hover:bg-foreground/90 ${className || ''}`}>
          <Gem className="h-3 w-3 mr-1" />
          {planName ? planName : 'Ativo'}
        </Badge>
      );
    case 'free':
      return (
        <Badge variant="outline" className={className}>
          <Sparkles className="h-3 w-3 mr-1" />
          Free
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="outline" className={`border-amber-300 bg-amber-50 text-amber-800 ${className || ''}`}>
          <Clock className="h-3 w-3 mr-1" />
          {planName ? `${planName} (Expirado)` : 'Expirado'}
        </Badge>
      );
    case 'suspended':
      return (
        <Badge variant="destructive" className={className}>
          <Ban className="h-3 w-3 mr-1" />
          {planName ? `${planName} (Suspenso)` : 'Suspenso'}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          <AlertCircle className="h-3 w-3 mr-1" />
          Sem Plano
        </Badge>
      );
  }
}