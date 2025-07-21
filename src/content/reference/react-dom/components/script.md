---
script: "<script>"
---

<Intro>

O [componente `<script>` do navegador embutido](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) permite adicionar um script ao seu documento.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<script>` {/*script*/}

Para adicionar scripts embutidos ou externos ao seu documento, renderize o [componente `<script>` do navegador embutido](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). Você pode renderizar  `<script>` de qualquer componente e o React [em certos casos](#special-rendering-behavior) colocará o elemento DOM correspondente no head do documento e de-duplicará scripts idênticos.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

<<<<<<< HEAD
`<script>` suporta todas as [props comuns de elementos.](/reference/react-dom/components/common#props)
=======
`<script>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Ele deve ter *ou* `children` ou uma prop `src`.

* `children`: uma string. O código fonte de um script embutido.
* `src`: uma string. A URL de um script externo.

Outras props suportadas:

* `async`: um boolean. Permite que o navegador adie a execução do script até que o resto do documento tenha sido processado — o comportamento preferido para desempenho.
*  `crossOrigin`: uma string. A [política CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) a ser usada. Seus valores possíveis são `anonymous` e `use-credentials`.
* `fetchPriority`: uma string. Permite que o navegador classifique os scripts em prioridade ao buscar vários scripts ao mesmo tempo. Pode ser  `"high"`, `"low"`, ou `"auto"` (o padrão).
* `integrity`: uma string. Uma hash criptográfica do script, para [verificar sua autenticidade](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `noModule`: um boolean. Desativa o script em navegadores que suportam módulos ES — permitindo um script de fallback para navegadores que não os suportam.
* `nonce`: uma string. Uma [nonce criptográfica para permitir o recurso](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ao usar uma Política de Segurança de Conteúdo estrita.
* `referrer`: uma string. Diz [qual cabeçalho Referer enviar](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) ao buscar o script e quaisquer recursos que o script buscar por sua vez.
* `type`: uma string. Diz se o script é um [script clássico, módulo ES ou mapa de importação](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

Props que desativam o [tratamento especial de scripts](#special-rendering-behavior) do React:

* `onError`: uma function. Chamado quando o script não consegue carregar.
* `onLoad`: uma function. Chamado quando o script termina de ser carregado.

Props que **não são recomendadas** para uso com React:

* `blocking`: uma string. Se definida como `"render"`, instrui o navegador a não renderizar a página até que o scriptsheet seja carregado. O React fornece um controle mais preciso usando o Suspense.
* `defer`: uma string. Impede que o navegador execute o script até que o documento termine de carregar. Não é compatível com componentes renderizados no servidor com streaming. Use a prop `async` em vez disso.

#### Comportamento especial de renderização {/*special-rendering-behavior*/}

O React pode mover componentes `<script>` para o `<head>` do documento e de-duplicar scripts idênticos.

Para optar por esse comportamento, forneça as props `src` e `async={true}`. O React irá de-duplicar scripts se eles tiverem o mesmo `src`. A prop `async` deve ser true para permitir que os scripts sejam movidos com segurança.

Este tratamento especial vem com duas ressalvas:

* O React ignorará as alterações nas props depois que o script tiver sido renderizado. (O React emitirá um aviso no desenvolvimento se isso acontecer.)
* O React pode deixar o script no DOM mesmo depois que o componente que o renderizou foi desmontado. (Isso não tem efeito, pois os scripts são executados apenas uma vez quando são inseridos no DOM.)

---

## Uso {/*usage*/}

### Renderizando um script externo {/*rendering-an-external-script*/}

Se um componente depender de determinados scripts para ser exibido corretamente, você pode renderizar um `<script>` dentro do componente.
No entanto, o componente pode ser confirmado antes que o script termine de carregar.
Você pode começar a depender do conteúdo do script depois que o evento `load` for acionado, por exemplo, usando a prop `onLoad`.

O React irá de-duplicar scripts que tiverem o mesmo `src`, inserindo apenas um deles no DOM, mesmo que vários componentes o renderizem.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
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
Quando você deseja usar um script, pode ser benéfico chamar a função [preinit](/reference/react-dom/preinit). Chamar essa função pode permitir que o navegador comece a buscar o script antes do que se você apenas renderizasse um componente  `<script>`, por exemplo, enviando uma [resposta de Dicas Antecipadas HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

### Renderizando um script embutido {/*rendering-an-inline-script*/}

Para incluir um script embutido, renderize o componente `<script>` com o código fonte do script como seus children. Scripts embutidos não são de-duplicados ou movidos para o `<head>` do documento.

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
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
