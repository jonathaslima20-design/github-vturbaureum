import React from 'react';
import { Users, Shield, Ban, Crown, TrendingUp, Calendar, Circle as XCircle, TriangleAlert as AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCounts {
  total: number;
  active: number;
  blocked: number;
  activePlans: number;
  freePlans: number;
  suspendedPlans: number;
  noPlans: number;
  recent7: number;
  recent30: number;
}

interface UserSummaryCardsProps {
  counts: SummaryCounts;
}

export const UserSummaryCards = React.memo(function UserSummaryCards({ counts }: UserSummaryCardsProps) {
  const cards = [
    { title: 'Total de Usuarios', value: counts.total, description: 'Usuarios cadastrados', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
    { title: 'Usuarios Ativos', value: counts.active, description: 'Nao bloqueados', icon: Shield, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950/20' },
    { title: 'Planos Ativos', value: counts.activePlans, description: 'Com assinatura paga', icon: Crown, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950/20' },
    { title: 'Plano Free', value: counts.freePlans, description: 'Usando o plano gratuito', icon: Sparkles, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
    { title: 'Sem Plano', value: counts.noPlans, description: 'Sem assinatura', icon: XCircle, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-950/20' },
    { title: 'Planos Suspensos', value: counts.suspendedPlans, description: 'Assinatura suspensa', icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-950/20' },
    { title: 'Cadastros (7 dias)', value: counts.recent7, description: 'Ultimos 7 dias', icon: TrendingUp, color: 'text-teal-600', bgColor: 'bg-teal-50 dark:bg-teal-950/20' },
    { title: 'Cadastros (30 dias)', value: counts.recent30, description: 'Ultimos 30 dias', icon: Calendar, color: 'text-cyan-600', bgColor: 'bg-cyan-50 dark:bg-cyan-950/20' },
    { title: 'Usuarios Bloqueados', value: counts.blocked, description: 'Acesso suspenso', icon: Ban, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-950/20' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-1.5 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="text-xl font-bold">{card.value}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
