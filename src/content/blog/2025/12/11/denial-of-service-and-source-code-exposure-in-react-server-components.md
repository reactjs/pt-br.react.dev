---
title: "Denial of Service and Source Code Exposure in React Server Components"
author: The React Team
date: 2025/12/11
description: Pesquisadores de segurança encontraram e divulgaram duas vulnerabilidades adicionais no React Server Components ao tentar explorar os patches da vulnerabilidade crítica da semana passada. Negação de Serviço de alta vulnerabilidade (CVE-2025-55184) e Exposição de Código-Fonte de média vulnerabilidade (CVE-2025-55183)
---

11 de dezembro de 2025 por [A Equipe do React](/community/team)

_Atualizado em 26 de janeiro de 2026._

---

<Intro>

Pesquisadores de segurança encontraram e divulgaram duas vulnerabilidades adicionais no React Server Components ao tentar explorar os patches da vulnerabilidade crítica da semana passada.

**Essas novas vulnerabilidades não permitem Execução Remota de Código.** O patch para React2Shell permanece eficaz na mitigação do exploit de Execução Remota de Código.

</Intro>

---

As novas vulnerabilidades são divulgadas como:

- **Negação de Serviço - Alta Severidade**: [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184), [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779) e [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864) (CVSS 7.5)
- **Exposição de Código Fonte - Média Severidade**: [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) (CVSS 5.3)

Recomendamos a atualização imediata devido à severidade das vulnerabilidades recém-divulgadas.

<Note>

#### Os patches publicados anteriormente são vulneráveis. {/*the-patches-published-earlier-are-vulnerable*/}

Se você já atualizou para as vulnerabilidades anteriores, precisará atualizar novamente.

Se você atualizou para 19.0.3, 19.1.4 e 19.2.3, [estas estão incompletas](#additional-fix-published), e você precisará atualizar novamente.

Por favor, consulte [as instruções na postagem anterior](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions) para os passos de atualização.

-----

_Atualizado em 26 de janeiro de 2026._

</Note>

Mais detalhes sobre essas vulnerabilidades serão fornecidos após a conclusão da implantação das correções.

## Ação Imediata Necessária {/*immediate-action-required*/}

Essas vulnerabilidades estão presentes nos mesmos pacotes e versões que [CVE-2025-55182](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components).

Isso inclui 19.0.0, 19.0.1, 19.0.2, 19.0.3, 19.1.0, 19.1.1, 19.1.2, 19.1.3, 19.2.0, 19.2.1, 19.2.2 e 19.2.3 de:

* [react-server-dom-webpack](https://www.npmjs.com/package/react-server-dom-webpack)
* [react-server-dom-parcel](https://www.npmjs.com/package/react-server-dom-parcel)
* [react-server-dom-turbopack](https://www.npmjs.com/package/react-server-dom-turbopack?activeTab=readme)

As correções foram retroportadas para as versões 19.0.4, 19.1.5 e 19.2.4. Se você estiver usando qualquer um dos pacotes acima, por favor, atualize para qualquer uma das versões corrigidas imediatamente.

Como antes, se o código React do seu aplicativo não usa um servidor, seu aplicativo não é afetado por essas vulnerabilidades. Se seu aplicativo não usa um framework, bundler ou plugin de bundler que suporte React Server Components, seu aplicativo não é afetado por essas vulnerabilidades.

<Note>

#### É comum que CVEs críticos descubram vulnerabilidades de acompanhamento. {/*its-common-for-critical-cves-to-uncover-followup-vulnerabilities*/}

Quando uma vulnerabilidade crítica é divulgada, pesquisadores examinam caminhos de código adjacentes em busca de técnicas de exploração variantes para testar se a mitigação inicial pode ser contornada.

Esse padrão aparece em toda a indústria, não apenas em JavaScript. Por exemplo, após [Log4Shell](https://nvd.nist.gov/vuln/detail/cve-2021-44228), CVEs adicionais ([1](https://nvd.nist.gov/vuln/detail/cve-2021-45046), [2](https://nvd.nist.gov/vuln/detail/cve-2021-45105)) foram relatados à medida que a comunidade investigava a correção original.

Divulgações adicionais podem ser frustrantes, mas geralmente são um sinal de um ciclo de resposta saudável.

</Note>

### Frameworks e bundlers afetados {/*affected-frameworks-and-bundlers*/}

Alguns frameworks e bundlers React dependiam, tinham dependências `peer` ou incluíam os pacotes React vulneráveis. Os seguintes frameworks e bundlers React são afetados: [next](https://www.npmjs.com/package/next), [react-router](https://www.npmjs.com/package/react-router), [waku](https://www.npmjs.com/package/waku), [@parcel/rsc](https://www.npmjs.com/package/@parcel/rsc), [@vite/rsc-plugin](https://www.npmjs.com/package/@vitejs/plugin-rsc) e [rwsdk](https://www.npmjs.com/package/rwsdk).

Por favor, consulte [as instruções na postagem anterior](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions) para os passos de atualização.

### Mitigações de Provedores de Hospedagem {/*hosting-provider-mitigations*/}

Como antes, trabalhamos com vários provedores de hospedagem para aplicar mitigações temporárias.

Você não deve depender delas para proteger seu aplicativo e ainda assim atualizar imediatamente.

### React Native {/*react-native*/}

Para usuários do React Native que não usam um monorepo ou `react-dom`, sua versão do `react` deve ser fixada em seu `package.json`, e não há passos adicionais necessários.

Se você estiver usando React Native em um monorepo, você deve atualizar _apenas_ os pacotes impactados se eles estiverem instalados:

- `react-server-dom-webpack`
- `react-server-dom-parcel`
- `react-server-dom-turbopack`

Isso é necessário para mitigar os avisos de segurança, mas você não precisa atualizar `react` e `react-dom`, então isso não causará o erro de incompatibilidade de versão no React Native.

Veja [este issue](https://github.com/facebook/react-native/issues/54772#issuecomment-3617929832) para mais informações.

---

## Alta Severidade: Múltiplas Negações de Serviço {/*high-severity-multiple-denial-of-service*/}

**CVEs:** [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864)
**Pontuação Base:** 7.5 (Alta)
**Data**: 26 de janeiro de 2026

Pesquisadores de segurança descobriram que vulnerabilidades adicionais de DoS ainda existem no React Server Components.

As vulnerabilidades são acionadas enviando requisições HTTP especialmente criadas para endpoints de Server Function, e podem levar a travamentos do servidor, exceções de falta de memória ou uso excessivo de CPU; dependendo do caminho de código vulnerável que está sendo exercido, da configuração do aplicativo e do código do aplicativo.

Os patches publicados em 26 de janeiro mitigam essas vulnerabilidades de DoS.

<Note>

#### Correções adicionais publicadas {/*additional-fix-published*/}

A correção original que abordava a DoS em [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) estava incompleta.

Isso deixou versões anteriores vulneráveis. As versões 19.0.4, 19.1.5, 19.2.4 são seguras.

-----

_Atualizado em 26 de janeiro de 2026._

</Note>

---

## Alta Severidade: Negação de Serviço {/*high-severity-denial-of-service*/}

**CVEs:** [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) e [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779)
**Pontuação Base:** 7.5 (Alta)

Pesquisadores de segurança descobriram que uma requisição HTTP maliciosa pode ser criada e enviada para qualquer endpoint de Server Functions que, ao ser desserializada pelo React, pode causar um loop infinito que trava o processo do servidor e consome CPU. Mesmo que seu aplicativo não implemente nenhum endpoint de React Server Function, ele ainda pode ser vulnerável se seu aplicativo suportar React Server Components.

Isso cria um vetor de vulnerabilidade onde um atacante pode negar o acesso dos usuários ao produto e potencialmente ter um impacto de desempenho no ambiente do servidor.

Os patches publicados hoje mitigam prevenindo o loop infinito.

## Média Severidade: Exposição de Código Fonte {/*low-severity-source-code-exposure*/}

**CVE:** [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183)
**Pontuação Base**: 5.3 (Média)

Um pesquisador de segurança descobriu que uma requisição HTTP maliciosa enviada a uma Server Function vulnerável pode retornar de forma insegura o código fonte de qualquer Server Function. A exploração requer a existência de uma Server Function que exponha explicitamente ou implicitamente um argumento stringificado:

```javascript
'use server';

export async function serverFunction(name) {
  const conn = db.createConnection('SECRET KEY');
  const user = await conn.createUser(name); // implicitamente stringificado, vazado no db

  return {
   id: user.id,
   message: `Hello, ${name}!` // explicitamente stringificado, vazado na resposta
  }}
```

Um atacante pode vazar o seguinte:

```txt
0:{"a":"$@1","f":"","b":"Wy43RxUKdxmr5iuBzJ1pN"}
1:{"id":"tva1sfodwq","message":"Hello, async function(a){console.log(\"serverFunction\");let b=i.createConnection(\"SECRET KEY\");return{id:(await b.createUser(a)).id,message:`Hello, ${a}!`}}!"}
```

Os patches publicados hoje impedem a stringificação do código fonte da Server Function.

<Note>

#### Apenas segredos no código fonte podem ser expostos. {/*only-secrets-in-source-code-may-be-exposed*/}

Segredos codificados no código fonte podem ser expostos, mas segredos em tempo de execução como `process.env.SECRET` não são afetados.

O escopo do código exposto é limitado ao código dentro da Server Function, que pode incluir outras funções dependendo da quantidade de inlining que seu bundler fornece.

Sempre verifique contra os bundles de produção.

</Note>

---

## Cronologia {/*timeline*/}
* **3 de dezembro**: Vazamento relatado à Vercel e [Meta Bug Bounty](https://bugbounty.meta.com/) por [Andrew MacPherson](https://github.com/AndrewMohawk).
* **4 de dezembro**: DoS inicial relatada ao [Meta Bug Bounty](https://bugbounty.meta.com/) por [RyotaK](https://ryotak.net).
* **6 de dezembro**: Ambos os problemas confirmados pela equipe do React, e a equipe começou a investigar.
* **7 de dezembro**: Correções iniciais criadas e a equipe do React começou a verificar e planejar um novo patch.
* **8 de dezembro**: Provedores de hospedagem afetados e projetos de código aberto notificados.
* **10 de dezembro**: Mitigações de provedores de hospedagem implementadas e patches verificados.
* **11 de dezembro**: DoS adicional relatada ao [Meta Bug Bounty](https://bugbounty.meta.com/) por Shinsaku Nomura.
* **11 de dezembro**: Patches publicados e divulgados publicamente como [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) e [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184).
* **11 de dezembro**: Caso de DoS ausente encontrado internamente, corrigido e divulgado publicamente como [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779).
* **26 de janeiro**: Casos adicionais de DoS encontrados, corrigidos e divulgados publicamente como [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864).
---

## Atribuição {/*attribution*/}

Agradecemos a [Andrew MacPherson (AndrewMohawk)](https://github.com/AndrewMohawk) por relatar a Exposição de Código Fonte, [RyotaK](https://ryotak.net) da GMO Flatt Security Inc e Shinsaku Nomura da Bitforest Co., Ltd. por relatar as vulnerabilidades de Negação de Serviço. Agradecemos a [Mufeed VH](https://x.com/mufeedvh) da [Winfunc Research](https://winfunc.com), [Joachim Viide](https://jviide.iki.fi), [RyotaK](https://ryotak.net) da [GMO Flatt Security Inc](https://flatt.tech/en/) e Xiangwei Zhang da Tencent Security YUNDING LAB por relatar as vulnerabilidades adicionais de DoS.