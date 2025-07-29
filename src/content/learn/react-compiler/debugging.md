---
title: Depuração e Solução de Problemas
---

<Intro>
Este guia ajuda você a identificar e corrigir problemas ao usar o React Compiler. Aprenda como depurar problemas de compilação e resolver questões comuns.
</Intro>

<YouWillLearn>

* A diferença entre erros do compilador e problemas em tempo de execução
* Padrões comuns que quebram a compilação
* Fluxo de trabalho de depuração passo a passo

</YouWillLearn>

## Entendendo o Comportamento do Compilador {/*understanding-compiler-behavior*/}

O React Compiler é projetado para lidar com código que segue as [Regras do React](/reference/rules). Quando encontra código que pode quebrar essas regras, ele ignora com segurança a otimização em vez de arriscar alterar o comportamento do seu app.

### Erros do Compilador vs Problemas em Tempo de Execução {/*compiler-errors-vs-runtime-issues*/}

**Erros do compilador** ocorrem no momento da compilação e impedem que seu código seja compilado. Estes são raros porque o compilador é projetado para ignorar código problemático em vez de falhar.

**Problemas em tempo de execução** ocorrem quando o código compilado se comporta de forma diferente do esperado. Na maioria das vezes, se você encontrar um problema com o React Compiler, é um problema em tempo de execução. Isso geralmente acontece quando seu código viola as Regras do React de maneiras sutis que o compilador não conseguiu detectar, e o compilador compilou incorretamente um componente que deveria ter ignorado.

Ao depurar problemas em tempo de execução, concentre seus esforços em encontrar violações das Regras do React nos componentes afetados que não foram detectadas pela regra do ESLint. O compilador depende do seu código seguindo essas regras, e quando elas são quebradas de maneiras que ele não consegue detectar, é quando ocorrem problemas em tempo de execução.


## Padrões Comuns que Quebram {/*common-breaking-patterns*/}

Uma das principais maneiras pelas quais o React Compiler pode quebrar seu app é se seu código foi escrito para depender de memoização para correção. Isso significa que seu app depende de valores específicos sendo memoizados para funcionar adequadamente. Como o compilador pode memoizar de forma diferente da sua abordagem manual, isso pode levar a comportamentos inesperados como efeitos disparando demais, loops infinitos ou atualizações ausentes.

Cenários comuns onde isso ocorre:

- **Efeitos que dependem de igualdade referencial** - Quando efeitos dependem de objetos ou arrays mantendo a mesma referência entre renderizações
- **Arrays de dependência que precisam de referências estáveis** - Quando dependências instáveis fazem efeitos dispararem com muita frequência ou criar loops infinitos
- **Lógica condicional baseada em verificações de referência** - Quando código usa verificações de igualdade referencial para cache ou otimização

## Fluxo de Trabalho de Depuração {/*debugging-workflow*/}

Siga estes passos quando encontrar problemas:

### Erros de Compilação do Compilador {/*compiler-build-errors*/}

Se você encontrar um erro do compilador que quebra inesperadamente sua compilação, isso provavelmente é um bug no compilador. Reporte-o para o repositório [facebook/react](https://github.com/facebook/react/issues) com:
- A mensagem de erro
- O código que causou o erro
- Suas versões do React e do compilador

### Problemas em Tempo de Execução {/*runtime-issues*/}

Para problemas de comportamento em tempo de execução:

### 1. Desabilite Temporariamente a Compilação {/*temporarily-disable-compilation*/}

Use `"use no memo"` para isolar se um problema está relacionado ao compilador:

```js
function ProblematicComponent() {
  "use no memo"; // Pula a compilação para este componente
  // ... resto do componente
}
```

Se o problema desaparecer, provavelmente está relacionado a uma violação das Regras do React.

Você também pode tentar remover a memoização manual (useMemo, useCallback, memo) do componente problemático para verificar que seu app funciona corretamente sem qualquer memoização. Se o bug ainda ocorrer quando toda a memoização for removida, você tem uma violação das Regras do React que precisa ser corrigida.

### 2. Corrija Problemas Passo a Passo {/*fix-issues-step-by-step*/}

1. Identifique a causa raiz (frequentemente memoização-para-correção)
2. Teste após cada correção
3. Remova `"use no memo"` uma vez corrigido
4. Verifique se o componente mostra o badge ✨ no React DevTools

## Reportando Bugs do Compilador {/*reporting-compiler-bugs*/}

Se você acredita que encontrou um bug do compilador:

1. **Verifique se não é uma violação das Regras do React** - Verifique com o ESLint
2. **Crie uma reprodução mínima** - Isole o problema em um exemplo pequeno
3. **Teste sem o compilador** - Confirme que o problema só ocorre com a compilação
4. **Abra uma [issue](https://github.com/facebook/react/issues/new?template=compiler_bug_report.yml)**:
   - Versões do React e do compilador
   - Código de reprodução mínima
   - Comportamento esperado vs atual
   - Qualquer mensagem de erro

## Próximos Passos {/*next-steps*/}

- Revise as [Regras do React](/reference/rules) para prevenir problemas
- Verifique o [guia de adoção incremental](/learn/react-compiler/incremental-adoption) para estratégias de implementação gradual
