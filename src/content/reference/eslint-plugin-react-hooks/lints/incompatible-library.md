---
title: incompatible-library
---

<Intro>

Valida contra o uso de bibliotecas que são incompatíveis com a memoização (manual ou automática).

</Intro>

<Note>

Essas bibliotecas foram projetadas antes que as regras de memoização do React fossem totalmente documentadas. Elas fizeram as escolhas corretas na época para otimizar maneiras ergonômicas de manter os componentes reativos na medida certa conforme o estado do aplicativo muda. Embora esses padrões legados funcionassem, descobrimos desde então que eles são incompatíveis com o modelo de programação do React. Continuaremos trabalhando com os autores das bibliotecas para migrar essas bibliotecas para usar padrões que sigam as Regras do React.

</Note>

## Detalhes da Regra {/*rule-details*/}

Algumas bibliotecas usam padrões que não são suportados pelo React. Quando o linter detecta usos dessas APIs de uma [lista conhecida](https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/HIR/DefaultModuleTypeProvider.ts), ele as sinaliza sob esta regra. Isso significa que o Compilador React pode pular automaticamente componentes que usam essas APIs incompatíveis, a fim de evitar a quebra do seu aplicativo.

```js
// Exemplo de como a memoização quebra com essas bibliotecas
function Form() {
  const { watch } = useForm();

  // ❌ Este valor nunca será atualizado, mesmo quando o campo 'name' mudar
  const name = useMemo(() => watch('name'), [watch]);

  return <div>Name: {name}</div>; // A UI parece "congelada"
}
```

O Compilador React memoiza automaticamente valores seguindo as Regras do React. Se algo quebrar com `useMemo` manual, também quebrará a otimização automática do compilador. Esta regra ajuda a identificar esses padrões problemáticos.

<DeepDive>

#### Projetando APIs que seguem as Regras do React {/*designing-apis-that-follow-the-rules-of-react*/}

Uma pergunta a se considerar ao projetar uma API ou hook de biblioteca é se a chamada da API pode ser memoizada com segurança com `useMemo`. Se não puder, tanto a memoização manual quanto a do Compilador React quebrarão o código do seu usuário.

Por exemplo, um desses padrões incompatíveis é a "mutabilidade interior". Mutabilidade interior é quando um objeto ou função mantém seu próprio estado oculto que muda ao longo do tempo, mesmo que a referência a ele permaneça a mesma. Pense nisso como uma caixa que parece a mesma por fora, mas secretamente reorganiza seu conteúdo. O React não consegue dizer que algo mudou porque ele apenas verifica se você deu a ele uma caixa diferente, não o que está dentro. Isso quebra a memoização, pois o React depende do objeto (ou função) externo mudar se parte de seu valor mudou.

Como regra geral, ao projetar APIs React, pense se `useMemo` a quebraria:

```js
function Component() {
  const { someFunction } = useLibrary();
  // deve ser sempre seguro memoizar funções como esta
  const result = useMemo(() => someFunction(), [someFunction]);
}
```

Em vez disso, projete APIs que retornem estado imutável e usem funções de atualização explícitas:

```js
// ✅ Bom: Retorna estado imutável que muda de referência quando atualizado
function Component() {
  const { field, updateField } = useLibrary();
  // isso é sempre seguro para memoizar
  const greeting = useMemo(() => `Hello, ${field.name}!`, [field.name]);

  return (
    <div>
      <input
        value={field.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <p>{greeting}</p>
    </div>
  );
}
```

</DeepDive>

### Inválido {/*invalid*/}

Exemplos de código incorreto para esta regra:

```js
// ❌ `watch` do react-hook-form
function Component() {
  const {watch} = useForm();
  const value = watch('field'); // Mutabilidade interior
  return <div>{value}</div>;
}

// ❌ `useReactTable` da TanStack Table
function Component({data}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // a instância da tabela usa mutabilidade interior
  return <Table table={table} />;
}
```

<Pitfall>

#### MobX {/*mobx*/}

Padrões MobX como `observer` também quebram as suposições de memoização, mas o linter ainda não os detecta. Se você depende do MobX e descobre que seu aplicativo não funciona com o Compilador React, pode ser necessário usar a diretiva `"use no memo"`.

```js
// ❌ `observer` do MobX
const Component = observer(() => {
  const [timer] = useState(() => new Timer());
  return <span>Seconds passed: {timer.secondsPassed}</span>;
});
```

</Pitfall>

### Válido {/*valid*/}

Exemplos de código correto para esta regra:

```js
// ✅ Para react-hook-form, use `useWatch`:
function Component() {
  const {register, control} = useForm();
  const watchedValue = useWatch({
    control,
    name: 'field'
  });

  return (
    <>
      <input {...register('field')} />
      <div>Current value: {watchedValue}</div>
    </>
  );
}
```

Algumas outras bibliotecas ainda não possuem APIs alternativas que sejam compatíveis com o modelo de memoização do React. Se o linter não pular automaticamente seus componentes ou hooks que chamam essas APIs, por favor, [abra uma issue](https://github.com/facebook/react/issues) para que possamos adicioná-la ao linter.