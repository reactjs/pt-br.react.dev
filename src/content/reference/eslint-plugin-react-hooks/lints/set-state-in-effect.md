---
title: set-state-in-effect
---

<Intro>

Valida contra a chamada síncrona de `setState` em um efeito, o que pode levar a re-renderizações que degradam o desempenho.

</Intro>

## Detalhes da Regra {/*rule-details*/}

Definir o estado imediatamente dentro de um efeito força o React a reiniciar todo o ciclo de renderização. Quando você atualiza o estado em um efeito, o React precisa re-renderizar seu componente, aplicar as alterações ao DOM e, em seguida, executar os efeitos novamente. Isso cria uma passagem de renderização extra que poderia ter sido evitada transformando dados diretamente durante a renderização ou derivando o estado das props. Transforme os dados no nível superior do seu componente. Este código será executado novamente naturalmente quando as props ou o estado mudarem, sem acionar ciclos de renderização adicionais.

Chamadas síncronas de `setState` em efeitos acionam re-renderizações imediatas antes que o navegador possa pintar, causando problemas de desempenho e lentidão visual. O React precisa renderizar duas vezes: uma para aplicar a atualização de estado e, em seguida, novamente após a execução dos efeitos. Essa renderização dupla é desnecessária quando o mesmo resultado poderia ser alcançado com uma única renderização.

Em muitos casos, você também pode não precisar de um efeito. Consulte [Você Pode Não Precisar de um Efeito](/learn/you-might-not-need-an-effect) para mais informações.

## Violações Comuns {/*common-violations*/}

Esta regra detecta vários padrões onde `setState` síncrono é usado desnecessariamente:

- Definindo estado de carregamento síncronamente
- Derivando estado de props em efeitos
- Transformando dados em efeitos em vez de na renderização

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ setState síncrono em efeito
function Component({data}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data); // Renderização extra, use o estado inicial em vez disso
  }, [data]);
}

// ❌ Definindo estado de carregamento síncronamente
function Component() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Síncrono, causa renderização extra
    fetchData().then(() => setLoading(false));
  }, []);
}

// ❌ Transformando dados em efeito
function Component({rawData}) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(rawData.map(transform)); // Deve ser derivado na renderização
  }, [rawData]);
}

// ❌ Derivando estado de props
function Component({selectedId, items}) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(items.find(i => i.id === selectedId));
  }, [selectedId, items]);
}
```

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ setState em um efeito é aceitável se o valor vier de um ref
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
}

// ✅ Calcular durante a renderização
function Component({selectedId, items}) {
  const selected = items.find(i => i.id === selectedId);
  return <div>{selected?.name}</div>;
}
```

**Quando algo pode ser calculado a partir das props ou do estado existentes, não o coloque no estado.** Em vez disso, calcule-o durante a renderização. Isso torna seu código mais rápido, mais simples e menos propenso a erros. Saiba mais em [Você Pode Não Precisar de um Efeito](/learn/you-might-not-need-an-effect).