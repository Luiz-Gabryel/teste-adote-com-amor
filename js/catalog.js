/* Renderiza o catálogo a partir de window.PETS. Usa textContent (sem innerHTML) para evitar XSS. */
(() => {
  const PASTA_PETS = "assets/img/pets/";
  const PASTA_ICONES = "assets/img/icones/";
  const PASTA_AVALIACOES = "assets/img/avaliacoes/";
  const CHAVE_RETORNO_CATALOGO = "audote-voltar-catalogo";
  const CHAVE_SCROLL_CATALOGO = "audote-scroll-catalogo";

  const salvarRetornoCatalogo = () => {
    try {
      sessionStorage.setItem(CHAVE_RETORNO_CATALOGO, `${location.pathname}${location.search}${location.hash}`);
      sessionStorage.setItem(CHAVE_SCROLL_CATALOGO, String(window.scrollY || 0));
    } catch (erro) {
      console.warn("Não foi possível salvar a posição do catálogo:", erro);
    }
  };

  if (document.body) {
    window.addEventListener("beforeunload", salvarRetornoCatalogo);
    window.addEventListener("pagehide", salvarRetornoCatalogo);
  }

  if (window.location.pathname.endsWith("/adote.html") || window.location.pathname.endsWith("/categoria.html")) {
    salvarRetornoCatalogo();
  }

  const criar = (tag, classe, texto) => {
    const no = document.createElement(tag);
    if (classe) no.className = classe;
    if (texto) no.textContent = texto;
    return no;
  };

  const criarTag = (classe, icone, texto) => {
    const tag = criar("span", classe);
    const img = criar("img", "tag__icone");
    img.src = `${PASTA_ICONES}${icone}.svg`;
    img.alt = "";
    tag.append(img, texto);
    return tag;
  };

  const iconeDoCampo = (campo, valor) => {
    if (campo === "Sexo") return valor === "Macho" ? "macho" : "femea";
    return "info";
  };

  const tipo = new URLSearchParams(location.search).get("tipo");
  const lista = document.getElementById("lista-pets");
  const grade = document.getElementById("grade-pets");

  /* ---------- Página de categoria ---------- */
  if (lista) {
    const chave = window.PETS[tipo] ? tipo : "caes";
    const categoria = window.PETS[chave];
    const porPagina = 3;
    const petsCategoria = categoria?.itens || [];
    let petsExibidos = Math.min(porPagina, petsCategoria.length || 0);
    const botaoVerMais = document.getElementById("ver-mais-btn");

    function renderizarCategoria() {
      lista.innerHTML = "";

      const petsVisiveis = petsCategoria.slice(0, petsExibidos);

      petsVisiveis.forEach((pet) => {
        const artigo = criar("article", "pet");

        const foto = criar("div", "pet__foto");
        const img = criar("img");
        img.src = PASTA_PETS + pet.img;
        img.alt = `Foto de ${pet.nome}`;
        img.loading = "lazy";
        foto.append(img);

        const info = criar("div", "pet__info");
        const tags = criar("div", "pet__tags");
        tags.append(criarTag("tag tag--laranja", "calendario", `Nascimento: ${pet.nasc}`));
        if (categoria.campo) {
          tags.append(
            criarTag(
              "tag tag--sexo",
              iconeDoCampo(categoria.campo, pet.extra),
              `${categoria.campo}: ${pet.extra}`
            )
          );
        }

        const botao = criar("a", "btn", "Conhecer mais");
        botao.href = `PaginaPet/PaginaPet.html?id=${pet.id}`;

        info.append(criar("h3", "", pet.nome), tags, criar("p", "", pet.txt), botao);
        artigo.append(foto, info);
        lista.append(artigo);
      });

      if (botaoVerMais) {
        const existeMais = petsExibidos < petsCategoria.length;
        botaoVerMais.hidden = !existeMais;
        botaoVerMais.disabled = !existeMais;
        botaoVerMais.setAttribute("aria-disabled", String(!existeMais));
        botaoVerMais.textContent = existeMais ? "Ver mais" : "Todos os pets exibidos";
      }
    }

    document.title = `${categoria.titulo} para adoção | Audote com Amor`;
    document.body.classList.add(`tema-${chave}`);
    document.getElementById("titulo-categoria").textContent = categoria.titulo;
    document
      .querySelector(`.categorias a[href$="tipo=${chave}"]`)
      ?.setAttribute("aria-current", "page");

    if (botaoVerMais) {
      botaoVerMais.addEventListener("click", () => {
        if (petsExibidos >= petsCategoria.length) return;
        petsExibidos = Math.min(petsExibidos + porPagina, petsCategoria.length);
        renderizarCategoria();
      });
    }

    renderizarCategoria();

    /* Imagem decorativa das avaliações (some se o arquivo não existir) */
    const arte = document.getElementById("avaliacao-arte");
    if (arte) {
      arte.addEventListener("error", () => arte.classList.add("is-ausente"));
      arte.alt = categoria.avaliacaoAlt || "";
      arte.src = PASTA_AVALIACOES + categoria.avaliacao;
    }
  }

  /* ---------- Catálogo geral ---------- */
  if (grade) {
    Object.entries(window.PETS).forEach(([chave, categoria]) => {
      categoria.itens.forEach((pet) => {
        const item = criar("li");
        const link = criar("a", "card");
        link.href = `PaginaPet/PaginaPet.html?id=${pet.id}`;

        const img = criar("img");
        img.src = PASTA_PETS + pet.img;
        img.alt = `${pet.nome}, ${categoria.titulo.toLowerCase()} para adoção`;
        img.loading = "lazy";

        link.append(img, criar("h3", "", pet.nome));
        item.append(link);
        grade.append(item);
      });
    });
  }
})();
