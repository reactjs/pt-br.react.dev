---
title: logger
---

<Intro>

A opção `logger` fornece registro personalizado para eventos do React Compiler durante a compilação.

</Intro>

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[Compiler] ${event.kind}: ${filename}`);
    }
  }
}
```

<InlineToc />

---

## Referência {/*reference*/}

### `logger` {/*logger*/}

Configura o registro personalizado para rastrear o comportamento do compilador e depurar problemas.

#### Tipo {/*type*/}

```
{
  logEvent: (filename: string | null, event: LoggerEvent) => void;
} | null
```

#### Valor padrão {/*default-value*/}

`null`

#### Métodos {/*methods*/}

- **`logEvent`**: Chamado para cada evento do compilador com o nome do arquivo e detalhes do evento

#### Tipos de eventos {/*event-types*/}

- **`CompileSuccess`**: Função compilada com sucesso
- **`CompileError`**: Função ignorada devido a erros
- **`CompileDiagnostic`**: Informações de diagnóstico não fatais
- **`CompileSkip`**: Função ignorada por outros motivos
- **`PipelineError`**: Erro de compilação inesperado
- **`Timing`**: Informações de tempo de desempenho

#### Ressalvas {/*caveats*/}

- A estrutura do evento pode mudar entre as versões
- Grandes bases de código geram muitas entradas de registro

---

## Uso {/*usage*/}

### Registro básico {/*basic-logging*/}

Rastreie o sucesso e as falhas da compilação:

```js
{
  logger: {
    logEvent(filename, event) {
      switch (event.kind) {
        case 'CompileSuccess': {
          console.log(`✅ Compilado: ${filename}`);
          break;
        }
        case 'CompileError': {
          console.log(`❌ Ignorado: ${filename}`);
          break;
        }
        default: {}
      }
    }
  }
}
```

### Registro detalhado de erros {/*detailed-error-logging*/}

Obtenha informações específicas sobre falhas de compilação:

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileError') {
        console.error(`\nFalha na compilação: ${filename}`);
        console.error(`Motivo: ${event.detail.reason}`);

        if (event.detail.description) {
          console.error(`Detalhes: ${event.detail.description}`);
        }

        if (event.detail.loc) {
          const { line, column } = event.detail.loc.start;
          console.error(`Localização: Linha ${line}, Coluna ${column}`);
        }

        if (event.detail.suggestions) {
          console.error('Sugestões:', event.detail.suggestions);
        }
      }
    }
  }
}
```