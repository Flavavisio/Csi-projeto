# CSI Campo — PWA

Aplicação de consulta de clientes, visitas e incidências para comerciais, com Supabase Auth e PostgreSQL.

## Executar
Publicar `index.html`, `app.js`, `style.css`, `manifest.webmanifest`, `sw.js`, `offline.html` e `icons/` num domínio HTTPS, por exemplo GitHub Pages.

## Ativar GitHub Pages
No repositório: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.

URL prevista após ativação: https://flavavisio.github.io/Csi-projeto/

## Instalar
- Android / Chrome: abrir o endereço HTTPS e escolher **Instalar aplicação** no menu.
- iOS / Safari: abrir o endereço, tocar em **Partilhar → Adicionar ao ecrã principal**.
- Windows / macOS (Chrome ou Edge): usar **Instalar** na barra de endereço ou no menu.

## Funcionamento offline e privacidade
O service worker guarda **apenas os ficheiros públicos da interface**. Não guarda sessões, dados de clientes, visitas, incidências ou respostas da API do Supabase. Sem Internet é mostrada uma página de aviso e as consultas ficam indisponíveis. O armazenamento do navegador usado pela biblioteca de autenticação é gerido pelo Supabase e deve ser protegido com autenticação do dispositivo.

## Administração
O administrador é `flavio.rosa87@icloud.com`. Apenas administradores autorizados podem criar utilizadores, importar ou exportar clientes. O acesso é verificado no servidor através de RLS e da função administrativa.

## Desenvolvimento
- Base de dados: Supabase `znxsenypronpjvrnmkhx`
- PWA: `manifest.webmanifest` + `sw.js`
- Versão de cache da interface: `csi-campo-shell-v1`
- Após alterações, atualizar a versão do cache no `sw.js` para forçar atualização limpa.
