---
title: "React Compiler Beta Release"
author: Lauren Tan
date: 2024/10/21
description: Na React Conf 2024, anunciamos o lançamento experimental do React Compiler, uma ferramenta de build-time que otimiza seu aplicativo React por meio de memoização automática. Nesta postagem, queremos compartilhar os próximos passos para o código aberto e nosso progresso no compilador.
---

21 de outubro de 2024 por [Lauren Tan](https://twitter.com/potetotes).

---

<Note>

### O React Compiler agora está estável! {/*react-compiler-is-now-in-rc*/}

Por favor, veja o [post do blog sobre o lançamento estável](/blog/2025/10/07/react-compiler-1) para detalhes.

</Note>

<Intro>

A equipe do React está animada para compartilhar novas atualizações:

</Intro>

1. Estamos publicando hoje o React Compiler Beta, para que adotantes iniciais e mantenedores de bibliotecas possam experimentá-lo e fornecer feedback.
2. Estamos oferecendo suporte oficial ao React Compiler para aplicativos no React 17+, através de um pacote opcional `react-compiler-runtime`.
3. Estamos abrindo a adesão pública ao [React Compiler Working Group](https://github.com/reactwg/react-compiler) para preparar a comunidade para a adoção gradual do compilador.

---

Na [React Conf 2024](/blog/2024/05/22/react-conf-2024-recap), anunciamos o lançamento experimental do React Compiler, uma ferramenta de build-time que otimiza seu aplicativo React através de memoização automática. [Você pode encontrar uma introdução ao React Compiler aqui](/learn/react-compiler).

Desde o primeiro lançamento, corrigimos vários bugs relatados pela comunidade React, recebemos várias correções de bugs e contribuições de alta qualidade[^1] para o compilador, tornamos o compilador mais resiliente à ampla diversidade de padrões JavaScript e continuamos a implantar o compilador mais amplamente na Meta.

Neste post, queremos compartilhar o que vem a seguir para o React Compiler.

## Experimente o React Compiler Beta hoje {/*try-react-compiler-beta-today*/}

Na [React India 2024](https://www.youtube.com/watch?v=qd5yk2gxbtg), compartilhamos uma atualização sobre o React Compiler. Hoje, estamos animados em anunciar um novo lançamento Beta do React Compiler e do plugin ESLint. Novas versões beta são publicadas no npm usando a tag `@beta`.

Para instalar o React Compiler Beta:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Ou, se você estiver usando Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Você pode assistir à palestra de [Sathya Gunasekaran](https://twitter.com/_gsathya) na React India aqui:

<YouTubeIframe src="https://www.youtube.com/embed/qd5yk2gxbtg" />

## Recomendamos que todos usem o linter do React Compiler hoje {/*we-recommend-everyone-use-the-react-compiler-linter-today*/}

O plugin ESLint do React Compiler ajuda os desenvolvedores a identificar e corrigir proativamente violações das [Regras do React](/reference/rules). **Recomendamos fortemente que todos usem o linter hoje**. O linter não exige que você tenha o compilador instalado, então você pode usá-lo independentemente, mesmo que não esteja pronto para experimentar o compilador.

Para instalar apenas o linter:

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Ou, se você estiver usando Yarn:

<TerminalBlock>
yarn add -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Após a instalação, você pode habilitar o linter [adicionando-o à sua configuração do ESLint](/learn/react-compiler/installation#eslint-integration). Usar o linter ajuda a identificar quebras nas Regras do React, facilitando a adoção do compilador quando ele for totalmente lançado.

## Compatibilidade com versões anteriores {/*backwards-compatibility*/}

O React Compiler produz código que depende de APIs de runtime adicionadas no React 19, mas desde então adicionamos suporte para que o compilador também funcione com React 17 e 18. Se você ainda não está no React 19, na versão Beta, você agora pode experimentar o React Compiler especificando um `target` mínimo em sua configuração do compilador e adicionando `react-compiler-runtime` como uma dependência. [Você pode encontrar a documentação sobre isso aqui](/reference/react-compiler/configuration#react-17-18).

## Usando o React Compiler em bibliotecas {/*using-react-compiler-in-libraries*/}

Nosso lançamento inicial foi focado em identificar problemas importantes com o uso do compilador em aplicativos. Recebemos ótimos feedbacks e melhoramos substancialmente o compilador desde então. Agora estamos prontos para um feedback amplo da comunidade e para que os autores de bibliotecas experimentem o compilador para melhorar o desempenho e a experiência do desenvolvedor na manutenção de suas bibliotecas.

O React Compiler também pode ser usado para compilar bibliotecas. Como o React Compiler precisa ser executado no código-fonte original antes de quaisquer transformações de código, não é possível que o pipeline de build de um aplicativo compile as bibliotecas que ele usa. Portanto, nossa recomendação é que os mantenedores de bibliotecas compilem e testem independentemente suas bibliotecas com o compilador e enviem o código compilado para o npm.

Como seu código é pré-compilado, os usuários de sua biblioteca não precisarão ter o compilador habilitado para se beneficiar da memoização automática aplicada à sua biblioteca. Se sua biblioteca tem como alvo aplicativos que ainda não estão no React 19, especifique um `target` mínimo e adicione `react-compiler-runtime` como uma dependência direta. O pacote de runtime usará a implementação correta das APIs dependendo da versão do aplicativo e preencherá as APIs ausentes, se necessário.

[Você pode encontrar mais documentação sobre isso aqui.](/reference/react-compiler/compiling-libraries)

## Abrindo o React Compiler Working Group para todos {/*opening-up-react-compiler-working-group-to-everyone*/}

Anunciamos anteriormente o [React Compiler Working Group](https://github.com/reactwg/react-compiler), apenas por convite, na React Conf para fornecer feedback, fazer perguntas e colaborar no lançamento experimental do compilador.

A partir de hoje, juntamente com o lançamento Beta do React Compiler, estamos abrindo a adesão ao Working Group para todos. O objetivo do React Compiler Working Group é preparar o ecossistema para uma adoção suave e gradual do React Compiler por aplicativos e bibliotecas existentes. Por favor, continue enviando relatórios de bugs no [repositório do React](https://github.com/facebook/react), mas deixe feedback, faça perguntas ou compartilhe ideias no [fórum de discussão do Working Group](https://github.com/reactwg/react-compiler/discussions).

A equipe principal também usará o repositório de discussões para compartilhar nossas descobertas de pesquisa. À medida que o Lançamento Estável se aproxima, qualquer informação importante também será postada neste fórum.

## React Compiler na Meta {/*react-compiler-at-meta*/}

Na [React Conf](/blog/2024/05/22/react-conf-2024-recap), compartilhamos que nosso rollout do compilador no Quest Store e Instagram foram bem-sucedidos. Desde então, implantamos o React Compiler em vários outros aplicativos web importantes na Meta, incluindo [Facebook](https://www.facebook.com) e [Threads](https://www.threads.net). Isso significa que se você usou algum desses aplicativos recentemente, sua experiência pode ter sido impulsionada pelo compilador. Conseguimos integrar esses aplicativos ao compilador com poucas alterações de código necessárias, em um monorepo com mais de 100.000 componentes React.

Vimos melhorias notáveis de desempenho em todos esses aplicativos. À medida que implementamos, continuamos a ver resultados na ordem de [as vitórias que compartilhamos anteriormente na ReactConf](https://youtu.be/lyEKhv8-3n0?t=3223). Esses aplicativos já foram extensivamente ajustados e otimizados por engenheiros da Meta e especialistas em React ao longo dos anos, então mesmo melhorias na ordem de alguns por cento são uma grande vitória para nós.

Também esperávamos ganhos de produtividade do desenvolvedor com o React Compiler. Para medir isso, colaboramos com nossos parceiros de ciência de dados na Meta[^2] para realizar uma análise estatística completa do impacto da memoização manual na produtividade. Antes de implantar o compilador na Meta, descobrimos que apenas cerca de 8% das pull requests do React usavam memoização manual e que essas pull requests levavam de 31 a 46% mais tempo para serem criadas[^3]. Isso confirmou nossa intuição de que a memoização manual introduz sobrecarga cognitiva, e antecipamos que o React Compiler levará a uma autoria e revisão de código mais eficientes. Notavelmente, o React Compiler também garante que *todo* o código seja memoizado por padrão, não apenas os (em nosso caso) 8% onde os desenvolvedores aplicam explicitamente a memoização.

## Roteiro para o lançamento estável {/*roadmap-to-stable*/}

*Este não é um roteiro final e está sujeito a alterações.*

Pretendemos lançar um Release Candidate (RC) do compilador em um futuro próximo, após o lançamento Beta, quando a maioria dos aplicativos e bibliotecas que seguem as Regras do React tiverem provado funcionar bem com o compilador. Após um período de feedback final da comunidade, planejamos um Lançamento Estável para o compilador. O Lançamento Estável marcará o início de uma nova base para o React, e todos os aplicativos e bibliotecas serão fortemente recomendados a usar o compilador e o plugin ESLint.

* ✅ Experimental: Lançado na React Conf 2024, principalmente para feedback de adotantes iniciais.
* ✅ Beta Pública: Disponível hoje, para feedback da comunidade em geral.
* 🚧 Release Candidate (RC): O React Compiler funciona para a maioria dos aplicativos e bibliotecas que seguem as regras sem problemas.
* 🚧 Disponibilidade Geral: Após o período de feedback final da comunidade.

Esses lançamentos também incluem o plugin ESLint do compilador, que exibe diagnósticos analisados estaticamente pelo compilador. Planejamos combinar o plugin `eslint-plugin-react-hooks` existente com o plugin ESLint do compilador, para que apenas um plugin precise ser instalado.

Após o Lançamento Estável, planejamos adicionar mais otimizações e melhorias ao compilador. Isso inclui melhorias contínuas na memoização automática e novas otimizações, com pouca ou nenhuma alteração no código do produto. A atualização para cada nova versão do compilador visa ser simples, e cada atualização continuará a melhorar o desempenho e adicionar um melhor tratamento de diversos padrões JavaScript e React.

Ao longo deste processo, também planejamos prototipar uma extensão IDE para React. Ainda está muito cedo na pesquisa, então esperamos poder compartilhar mais de nossas descobertas com você em um futuro post do blog do React Labs.

---

Obrigado a [Sathya Gunasekaran](https://twitter.com/_gsathya), [Joe Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Alex Taylor](https://github.com/alexmckenley), [Jason Bonta](https://twitter.com/someextent) e [Eli White](https://twitter.com/Eli_White) por revisar e editar este post.

---

[^1]: Obrigado [@nikeee](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Anikeee), [@henryqdineen](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Ahenryqdineen), [@TrickyPi](https://github.com/facebook/react/pulls?q=is%3Apr+author%3ATrickyPi), e vários outros por suas contribuições para o compilador.

[^2]: Obrigado [Vaishali Garg](https://www.linkedin.com/in/vaishaligarg09) por liderar este estudo sobre o React Compiler na Meta e por revisar este post.

[^3]: Após controlar o tempo de permanência do autor, o comprimento/complexidade das diferenças e outros fatores potenciais de confusão.
