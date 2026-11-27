---
title: Compiling Libraries
---

<Intro>
Este guia ajuda os autores de bibliotecas a entender como usar o React Compiler para enviar código de biblioteca otimizado para seus usuários.
</Intro>

<InlineToc />

## Por que Enviar Código Compilado? {/*why-ship-compiled-code*/}

Como autor de uma biblioteca, você pode compilar o código da sua biblioteca antes de publicá-lo no npm. Isso oferece vários benefícios:

- **Melhorias de performance para todos os usuários** - Seus usuários da biblioteca recebem código otimizado, mesmo que ainda não estejam usando o React Compiler.
- **Nenhuma configuração exigida pelos usuários** - As otimizações funcionam "out of the box".
- **Comportamento consistente** - Todos os usuários recebem a mesma versão otimizada, independentemente da configuração de build.

## Configurando a Compilação {/*setting-up-compilation*/}

Adicione o React Compiler ao processo de build da sua biblioteca:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

Configure sua ferramenta de build para compilar sua biblioteca. Por exemplo, com Babel:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
  ],
  // ... outra configuração
};
```

## Compatibilidade com Versões Anteriores {/*backwards-compatibility*/}

Se sua biblioteca suporta versões do React anteriores à 19, você precisará de configuração adicional:

### 1. Instale o pacote de runtime {/*install-runtime-package*/}

Recomendamos instalar o `react-compiler-runtime` como uma dependência direta:

<TerminalBlock>
npm install react-compiler-runtime@latest
</TerminalBlock>

```json
{
  "dependencies": {
    "react-compiler-runtime": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

### 2. Configure a versão de destino {/*configure-target-version*/}

Defina a versão mínima do React que sua biblioteca suporta:

```js
{
  target: '17', // Versão mínima suportada do React
}
```

## Estratégia de Testes {/*testing-strategy*/}

Teste sua biblioteca com e sem compilação para garantir a compatibilidade. Execute sua suíte de testes existente contra o código compilado e também crie uma configuração de teste separada que ignore o compilador. Isso ajuda a capturar quaisquer problemas que possam surgir do processo de compilação e garante que sua biblioteca funcione corretamente em todos os cenários.

## Solução de Problemas {/*troubleshooting*/}

### A biblioteca não funciona com versões mais antigas do React {/*library-doesnt-work-with-older-react-versions*/}

Se sua biblioteca compilada gerar erros no React 17 ou 18:

1. Verifique se você instalou `react-compiler-runtime` como uma dependência.
2. Verifique se sua configuração `target` corresponde à sua versão mínima suportada do React.
3. Certifique-se de que o pacote de runtime esteja incluído no seu bundle publicado.

### Conflitos de compilação com outros plugins do Babel {/*compilation-conflicts-with-other-babel-plugins*/}

Alguns plugins do Babel podem entrar em conflito com o React Compiler:

1. Coloque `babel-plugin-react-compiler` no início da sua lista de plugins.
2. Desative otimizações conflitantes em outros plugins.
3. Teste minuciosamente a saída do seu build.

### Módulo de runtime não encontrado {/*runtime-module-not-found*/}

Se os usuários virem "Cannot find module 'react-compiler-runtime'":

1. Certifique-se de que o runtime esteja listado em `dependencies`, não em `devDependencies`.
2. Verifique se seu bundler inclui o runtime na saída.
3. Verifique se o pacote foi publicado no npm junto com sua biblioteca.

## Próximos Passos {/*next-steps*/}

- Saiba mais sobre [técnicas de depuração](/learn/react-compiler/debugging) para código compilado.
- Verifique as [opções de configuração](/reference/react-compiler/configuration) para todas as opções do compilador.
- Explore [modos de compilação](/reference/react-compiler/compilationMode) para otimização seletiva.