---
script: "<script>"
canary: true
---

<Canary>

As extensões de `<script>` do React estão disponíveis atualmente apenas nos canais canary e experimental do React. Nas versões estáveis do React, `<script>` funciona apenas como um [componente HTML embutido do navegador](https://react.dev/reference/react-dom/components#all-html-components). Saiba mais sobre [os canais de versão do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

O [componente `<script>` embutido do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) permite adicionar um script ao seu documento.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<script>` {/*script*/}

Para adicionar scripts inline ou externos ao seu documento, renderize o [componente `<script>` embutido do navegador](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). Você pode renderizar `<script>` de qualquer componente e o React [em certos casos](#special-rendering-behavior) colocará o elemento DOM correspondente no cabeçalho do documento e deduplicará scripts idênticos.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<script>` suporta todas as [props comuns de elementos](/reference/react-dom/components/common#props)

Deve ter *ou* `children` ou uma prop `src`.

* `children`: uma string. O código fonte de um script inline.
* `src`: uma string. A URL de um script externo.

Outras props suportadas:

* `async`: um booleano. Permite que o navegador adie a execução do script até que o resto do documento tenha sido processado — o comportamento preferido para desempenho.
*  `crossOrigin`: uma string. A [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser utilizada. Seus valores possíveis são `anonymous` e `use-credentials`.
* `fetchPriority`: uma string. Permite que o navegador classifique scripts em prioridade ao buscar múltiplos scripts ao mesmo tempo. Pode ser `"high"`, `"low"` ou `"auto"` (o padrão).
* `integrity`: uma string. Um hash criptográfico do script, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `noModule`: um booleano. Desabilita o script em navegadores que suportam módulos ES — permitindo um script alternativa para navegadores que não o suportam.
* `nonce`: uma string. Um [nonce criptográfico para permitir o recurso](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ao usar uma política de segurança de conteúdo estrita.
* `referrer`: uma string. Indica [qual cabeçalho Referer enviar](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) ao buscar o script e quaisquer recursos que o script buscar por sua vez. 
* `type`: uma string. Indica se o script é um [script clássico, módulo ES ou mapa de importação](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

Props que desabilitam o [tratamento especial de scripts do React](#special-rendering-behavior):

* `onError`: uma função. Chamado quando o script falha ao carregar.
* `onLoad`: uma função. Chamado quando o script termina de ser carregado.

Props que **não são recomendadas** para uso com o React:

* `blocking`: uma string. Se definida como `"render"`, instrui o navegador a não renderizar a página até que a planilha de scripts esteja carregada. O React fornece um controle mais detalhado usando Suspense.
* `defer`: uma string. Impede que o navegador execute o script até que o documento tenha terminado de carregar. Não é compatível com componentes renderizados no servidor em streaming. Use a prop `async` em vez disso.

#### Comportamento de renderização especial {/*special-rendering-behavior*/}

O React pode mover componentes `<script>` para o `<head>` do documento, deduplicar scripts idênticos e [suspender](/reference/react/Suspense) enquanto o script está carregando.

Para optar por esse comportamento, forneça as props `src` e `async={true}`. O React deduplicará scripts se eles tiverem o mesmo `src`. A prop `async` deve ser verdadeira para permitir que os scripts sejam movidos com segurança.

Se você fornecer qualquer uma das props `onLoad` ou `onError`, não haverá comportamento especial, pois essas props indicam que você está gerenciando o carregamento do script manualmente dentro do seu componente.

Esse tratamento especial vem com duas ressalvas:

* O React ignorará alterações nas props após o script ter sido renderizado. (O React emitirá um aviso em desenvolvimento se isso acontecer.)
* O React pode deixar o script no DOM mesmo depois que o componente que o renderizou tenha sido desmontado. (Isso não tem efeito, pois os scripts são executados apenas uma vez quando são inseridos no DOM.)

---

## Uso {/*usage*/}

### Renderizando um script externo {/*rendering-an-external-script*/}

Se um componente depende de certos scripts para ser exibido corretamente, você pode renderizar um `<script>` dentro do componente.

Se você fornecer as props `src` e `async`, seu componente será suspenso enquanto o script estiver carregando. O React deduplicará scripts que têm o mesmo `src`, inserindo apenas um deles no DOM mesmo que múltiplos componentes o renderizem.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
Quando você deseja usar um script, pode ser benéfico chamar a função [preinit](/reference/react-dom/preinit). Chamar essa função pode permitir que o navegador comece a buscar o script mais cedo do que se você apenas renderizar um componente `<script>`, por exemplo, enviando uma [resposta de Dicas Iniciais HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

### Renderizando um script inline {/*rendering-an-inline-script*/}

Para incluir um script inline, renderize o componente `<script>` com o código fonte do script como seus filhos. Scripts inline não são deduplicados ou movidos para o `<head>` do documento e, como não carregam nenhum recurso externo, não causarão a suspensão do seu componente.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>Meu Site</h1>
      <Tracking />
      <p>Bem-vindo</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>