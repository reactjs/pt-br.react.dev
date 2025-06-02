---
title: experimental_useEffectEvent
version: experimental
---

<Experimental>

**Esta API é experimental e ainda não está disponível em uma versão estável do React.**

Você pode experimentá-la atualizando os pacotes do React para a versão experimental mais recente:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Versões experimentais do React podem conter erros. Não as use em produção.

</Experimental>

<Intro>

`useEffectEvent` é um React Hook que permite que você extraia lógica não reativa em um [Effect Event.](/learn/separating-events-from-effects#declaring-an-effect-event)

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />