---
title: target
---

<Intro>

A opção `target` especifica para qual versão do React o compilador deve gerar o código.

</Intro>

```js
{
  target: '19' // ou '18', '17'
}
```

<InlineToc />

---

## Referência {/*reference*/}

### `target` {/*target*/}

Configura a compatibilidade da versão do React para a saída compilada.

#### Tipo {/*type*/}

```
'17' | '18' | '19'
```

#### Valor padrão {/*default-value*/}

`'19'`

#### Valores válidos {/*valid-values*/}

- **`'19'`**: Destina-se ao React 19 (padrão). Nenhum runtime adicional é necessário.
- **`'18'`**: Destina-se ao React 18. Requer o pacote `react-compiler-runtime`.
- **`'17'`**: Destina-se ao React 17. Requer o pacote `react-compiler-runtime`.

#### Ressalvas {/*caveats*/}

- Sempre use valores de string, não números (por exemplo, `'17'` e não `17`)
- Não inclua versões de patch (por exemplo, use `'18'` e não `'18.2.0'`)
- O React 19 inclui APIs de runtime do compilador integradas
- React 17 e 18 exigem a instalação de `react-compiler-runtime@latest`

---

## Uso {/*usage*/}

### Destinando-se ao React 19 (padrão) {/*targeting-react-19*/}

Para o React 19, nenhuma configuração especial é necessária:

```js
{
  // usa target: '19' por padrão
}
```

O compilador usará as APIs de runtime nativas do React 19:

```js
// A saída compilada usa as APIs nativas do React 19
import { c as _c } from 'react/compiler-runtime';
```

### Destinando-se ao React 17 ou 18 {/*targeting-react-17-or-18*/}

Para projetos React 17 e React 18, você precisa de duas etapas:

1. Instale o pacote de runtime:

```bash
npm install react-compiler-runtime@latest
```

2. Configure o destino:

```js
// Para React 18
{
  target: '18'
}

// Para React 17
{
  target: '17'
}
```

O compilador usará o runtime de polyfill para ambas as versões:

```js
// A saída compilada usa o polyfill
import { c as _c } from 'react-compiler-runtime';
```

---

## Solução de Problemas {/*troubleshooting*/}

### Erros de runtime sobre runtime do compilador ausente {/*missing-runtime*/}

Se você vir erros como "Cannot find module 'react/compiler-runtime'":

1. Verifique sua versão do React:
   ```bash
   npm why react
   ```

2. Se estiver usando React 17 ou 18, instale o runtime:
   ```bash
   npm install react-compiler-runtime@latest
   ```

3. Certifique-se de que seu `target` corresponda à sua versão do React:
   ```js
   {
     target: '18' // Deve corresponder à sua versão principal do React
   }
   ```

### Pacote de runtime não funcionando {/*runtime-not-working*/}

Certifique-se de que o pacote de runtime esteja:

1. Instalado em seu projeto (não globalmente)
2. Listado nas dependências do seu `package.json`
3. A versão correta (tag `@latest`)
4. Não em `devDependencies` (é necessário em tempo de execução)

### Verificando a saída compilada {/*checking-output*/}

Para verificar se o runtime correto está sendo usado, observe a importação diferente (`react/compiler-runtime` para integrado, pacote `react-compiler-runtime` autônomo para 17/18):

```js
// Para React 19 (runtime integrado)
import { c } from 'react/compiler-runtime'
//                      ^

// Para React 17/18 (runtime polyfill)
import { c } from 'react-compiler-runtime'
//                      ^
```
