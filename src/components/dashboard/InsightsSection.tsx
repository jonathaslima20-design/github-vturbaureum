import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TriangleAlert as AlertTriangle, TrendingUp, Info, CircleAlert as AlertCircle, ArrowRight, Loader as Loader2, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardInsights, Insight } from '@/hooks/useDashboardInsights';

function InsightCard({ insight }: { insight: Insight }) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (insight.type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'success': return <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />;
      case 'info': return <Info className="h-4 w-4 text-sky-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (insight.type) {
      case 'warning': return 'border-l-amber-500';
      case 'success': return 'border-l-emerald-600';
      case 'alert': return 'border-l-red-500';
      case 'info': return 'border-l-sky-500';
    }
  };

  return (
    <div className={`rounded-lg border border-l-4 ${getBorderColor()} p-4 bg-card`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{insight.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{insight.message}</p>
          {insight.actionLabel && insight.actionPath && (
            <button
              onClick={() => navigate(insight.actionPath!)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-2"
            >
              {insight.actionLabel}
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function InsightsSection() {
  const { insights, loading } = useDashboardInsights();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Insights da Sua Vitrine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Insights da Sua Vitrine
        </CardTitle>
        <p className="text-sm text-muted-foreground">Recomendacoes baseadas nos seus dados</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
