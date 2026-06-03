---
title: Visão geral da referência do React
---

<Intro>

Esta seção fornece documentação de referência detalhada para trabalhar com React. Para uma introdução ao React, visite a seção [Aprender](/learn).

</Intro>

A documentação de referência do React é dividida em subseções funcionais:

## React {/*react*/}

Recursos do React Programático:

* [Hooks](/reference/react/hooks) - Use diferentes recursos do React a partir dos seus componentes.
* [Componentes](/reference/react/components) - Componentes integrados que você pode usar no seu JSX.
* [APIs](/reference/react/apis) - APIs que são úteis para definir componentes.
* [Diretivas](/reference/rsc/directives) - Fornecem instruções para empacotadores compatíveis com Componentes de Servidor do React.

## React DOM {/*react-dom*/}

React-dom contém recursos que são suportados apenas por aplicativos da web (que são executados no ambiente DOM do navegador). Esta seção é dividida no seguinte:

* [Hooks](/reference/react-dom/hooks) - Hooks para aplicações web que rodam no ambiente DOM do navegador.
* [Componentes](/reference/react-dom/components) - React suporta todos os componentes HTML e SVG integrados do navegador.
* [APIs](/reference/react-dom) - O pacote `react-dom` contém métodos suportados apenas em aplicações web.
* [APIs do cliente](/reference/react-dom/client) - As APIs `react-dom/client` permitem renderizar componentes do React no cliente (no navegador).
* [APIs de servidor](/reference/react-dom/server) - As APIs `react-dom/server` permitem renderizar componentes React para HTML no servidor.
* [APIs estáticas](/reference/react-dom/static) - As APIs `react-dom/static` permitem gerar HTML estático para componentes React.

## React Compiler {/*react-compiler*/}

O React Compiler é uma ferramenta de otimização em tempo de compilação que memoriza automaticamente seus componentes e valores React:

* [Configuração](/reference/react-compiler/configuration) - Opções de configuração para o React Compiler.
* [Diretivas](/reference/react-compiler/directives) - Diretivas em nível de função para controlar a compilação.
* [Compilando Bibliotecas](/reference/react-compiler/compiling-libraries) - Guia para distribuir código de biblioteca pré-compilado.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

O [ESLint plugin para React Hooks](/reference/eslint-plugin-react-hooks) ajuda a impor as Regras do React:

* [Lints](/reference/eslint-plugin-react-hooks) - Documentação detalhada para cada lint com exemplos.

## Regras do React {/*rules-of-react*/}

React tem idiomas — ou regras — sobre como expressar padrões de uma forma que seja fácil de entender e gere aplicativos de alta qualidade:

* [Componentes e Hooks devem ser puros](/reference/rules/components-and-hooks-must-be-pure) – A pureza torna seu código mais fácil de entender, depurar e permite que o React otimize automaticamente seus componentes e hooks corretamente.
* [React chama Componentes e Hooks](/reference/rules/react-calls-components-and-hooks) – O React é responsável por renderizar componentes e hooks quando necessário para otimizar a experiência do usuário.
* [Regras dos Hooks](/reference/rules/rules-of-hooks) – Hooks são definidos usando funções JavaScript, mas representam um tipo especial de lógica de UI reutilizável com restrições sobre onde podem ser chamados.

## APIs Legadas {/*legacy-apis*/}

* [APIs Legadas](/reference/react/legacy) - Exportado do pacote `react`, mas não recomendado para uso em código recém-escrito.