import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LAST_UPDATED = '28 de maio de 2026';

const sections = [
  { id: 'introducao', title: '1. Introdução' },
  { id: 'dados-coletados', title: '2. Dados Coletados' },
  { id: 'finalidade', title: '3. Finalidade do Tratamento' },
  { id: 'compartilhamento', title: '4. Compartilhamento de Dados' },
  { id: 'retencao', title: '5. Retenção de Dados' },
  { id: 'direitos', title: '6. Seus Direitos' },
  { id: 'seguranca', title: '7. Segurança' },
  { id: 'cookies', title: '8. Cookies' },
  { id: 'menores', title: '9. Menores de Idade' },
  { id: 'alteracoes', title: '10. Alterações nesta Política' },
  { id: 'contato', title: '11. Contato' },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar ao início
        </Link>

        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Nesta página
              </p>
              <nav aria-label="Sumário da Política de Privacidade">
                <ul className="space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main>
            <header className="mb-10 pb-8 border-b border-border">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Política de Privacidade
              </h1>
              <p className="text-sm text-muted-foreground">
                Última atualização: {LAST_UPDATED}
              </p>
            </header>

            {/* Mobile TOC */}
            <details className="lg:hidden mb-8 p-4 rounded-lg border border-border bg-muted/40">
              <summary className="cursor-pointer text-sm font-semibold">Ver sumário</summary>
              <nav className="mt-3" aria-label="Sumário">
                <ul className="space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>

            <article className="prose-legal">
              <Section id="introducao" title="1. Introdução">
                <p>
                  A <strong>VitrineTurbo</strong> ("nós", "nosso" ou "Plataforma") valoriza a sua privacidade e está comprometida em proteger os seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos informações quando você utiliza nossa plataforma, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) e demais normas aplicáveis.
                </p>
                <p>
                  Ao acessar ou utilizar a VitrineTurbo, você concorda com os termos desta Política. Caso não concorde, recomendamos que não utilize nossos serviços.
                </p>
              </Section>

              <Section id="dados-coletados" title="2. Dados Coletados">
                <p>Coletamos diferentes categorias de dados dependendo do seu relacionamento com a Plataforma:</p>
                <h3>2.1 Dados fornecidos por você</h3>
                <ul>
                  <li>Nome completo e nome de exibição</li>
                  <li>Endereço de e-mail</li>
                  <li>Número de telefone / WhatsApp</li>
                  <li>Logotipo, foto de perfil e imagem de capa</li>
                  <li>Informações de produtos (título, descrição, preço, imagens)</li>
                  <li>Dados de pedidos e clientes inseridos manualmente</li>
                  <li>Chave Pix e dados bancários (para programa de indicação)</li>
                  <li>Dados de pagamento processados via Mercado Pago (não armazenamos dados de cartão)</li>
                </ul>
                <h3>2.2 Dados coletados automaticamente</h3>
                <ul>
                  <li>Endereço IP e dados de geolocalização aproximada</li>
                  <li>Tipo de dispositivo, sistema operacional e navegador</li>
                  <li>Páginas visitadas, tempo de permanência e eventos de clique</li>
                  <li>Cookies e identificadores de sessão (veja nossa Política de Cookies)</li>
                  <li>Logs de acesso e erros técnicos</li>
                </ul>
                <h3>2.3 Dados de visitantes das vitrines</h3>
                <p>
                  Quando um consumidor final visita uma vitrine criada na Plataforma, podemos coletar dados de navegação e interação para fins de analytics fornecidos ao vendedor. O vendedor é corresponsável pelo tratamento desses dados perante seus próprios clientes.
                </p>
              </Section>

              <Section id="finalidade" title="3. Finalidade do Tratamento">
                <p>Utilizamos seus dados para as seguintes finalidades:</p>
                <ul>
                  <li><strong>Prestação do serviço:</strong> criar e manter sua conta, vitrine, produtos e pedidos;</li>
                  <li><strong>Pagamentos:</strong> processar assinaturas e transações via Mercado Pago;</li>
                  <li><strong>Comunicações:</strong> enviar notificações transacionais, atualizações e suporte;</li>
                  <li><strong>Analytics:</strong> fornecer métricas de desempenho da sua vitrine;</li>
                  <li><strong>Segurança:</strong> prevenir fraudes, abusos e acessos não autorizados;</li>
                  <li><strong>Melhorias do produto:</strong> analisar padrões de uso para aprimorar funcionalidades;</li>
                  <li><strong>Obrigações legais:</strong> cumprir determinações de autoridades competentes.</li>
                </ul>
              </Section>

              <Section id="compartilhamento" title="4. Compartilhamento de Dados">
                <p>Não vendemos seus dados pessoais. Podemos compartilhá-los com:</p>
                <ul>
                  <li><strong>Mercado Pago:</strong> para processamento de pagamentos de assinaturas;</li>
                  <li><strong>Supabase:</strong> provedor de infraestrutura de banco de dados e autenticação;</li>
                  <li><strong>Provedores de hospedagem e CDN:</strong> para disponibilização da Plataforma;</li>
                  <li><strong>Ferramentas de analytics:</strong> configuradas por você (ex.: Google Analytics, Meta Pixel), mediante sua própria responsabilidade;</li>
                  <li><strong>Autoridades públicas:</strong> quando exigido por lei ou ordem judicial.</li>
                </ul>
                <p>
                  Todos os terceiros são contratualmente obrigados a tratar os dados de forma segura e apenas para as finalidades autorizadas.
                </p>
              </Section>

              <Section id="retencao" title="5. Retenção de Dados">
                <p>
                  Mantemos seus dados enquanto sua conta estiver ativa ou pelo período necessário para cumprir as finalidades descritas nesta Política. Após o encerramento da conta:
                </p>
                <ul>
                  <li>Dados de conta e produtos são excluídos ou anonimizados em até 90 dias;</li>
                  <li>Dados de faturamento e fiscais podem ser retidos por até 5 anos, conforme legislação tributária;</li>
                  <li>Logs de segurança são mantidos por até 6 meses.</li>
                </ul>
              </Section>

              <Section id="direitos" title="6. Seus Direitos">
                <p>Nos termos da LGPD, você possui os seguintes direitos:</p>
                <ul>
                  <li><strong>Acesso:</strong> confirmar a existência de tratamento e obter cópia dos seus dados;</li>
                  <li><strong>Correção:</strong> solicitar correção de dados incompletos ou desatualizados;</li>
                  <li><strong>Exclusão:</strong> requerer a exclusão dos seus dados pessoais;</li>
                  <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado;</li>
                  <li><strong>Revogação do consentimento:</strong> retirar consentimentos previamente concedidos;</li>
                  <li><strong>Oposição:</strong> opor-se a tratamentos realizados com base em legítimo interesse;</li>
                  <li><strong>Informação:</strong> ser informado sobre o uso e compartilhamento dos seus dados.</li>
                </ul>
                <p>
                  Para exercer seus direitos, entre em contato pelo e-mail indicado na seção 11.
                </p>
              </Section>

              <Section id="seguranca" title="7. Segurança">
                <p>
                  Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acessos não autorizados, perda, destruição ou divulgação indevida, incluindo:
                </p>
                <ul>
                  <li>Criptografia em trânsito via TLS/HTTPS;</li>
                  <li>Controles de acesso baseados em função (RBAC) e Row Level Security (RLS) no banco de dados;</li>
                  <li>Autenticação segura com hashing de senhas;</li>
                  <li>Monitoramento contínuo e alertas de segurança.</li>
                </ul>
                <p>
                  Nenhum sistema é absolutamente inviolável. Em caso de incidente de segurança, notificaremos os afetados e a ANPD nos prazos legais.
                </p>
              </Section>

              <Section id="cookies" title="8. Cookies">
                <p>
                  Utilizamos cookies e tecnologias similares para funcionamento da Plataforma e analytics. Para detalhes completos, consulte nossa{' '}
                  <Link to="/politica-de-cookies" className="text-primary underline underline-offset-2">
                    Política de Cookies
                  </Link>
                  .
                </p>
              </Section>

              <Section id="menores" title="9. Menores de Idade">
                <p>
                  A VitrineTurbo não é direcionada a menores de 18 anos. Não coletamos intencionalmente dados de crianças ou adolescentes. Se identificarmos tal situação, excluiremos os dados imediatamente.
                </p>
              </Section>

              <Section id="alteracoes" title="10. Alterações nesta Política">
                <p>
                  Podemos atualizar esta Política periodicamente. Alterações materiais serão comunicadas por e-mail ou notificação na Plataforma com antecedência mínima de 15 dias. O uso continuado dos serviços após essa data implica aceitação das mudanças.
                </p>
              </Section>

              <Section id="contato" title="11. Contato">
                <p>
                  Para dúvidas, solicitações ou exercício de direitos relacionados a esta Política, entre em contato com nosso Encarregado de Proteção de Dados (DPO):
                </p>
                <ul>
                  <li><strong>Plataforma:</strong> VitrineTurbo</li>
                  <li><strong>E-mail:</strong> privacidade@vitrine.app</li>
                </ul>
              </Section>
            </article>

            <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link to="/politica-de-cookies" className="hover:text-foreground transition-colors">
                Política de Cookies
              </Link>
              <Link to="/termos-de-uso" className="hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-border mt-16 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VitrineTurbo. Todos os direitos reservados.
      </footer>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground">{title}</h2>
      <div className="space-y-3 text-[0.9375rem] leading-relaxed text-foreground/80 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}
