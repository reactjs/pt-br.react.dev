---
title: Construir uma Aplicação React do Zero
---

<Intro>

Se sua aplicação tem restrições que não são bem atendidas pelos frameworks existentes, você prefere construir seu próprio framework, ou apenas quer aprender o básico de uma aplicação React, você pode construir uma aplicação React do zero.

</Intro>

<DeepDive>

#### Considere usar um framework {/*consider-using-a-framework*/}

Começar do zero é uma maneira fácil de começar a usar React, mas um compromisso importante a ter em mente é que seguir este caminho é muitas vezes o mesmo que construir seu próprio framework ad hoc. À medida que seus requisitos evoluem, você pode precisar resolver mais problemas semelhantes a frameworks para os quais nossos frameworks recomendados já têm soluções bem desenvolvidas e suportadas.

Por exemplo, se no futuro sua aplicação precisar de suporte para renderização do lado do servidor (SSR), geração de site estático (SSG), e/ou React Server Components (RSC), você terá que implementá-los por conta própria. Da mesma forma, futuras funcionalidades do React que requerem integração no nível do framework terão que ser implementadas por você se quiser usá-las.

Nossos frameworks recomendados também ajudam você a construir aplicações com melhor performance. Por exemplo, reduzir ou eliminar cascatas de requisições de rede proporciona uma melhor experiência do usuário. Isso pode não ser uma alta prioridade quando você está construindo um projeto de teste, mas se sua aplicação ganhar usuários, você pode querer melhorar sua performance.

Seguir este caminho também torna mais difícil obter suporte, já que a maneira como você desenvolve roteamento, busca de dados e outras funcionalidades será única para sua situação. Você deve escolher esta opção apenas se estiver confortável em lidar com esses problemas por conta própria, ou se estiver confiante de que nunca precisará dessas funcionalidades.

Para uma lista de frameworks recomendados, confira [Criando uma Aplicação React](/learn/creating-a-react-app).

</DeepDive>

## Passo 1: Instalar uma ferramenta de build {/*step-1-install-a-build-tool*/}

O primeiro passo é instalar uma ferramenta de build como `vite`, `parcel`, ou `rsbuild`. Essas ferramentas de build fornecem funcionalidades para empacotar e executar código fonte, fornecem um servidor de desenvolvimento para desenvolvimento local e um comando de build para fazer deploy da sua aplicação em um servidor de produção.

### Vite {/*vite*/}

[Vite](https://vite.dev/) é uma ferramenta de build que visa fornecer uma experiência de desenvolvimento mais rápida e enxuta para projetos web modernos.

<TerminalBlock>
npm create vite@latest my-app -- --template react-ts
</TerminalBlock>

Vite é opinativo e vem com padrões sensatos prontos para uso. Vite tem um rico ecossistema de plugins para suportar fast refresh, JSX, Babel/SWC, e outras funcionalidades comuns. Veja o [plugin React do Vite](https://vite.dev/plugins/#vitejs-plugin-react) ou [plugin React SWC](https://vite.dev/plugins/#vitejs-plugin-react-swc) e [projeto de exemplo React SSR](https://vite.dev/guide/ssr.html#example-projects) para começar.

Vite já está sendo usado como ferramenta de build em um dos nossos [frameworks recomendados](/learn/creating-a-react-app): [React Router](https://reactrouter.com/start/framework/installation).

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) combina uma ótima experiência de desenvolvimento pronta para uso com uma arquitetura escalável que pode levar seu projeto desde o início até aplicações de produção massivas.

<TerminalBlock>
npm install --save-dev parcel
</TerminalBlock>

Parcel suporta fast refresh, JSX, TypeScript, Flow, e estilização prontos para uso. Veja a [receita React do Parcel](https://parceljs.org/recipes/react/#getting-started) para começar.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) é uma ferramenta de build alimentada pelo Rspack que fornece uma experiência de desenvolvimento perfeita para aplicações React. Vem com padrões cuidadosamente ajustados e otimizações de performance prontas para uso.

<TerminalBlock>
npx create-rsbuild --template react
</TerminalBlock>

Rsbuild inclui suporte integrado para funcionalidades React como fast refresh, JSX, TypeScript, e estilização. Veja o [guia React do Rsbuild](https://rsbuild.dev/guide/framework/react) para começar.

<Note>

#### Metro para React Native {/*react-native*/}

Se você está começando do zero com React Native, precisará usar o [Metro](https://metrobundler.dev/), o bundler JavaScript para React Native. Metro suporta bundling para plataformas como iOS e Android, mas carece de muitas funcionalidades quando comparado às ferramentas aqui. Recomendamos começar com Vite, Parcel, ou Rsbuild, a menos que seu projeto requeira suporte ao React Native.

</Note>

## Passo 2: Construir Padrões Comuns de Aplicação {/*step-2-build-common-application-patterns*/}

As ferramentas de build listadas acima começam com uma aplicação de página única (SPA) apenas do lado do cliente, mas não incluem soluções adicionais para funcionalidades comuns como roteamento, busca de dados, ou estilização.

O ecossistema React inclui muitas ferramentas para esses problemas. Listamos algumas que são amplamente usadas como ponto de partida, mas sinta-se livre para escolher outras ferramentas se funcionarem melhor para você.

### Roteamento {/*routing*/}

Roteamento determina qual conteúdo ou páginas exibir quando um usuário visita uma URL específica. Você precisa configurar um roteador para mapear URLs para diferentes partes da sua aplicação. Você também precisará lidar com rotas aninhadas, parâmetros de rota e parâmetros de consulta. Os roteadores podem ser configurados dentro do seu código, ou definidos com base nas estruturas de pastas e arquivos dos seus componentes.

Os roteadores são uma parte central das aplicações modernas, e geralmente são integrados com busca de dados (incluindo pré-busca de dados para uma página inteira para carregamento mais rápido), divisão de código (para minimizar tamanhos de bundle do cliente), e abordagens de renderização de página (para decidir como cada página é gerada).

Sugerimos usar:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)

### Busca de Dados {/*data-fetching*/}

Buscar dados de um servidor ou outra fonte de dados é uma parte fundamental da maioria das aplicações. Fazer isso adequadamente requer lidar com estados de carregamento, estados de erro, e cache dos dados buscados, que pode ser complexo.

Bibliotecas de busca de dados especializadas fazem o trabalho pesado de buscar e cachear os dados para você, permitindo que você se concentre em quais dados sua aplicação precisa e como exibi-los. Essas bibliotecas são tipicamente usadas diretamente nos seus componentes, mas também podem ser integradas em loaders de roteamento para pré-busca mais rápida e melhor performance, e também na renderização do servidor.

Note que buscar dados diretamente nos componentes pode levar a tempos de carregamento mais lentos devido a cascatas de requisições de rede, então recomendamos pré-buscar dados em loaders de roteador ou no servidor o máximo possível! Isso permite que os dados de uma página sejam buscados todos de uma vez conforme a página está sendo exibida.

Se você está buscando dados da maioria dos backends ou APIs estilo REST, sugerimos usar:

- [TanStack Query](https://tanstack.com/query/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

Se você está buscando dados de uma API GraphQL, sugerimos usar:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)

### Divisão de Código {/*code-splitting*/}

Divisão de código é o processo de quebrar sua aplicação em bundles menores que podem ser carregados sob demanda. O tamanho do código de uma aplicação aumenta com cada nova funcionalidade e dependência adicional. As aplicações podem se tornar lentas para carregar porque todo o código para a aplicação inteira precisa ser enviado antes que possa ser usado. Cache, redução de funcionalidades/dependências, e mover algum código para executar no servidor podem ajudar a mitigar o carregamento lento, mas são soluções incompletas que podem sacrificar funcionalidade se usadas em excesso.

Da mesma forma, se você depende das aplicações que usam seu framework para dividir o código, você pode encontrar situações onde o carregamento se torna mais lento do que se nenhuma divisão de código estivesse acontecendo. Por exemplo, [carregar preguiçosamente](/reference/react/lazy) um gráfico atrasa o envio do código necessário para renderizar o gráfico, dividindo o código do gráfico do resto da aplicação. [Parcel suporta divisão de código com React.lazy](https://parceljs.org/recipes/react/#code-splitting). No entanto, se o gráfico carrega seus dados *depois* que foi inicialmente renderizado, você agora está esperando duas vezes. Esta é uma cascata: ao invés de buscar os dados para o gráfico e enviar o código para renderizá-lo simultaneamente, você deve esperar cada passo completar um após o outro.

Dividir código por rota, quando integrado com bundling e busca de dados, pode reduzir o tempo de carregamento inicial da sua aplicação e o tempo que leva para o maior conteúdo visível da aplicação renderizar ([Largest Contentful Paint](https://web.dev/articles/lcp)).

Para instruções de divisão de código, veja a documentação da sua ferramenta de build:
- [Otimizações de build do Vite](https://v3.vitejs.dev/guide/features.html#build-optimizations)
- [Divisão de código do Parcel](https://parceljs.org/features/code-splitting/)
- [Divisão de código do Rsbuild](https://rsbuild.dev/guide/optimization/code-splitting)


### Melhorando a Performance da Aplicação {/*improving-application-performance*/}

Como a ferramenta de build que você seleciona só suporta aplicações de página única (SPAs), você precisará implementar outros [padrões de renderização](https://www.patterns.dev/vanilla/rendering-patterns) como renderização do lado do servidor (SSR), geração de site estático (SSG), e/ou React Server Components (RSC). Mesmo se você não precisar dessas funcionalidades no início, no futuro pode haver algumas rotas que se beneficiariam de SSR, SSG ou RSC.

* **Aplicações de página única (SPA)** carregam uma única página HTML e atualizam dinamicamente a página conforme o usuário interage com a aplicação. SPAs são mais fáceis de começar, mas podem ter tempos de carregamento inicial mais lentos. SPAs são a arquitetura padrão para a maioria das ferramentas de build.

* **Renderização do lado do servidor com streaming (SSR)** renderiza uma página no servidor e envia a página totalmente renderizada para o cliente. SSR pode melhorar a performance, mas pode ser mais complexo de configurar e manter do que uma aplicação de página única. Com a adição de streaming, SSR pode ser muito complexo de configurar e manter. Veja o [guia SSR do Vite](https://vite.dev/guide/ssr).

* **Geração de site estático (SSG)** gera arquivos HTML estáticos para sua aplicação no momento do build. SSG pode melhorar a performance, mas pode ser mais complexo de configurar e manter do que renderização do lado do servidor. Veja o [guia SSG do Vite](https://vite.dev/guide/ssr.html#pre-rendering-ssg).

* **React Server Components (RSC)** permite misturar componentes de build-time, apenas do servidor, e interativos em uma única árvore React. RSC pode melhorar a performance, mas atualmente requer expertise profunda para configurar e manter. Veja os [exemplos RSC do Parcel](https://github.com/parcel-bundler/rsc-examples).

Suas estratégias de renderização precisam se integrar com seu roteador para que aplicações construídas com seu framework possam escolher a estratégia de renderização no nível de rota. Isso permitirá diferentes estratégias de renderização sem ter que reescrever toda a sua aplicação. Por exemplo, a página de destino da sua aplicação pode se beneficiar de ser gerada estaticamente (SSG), enquanto uma página com um feed de conteúdo pode ter melhor performance com renderização do lado do servidor.

Usar a estratégia de renderização certa para as rotas certas pode diminuir o tempo que leva para o primeiro byte de conteúdo ser carregado ([Time to First Byte](https://web.dev/articles/ttfb)), o primeiro pedaço de conteúdo renderizar ([First Contentful Paint](https://web.dev/articles/fcp)), e o maior conteúdo visível da aplicação renderizar ([Largest Contentful Paint](https://web.dev/articles/lcp)).

### E mais... {/*and-more*/}

Estes são apenas alguns exemplos das funcionalidades que uma nova aplicação precisará considerar ao construir do zero. Muitas limitações que você encontrará podem ser difíceis de resolver, já que cada problema está interconectado com os outros e pode requerer expertise profunda em áreas problemáticas com as quais você pode não estar familiarizado.

Se você não quer resolver esses problemas por conta própria, pode [começar com um framework](/learn/creating-a-react-app) que fornece essas funcionalidades prontas para uso.
