---
title: panicThreshold
---

<Intro>

A opção `panicThreshold` controla como o React Compiler lida com erros durante a compilação.

</Intro>

```js
{
  panicThreshold: 'none' // Recomendado
}
```

<InlineToc />

---

## Referência {/*reference*/}

### `panicThreshold` {/*panicthreshold*/}

Determina se os erros de compilação devem falhar na construção ou pular a otimização.

#### Tipo {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### Valor padrão {/*default-value*/}

`'none'`

#### Opções {/*options*/}

- **`'none'`** (padrão, recomendado): Pula componentes que não podem ser compilados e continua a construção
- **`'critical_errors'`**: Falha na construção apenas em erros críticos do compilador
- **`'all_errors'`**: Falha na construção em qualquer diagnóstico do compilador

#### Ressalvas {/*caveats*/}

- Construções de produção sempre devem usar `'none'`
- Falhas na construção impedem que seu aplicativo seja construído
- O compilador detecta e pula automaticamente o código problemático com `'none'`
- Limiares mais altos são úteis apenas durante o desenvolvimento para depuração

---

## Uso {/*usage*/}

### Configuração de produção (recomendado) {/*production-configuration*/}

Para construções de produção, sempre use `'none'`. Este é o valor padrão:

```js
{
  panicThreshold: 'none'
}
```

Isso garante:
- Sua construção nunca falha devido a problemas do compilador
- Componentes que não podem ser otimizados são executados normalmente
- O máximo de componentes é otimizado
- Implantações de produção estáveis

### Depuração de desenvolvimento {/*development-debugging*/}

Use temporariamente limiares mais rigorosos para encontrar problemas:

```js
const isDevelopment = process.env.NODE_ENV === 'development';

{
  panicThreshold: isDevelopment ? 'critical_errors' : 'none',
  logger: {
    logEvent(filename, event) {
      if (isDevelopment && event.kind === 'CompileError') {
        // ...
      }
    }
  }
}
```