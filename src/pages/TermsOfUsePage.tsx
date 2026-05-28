import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LAST_UPDATED = '28 de maio de 2026';

const sections = [
  { id: 'aceitacao', title: '1. Aceitação dos Termos' },
  { id: 'definicoes', title: '2. Definições' },
  { id: 'cadastro', title: '3. Cadastro e Conta' },
  { id: 'planos', title: '4. Planos e Pagamentos' },
  { id: 'uso-aceitavel', title: '5. Uso Aceitável' },
  { id: 'conteudo', title: '6. Conteúdo do Usuário' },
  { id: 'propriedade', title: '7. Propriedade Intelectual' },
  { id: 'responsabilidade', title: '8. Limitação de Responsabilidade' },
  { id: 'disponibilidade', title: '9. Disponibilidade do Serviço' },
  { id: 'rescisao', title: '10. Rescisão' },
  { id: 'relacao-vendedores', title: '11. Relação com Vendedores e Clientes Finais' },
  { id: 'lei', title: '12. Lei Aplicável e Foro' },
  { id: 'alteracoes', title: '13. Alterações nos Termos' },
  { id: 'contato', title: '14. Contato' },
];

export default function TermsOfUsePage() {
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
              <nav aria-label="Sumário dos Termos de Uso">
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
                Termos de Uso
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
              <Section id="aceitacao" title="1. Aceitação dos Termos">
                <p>
                  Ao se cadastrar, acessar ou usar a plataforma <strong>VitrineTurbo</strong> ("Plataforma", "nós" ou "nosso"), você ("Usuário") concorda integralmente com estes Termos de Uso e com nossa{' '}
                  <Link to="/politica-de-privacidade" className="text-primary underline underline-offset-2">
                    Política de Privacidade
                  </Link>
                  . Se você não concordar com qualquer disposição destes Termos, não utilize a Plataforma.
                </p>
                <p>
                  Estes Termos constituem o acordo integral entre você e a VitrineTurbo e prevalecem sobre qualquer comunicação anterior.
                </p>
              </Section>

              <Section id="definicoes" title="2. Definições">
                <ul>
                  <li><strong>Plataforma:</strong> o conjunto de sistemas, aplicativos web e APIs disponibilizados pela VitrineTurbo.</li>
                  <li><strong>Vendedor / Usuário Assinante:</strong> pessoa física ou jurídica que cria uma conta e utiliza a Plataforma para criar e gerenciar sua vitrine online.</li>
                  <li><strong>Vitrine:</strong> o espaço digital personalizado criado pelo Vendedor para exibir seus produtos ao público.</li>
                  <li><strong>Cliente Final / Visitante:</strong> o consumidor que acessa a vitrine de um Vendedor.</li>
                  <li><strong>Conteúdo:</strong> textos, imagens, preços, descrições e quaisquer dados inseridos pelo Vendedor na Plataforma.</li>
                  <li><strong>Plano:</strong> o nível de assinatura contratado, com funcionalidades e limites definidos.</li>
                </ul>
              </Section>

              <Section id="cadastro" title="3. Cadastro e Conta">
                <p>
                  Para utilizar a Plataforma, o Vendedor deve:
                </p>
                <ul>
                  <li>Ter capacidade civil plena (ser maior de 18 anos ou emancipado legalmente);</li>
                  <li>Fornecer informações verdadeiras, precisas e atualizadas no cadastro;</li>
                  <li>Manter a confidencialidade de sua senha e não compartilhá-la com terceiros;</li>
                  <li>Notificar imediatamente a VitrineTurbo em caso de acesso não autorizado à sua conta.</li>
                </ul>
                <p>
                  O Vendedor é o único responsável pelas ações realizadas em sua conta. A VitrineTurbo reserva-se o direito de recusar cadastros ou encerrar contas a qualquer momento, por violação destes Termos ou por razões de segurança.
                </p>
              </Section>

              <Section id="planos" title="4. Planos e Pagamentos">
                <h3>4.1 Assinatura</h3>
                <p>
                  O uso completo da Plataforma está condicionado à contratação de um Plano de assinatura. Os planos disponíveis, seus preços e funcionalidades são apresentados na página de planos da Plataforma e podem ser alterados mediante aviso prévio.
                </p>
                <h3>4.2 Cobrança</h3>
                <p>
                  Os pagamentos são processados de forma segura via <strong>Mercado Pago</strong>. Ao assinar, você autoriza a cobrança recorrente conforme o período escolhido (mensal, trimestral ou anual). O acesso ao plano contratado é liberado imediatamente após a confirmação do pagamento.
                </p>
                <h3>4.3 Cancelamento e Reembolso</h3>
                <p>
                  Você pode cancelar sua assinatura a qualquer momento pelo painel. O cancelamento terá efeito ao fim do período vigente, sem reembolso proporcional, salvo em casos previstos pelo Código de Defesa do Consumidor (CDC), como o direito de arrependimento de 7 dias para contratos firmados à distância.
                </p>
                <h3>4.4 Inadimplência</h3>
                <p>
                  Em caso de falha no pagamento, o acesso às funcionalidades pagas poderá ser suspenso até a regularização. Dados e conteúdos são preservados por até 90 dias após o vencimento; após esse prazo, poderão ser excluídos.
                </p>
                <h3>4.5 Plano Gratuito</h3>
                <p>
                  Quando disponível, o plano gratuito oferece funcionalidades limitadas e não inclui suporte prioritário. A VitrineTurbo pode descontinuar ou alterar o plano gratuito mediante aviso com antecedência mínima de 30 dias.
                </p>
              </Section>

              <Section id="uso-aceitavel" title="5. Uso Aceitável">
                <p>O Vendedor compromete-se a NÃO utilizar a Plataforma para:</p>
                <ul>
                  <li>Publicar, vender ou promover produtos ou serviços ilegais, falsificados, roubados ou que violem direitos de terceiros;</li>
                  <li>Realizar atividades que violem leis de proteção ao consumidor, tributárias, trabalhistas ou ambientais;</li>
                  <li>Enviar spam, comunicações não solicitadas ou enganosas;</li>
                  <li>Inserir vírus, malware ou qualquer código malicioso;</li>
                  <li>Realizar engenharia reversa, scraping não autorizado ou tentativas de invasão à Plataforma;</li>
                  <li>Criar múltiplas contas para burlar limites de planos ou bloqueios;</li>
                  <li>Comercializar produtos adultos, armas, drogas ilícitas, conteúdo de ódio ou qualquer item proibido pela legislação brasileira;</li>
                  <li>Usar a Plataforma de forma que prejudique outros usuários ou a própria infraestrutura.</li>
                </ul>
                <p>
                  A VitrineTurbo pode remover Conteúdo ou suspender contas que violem estas regras, a qualquer tempo e sem aviso prévio quando necessário para proteger a integridade da Plataforma.
                </p>
              </Section>

              <Section id="conteudo" title="6. Conteúdo do Usuário">
                <h3>6.1 Responsabilidade</h3>
                <p>
                  O Vendedor é inteiramente responsável por todo o Conteúdo inserido na Plataforma, incluindo textos, imagens, preços e informações de produtos. A VitrineTurbo não realiza revisão editorial prévia do Conteúdo.
                </p>
                <h3>6.2 Licença</h3>
                <p>
                  Ao inserir Conteúdo na Plataforma, o Vendedor concede à VitrineTurbo uma licença não exclusiva, mundial, gratuita e sublicenciável para hospedar, armazenar, reproduzir e exibir o Conteúdo exclusivamente para fins de prestação do serviço.
                </p>
                <h3>6.3 Imagens e Direitos Autorais</h3>
                <p>
                  O Vendedor declara ter os direitos necessários para publicar as imagens e demais conteúdos protegidos. A VitrineTurbo não é responsável por violações de direitos autorais cometidas por Vendedores.
                </p>
                <h3>6.4 Remoção</h3>
                <p>
                  A VitrineTurbo pode remover Conteúdo que viole estes Termos, direitos de terceiros ou determinações legais, sem obrigação de aviso prévio nesses casos.
                </p>
              </Section>

              <Section id="propriedade" title="7. Propriedade Intelectual">
                <p>
                  Todos os elementos da Plataforma — incluindo marca, logotipos, interface, código-fonte, textos e funcionalidades — são de propriedade exclusiva da VitrineTurbo ou de seus licenciadores. É vedada qualquer reprodução, distribuição ou uso comercial sem autorização expressa e por escrito.
                </p>
                <p>
                  O Conteúdo inserido pelo Vendedor permanece de sua propriedade. A licença concedida à VitrineTurbo (seção 6.2) encerra-se quando o Conteúdo é removido ou a conta encerrada.
                </p>
              </Section>

              <Section id="responsabilidade" title="8. Limitação de Responsabilidade">
                <p>
                  Na máxima extensão permitida pela legislação aplicável:
                </p>
                <ul>
                  <li>A VitrineTurbo não garante que a Plataforma estará disponível de forma ininterrupta ou sem falhas;</li>
                  <li>Não nos responsabilizamos por perdas indiretas, lucros cessantes, danos a dados ou reputação decorrentes do uso ou impossibilidade de uso da Plataforma;</li>
                  <li>Nossa responsabilidade total a você não excederá o valor pago nos últimos 3 meses de assinatura;</li>
                  <li>Não somos responsáveis pelas transações entre Vendedores e seus Clientes Finais, que são relações jurídicas independentes.</li>
                </ul>
                <p>
                  Nada nestes Termos exclui responsabilidade por dolo, fraude ou violações de direitos do consumidor irrenunciáveis por lei.
                </p>
              </Section>

              <Section id="disponibilidade" title="9. Disponibilidade do Serviço">
                <p>
                  Envidamos esforços razoáveis para manter a Plataforma disponível 24/7. Manutenções programadas serão comunicadas com antecedência sempre que possível. Não garantimos disponibilidade mínima contratual (SLA) exceto para planos que prevejam expressamente tal garantia.
                </p>
                <p>
                  Podemos encerrar ou modificar funcionalidades com aviso prévio mínimo de 30 dias, exceto em situações de emergência de segurança.
                </p>
              </Section>

              <Section id="rescisao" title="10. Rescisão">
                <p>
                  Qualquer das partes pode encerrar o contrato a qualquer momento:
                </p>
                <ul>
                  <li><strong>Pelo Vendedor:</strong> cancelando a assinatura pelo painel da conta;</li>
                  <li><strong>Pela VitrineTurbo:</strong> por violação grave destes Termos (efeito imediato) ou por encerramento do serviço (aviso prévio de 60 dias).</li>
                </ul>
                <p>
                  Após a rescisão, o Vendedor tem 30 dias para exportar seus dados. Após esse prazo, os dados poderão ser permanentemente excluídos, salvo obrigação legal de retenção.
                </p>
              </Section>

              <Section id="relacao-vendedores" title="11. Relação com Vendedores e Clientes Finais">
                <p>
                  A VitrineTurbo é uma plataforma de tecnologia que fornece infraestrutura para Vendedores criarem suas vitrines. Não somos parte nas relações de consumo entre Vendedores e seus Clientes Finais, não intermediamos pagamentos entre eles (salvo onde explicitamente indicado) e não assumimos responsabilidade por:
                </p>
                <ul>
                  <li>Qualidade, entrega ou conformidade dos produtos vendidos;</li>
                  <li>Disputas, chargebacks ou reclamações entre Vendedor e Cliente Final;</li>
                  <li>Cumprimento pelo Vendedor de obrigações fiscais, trabalhistas ou de proteção ao consumidor perante seus clientes.</li>
                </ul>
                <p>
                  Cada Vendedor é responsável por operar sua vitrine em conformidade com o CDC, LGPD e demais normas aplicáveis ao seu negócio.
                </p>
              </Section>

              <Section id="lei" title="12. Lei Aplicável e Foro">
                <p>
                  Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias decorrentes destes Termos, fica eleito o foro da Comarca de São Paulo/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja, salvo disposição legal imperativa em contrário.
                </p>
              </Section>

              <Section id="alteracoes" title="13. Alterações nos Termos">
                <p>
                  Podemos revisar estes Termos a qualquer momento. Alterações materiais serão comunicadas por e-mail ou notificação na Plataforma com antecedência mínima de 15 dias. O uso continuado da Plataforma após o prazo constitui aceite das novas condições.
                </p>
              </Section>

              <Section id="contato" title="14. Contato">
                <p>
                  Para esclarecimentos sobre estes Termos ou qualquer aspecto do serviço:
                </p>
                <ul>
                  <li><strong>Plataforma:</strong> VitrineTurbo</li>
                  <li><strong>E-mail:</strong> contato@vitrine.app</li>
                </ul>
              </Section>
            </article>

            <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link to="/politica-de-privacidade" className="hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/politica-de-cookies" className="hover:text-foreground transition-colors">
                Política de Cookies
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
