---
title: panicThreshold
---
<Intro>

A opção `panicThreshold` controla como o Compilador React lida com erros durante a compilação.

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

Determina se os erros de compilação devem falhar a build ou pular a otimização.

#### Tipo {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### Valor padrão {/*default-value*/}

`'none'`

#### Opções {/*options*/}

- **`'none'`** (padrão, recomendado): Pula componentes que não podem ser compilados e continua a build.
- **`'critical_errors'`**: Falha a build apenas em erros críticos do compilador.
- **`'all_errors'`**: Falha a build em qualquer diagnóstico do compilador.

#### Ressalvas {/*caveats*/}

- Builds de produção devem sempre usar `'none'`.
- Falhas na build impedem que sua aplicação seja construída.
- O compilador detecta e pula automaticamente código problemático com `'none'`.
- Limiares mais altos são úteis apenas durante o desenvolvimento para depuração.

---

## Uso {/*usage*/}

### Configuração de produção (recomendado) {/*production-configuration*/}

Para builds de produção, sempre use `'none'`. Este é o valor padrão:

```js
{
  panicThreshold: 'none'
}
```

Isso garante:
- Sua build nunca falha devido a problemas do compilador.
- Componentes que não podem ser otimizados rodam normalmente.
- O máximo de componentes são otimizados.
- Implantações de produção estáveis.

### Depuração em desenvolvimento {/*development-debugging*/}

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
