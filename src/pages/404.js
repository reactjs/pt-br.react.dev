/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

<<<<<<< HEAD
const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Página Não Encontrada</Header>
          <TitleAndMetaTags title="React - Page Not Found" />
          <div css={sharedStyles.markdown}>
            <p>Nós não pudemos encontrar o que você está buscando.</p>
            <p>
              Por favor, contate o dono do site que o redirecionou para a URL
              original e avise-o sobre o link quebrado.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;
=======
export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Not Found'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>This page doesn’t exist.</P>
          <P>
            If this is a mistake{', '}
            <A href="https://github.com/reactjs/reactjs.org/issues/new">
              let us know
            </A>
            {', '}
            and we will try to fix it!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
>>>>>>> e565b43abded279443401b07d170d478c54aabfd
