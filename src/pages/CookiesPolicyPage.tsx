import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LAST_UPDATED = '28 de maio de 2026';

const sections = [
  { id: 'o-que-sao', title: '1. O que são Cookies?' },
  { id: 'tipos', title: '2. Tipos de Cookies que Usamos' },
  { id: 'terceiros', title: '3. Cookies de Terceiros' },
  { id: 'controle', title: '4. Como Controlar Cookies' },
  { id: 'recusa', title: '5. Consequências da Recusa' },
  { id: 'retencao', title: '6. Retenção de Cookies' },
  { id: 'alteracoes', title: '7. Alterações nesta Política' },
  { id: 'contato', title: '8. Contato' },
];

export default function CookiesPolicyPage() {
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
              <nav aria-label="Sumário da Política de Cookies">
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
                Política de Cookies
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

            <article>
              <Section id="o-que-sao" title="1. O que são Cookies?">
                <p>
                  Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular) quando você acessa um site. Eles permitem que o site reconheça seu dispositivo em visitas futuras e ofereça uma experiência mais personalizada e eficiente.
                </p>
                <p>
                  Além dos cookies tradicionais, utilizamos tecnologias similares como <em>localStorage</em>, <em>sessionStorage</em> e identificadores de sessão para fins funcionais.
                </p>
              </Section>

              <Section id="tipos" title="2. Tipos de Cookies que Usamos">
                <CookieTable
                  rows={[
                    {
                      name: 'Essenciais / Necessários',
                      purpose:
                        'Garantem o funcionamento básico da Plataforma: autenticação, sessão, segurança e preferências de interface.',
                      duration: 'Sessão ou até 1 ano',
                      canOptOut: 'Não — necessários para o serviço',
                    },
                    {
                      name: 'Funcionais',
                      purpose:
                        'Lembram preferências como tema (claro/escuro), idioma e configurações de exibição.',
                      duration: 'Até 1 ano',
                      canOptOut: 'Sim, via configurações do navegador',
                    },
                    {
                      name: 'Analytics (plataforma)',
                      purpose:
                        'Coletam dados agregados sobre uso da Plataforma para identificar melhorias e erros. Não identificam o usuário individualmente.',
                      duration: 'Até 2 anos',
                      canOptOut: 'Sim, via configurações do navegador',
                    },
                    {
                      name: 'Analytics (vitrine do vendedor)',
                      purpose:
                        'Cookies de ferramentas configuradas pelo próprio vendedor em sua vitrine (ex.: Google Analytics, Meta Pixel). O vendedor é responsável por obter o consentimento dos seus visitantes.',
                      duration: 'Definida pelo vendedor',
                      canOptOut: 'Sim, via configurações do navegador ou ferramentas de opt-out do provedor',
                    },
                  ]}
                />
              </Section>

              <Section id="terceiros" title="3. Cookies de Terceiros">
                <p>
                  Alguns cookies são definidos por serviços de terceiros que aparecem em nossas páginas. Não controlamos esses cookies, mas a seguir listamos os principais:
                </p>
                <ul>
                  <li>
                    <strong>Supabase:</strong> infraestrutura de autenticação e banco de dados. Cookies de sessão JWT necessários para login seguro.
                  </li>
                  <li>
                    <strong>Mercado Pago:</strong> processamento de pagamentos. Cookies de segurança antifraude definidos durante o fluxo de checkout.
                  </li>
                  <li>
                    <strong>Google Analytics / Meta Pixel (opcional):</strong> definidos apenas nas vitrines onde o vendedor os configurou. Consulte as políticas de privacidade do Google e da Meta para mais informações.
                  </li>
                </ul>
              </Section>

              <Section id="controle" title="4. Como Controlar Cookies">
                <p>
                  Você pode gerenciar ou bloquear cookies a qualquer momento por meio das configurações do seu navegador. Veja como fazer isso nos principais navegadores:
                </p>
                <ul>
                  <li><strong>Google Chrome:</strong> Configurações &gt; Privacidade e segurança &gt; Cookies e outros dados do site</li>
                  <li><strong>Mozilla Firefox:</strong> Opções &gt; Privacidade e Segurança &gt; Cookies e dados do site</li>
                  <li><strong>Safari:</strong> Preferências &gt; Privacidade &gt; Gerenciar dados do site</li>
                  <li><strong>Microsoft Edge:</strong> Configurações &gt; Privacidade, pesquisa e serviços &gt; Cookies</li>
                </ul>
                <p>
                  Você também pode usar extensões de navegador como uBlock Origin ou Privacy Badger para controle avançado.
                </p>
              </Section>

              <Section id="recusa" title="5. Consequências da Recusa">
                <p>
                  Bloquear cookies essenciais pode impedir o funcionamento correto da Plataforma, incluindo login, manutenção de sessão e salvar preferências. Cookies funcionais e de analytics podem ser desativados sem comprometer as funções principais.
                </p>
              </Section>

              <Section id="retencao" title="6. Retenção de Cookies">
                <p>
                  Os cookies são retidos pelo tempo indicado na tabela da seção 2. Cookies de sessão são excluídos automaticamente ao fechar o navegador. Você pode excluir cookies armazenados a qualquer momento pelas configurações do navegador.
                </p>
              </Section>

              <Section id="alteracoes" title="7. Alterações nesta Política">
                <p>
                  Esta Política pode ser atualizada para refletir mudanças nas tecnologias utilizadas ou na legislação. Alterações relevantes serão comunicadas via e-mail ou notificação na Plataforma.
                </p>
              </Section>

              <Section id="contato" title="8. Contato">
                <p>
                  Em caso de dúvidas sobre o uso de cookies, entre em contato:
                </p>
                <ul>
                  <li><strong>Plataforma:</strong> VitrineTurbo</li>
                  <li><strong>E-mail:</strong> privacidade@vitrine.app</li>
                </ul>
                <p>
                  Consulte também nossa{' '}
                  <Link to="/politica-de-privacidade" className="text-primary underline underline-offset-2">
                    Política de Privacidade
                  </Link>{' '}
                  para entender o tratamento completo dos seus dados pessoais.
                </p>
              </Section>
            </article>

            <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link to="/politica-de-privacidade" className="hover:text-foreground transition-colors">
                Política de Privacidade
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
      <div className="space-y-3 text-[0.9375rem] leading-relaxed text-foreground/80 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-foreground [&_em]:italic [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}

function CookieTable({
  rows,
}: {
  rows: { name: string; purpose: string; duration: string; canOptOut: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border mt-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/60 text-left">
            <th className="px-4 py-3 font-semibold text-foreground w-[160px]">Categoria</th>
            <th className="px-4 py-3 font-semibold text-foreground">Finalidade</th>
            <th className="px-4 py-3 font-semibold text-foreground w-[120px]">Duração</th>
            <th className="px-4 py-3 font-semibold text-foreground w-[180px]">Opt-out</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border align-top">
              <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
              <td className="px-4 py-3 text-foreground/80">{row.purpose}</td>
              <td className="px-4 py-3 text-foreground/80">{row.duration}</td>
              <td className="px-4 py-3 text-foreground/80">{row.canOptOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
