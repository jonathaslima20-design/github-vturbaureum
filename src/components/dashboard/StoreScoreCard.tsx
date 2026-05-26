import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader as Loader2, Check, Circle, ArrowRight, Award } from 'lucide-react';
import { useStoreScore } from '@/hooks/useStoreScore';
import { useNavigate } from 'react-router-dom';

function ScoreCircle({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 70) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 40) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          className="stroke-muted"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getColor()} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-bold ${getColor().split(' ')[0]}`}>{score}</span>
      </div>
    </div>
  );
}

export function StoreScoreCard() {
  const { score, criteria, loading } = useStoreScore();
  const navigate = useNavigate();

  const incompleteCriteria = criteria.filter(c => !c.achieved);
  const showChecklist = score < 100 && incompleteCriteria.length > 0;

  const getActionPath = (label: string): string => {
    if (label.includes('produto')) return '/dashboard/create-product';
    if (label.includes('Categoria')) return '/dashboard/categories';
    if (label.includes('Instagram') || label.includes('WhatsApp') || label.includes('perfil') || label.includes('negocio') || label.includes('Link')) return '/dashboard/settings';
    return '/dashboard/settings';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Score da Vitrine
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {score >= 70 ? 'Sua vitrine esta otimizada!' : 'Complete os itens abaixo para otimizar sua vitrine'}
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center gap-2">
              <ScoreCircle score={score} />
              <p className="text-xs text-muted-foreground text-center">
                {score >= 70 ? 'Excelente' : score >= 40 ? 'Bom' : 'Precisa melhorar'}
              </p>
            </div>

            {showChecklist && (
              <div className="flex-1 space-y-2">
                {criteria.map((criterion) => (
                  <div key={criterion.label} className="flex items-center gap-2">
                    {criterion.achieved ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={`text-xs ${criterion.achieved ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {criterion.label}
                    </span>
                    {!criterion.achieved && (
                      <button
                        onClick={() => navigate(getActionPath(criterion.label))}
                        className="ml-auto"
                      >
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
