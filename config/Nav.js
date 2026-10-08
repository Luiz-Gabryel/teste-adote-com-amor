/* ==========================================================
   MENU DO SITE (um arquivo só para todas as páginas)
   ----------------------------------------------------------
   COMO USAR EM UMA PÁGINA:
     1) Onde ficava o <header><nav class="menu">...</nav></header>
        coloque só isto:
            <header data-menu-site></header>

     2) No fim do <body>:
            <script src="/config/Nav.js"></script>

   COMO TROCAR TEXTOS E LINKS:
     Mexa somente na parte "CONFIGURAÇÃO" abaixo.

   O visual do menu fica no arquivo:
            /config/Nav.css
========================================================== */

(() => {
  // ================= CONFIGURAÇÃO mexer somente nessa parte =================

  const MENU = {
    // para onde ir depois de clicar em SAIR
    aposSair: "/index.html",

    // usados só se a página não tiver carregado o Supabase / config.js
    supabaseCdn: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
    configPath: "/Auth/config.js",

    // Itens do menu, na ordem em que aparecem.
    //
    //  texto    : o que aparece escrito
    //  href     : para onde leva
    //  logado   : o que MUDA quando a pessoa está logada
    //             (pode trocar texto, href e/ou acao)
    //  acao     : "sair" faz logout ao clicar
    //  visivel  : "todos" (padrão), "logado" ou "deslogado"
    //
    //  Dentro de "texto" dá para usar {nome} = nome da pessoa logada.
    itens: [
      {
        texto: "ENTRAR",
        href: "/Auth/Auth.html",
        logado: { texto: "MINHA CONTA", acao: "sair" },
        // logado: { texto: "OLÁ, {nome}", acao: "sair" },
      },
      {
        texto: "ADOTE",
        href: "/adote.html",
      },
      {
        tipo: "logo",
        href: "/index.html",
        src: "/assets/img/ui/logo.png",
        alt: "Adote Com Amor, página inicial",
      },
      {
        texto: "DOE AQUI",
        href: "/CadastrarPet/CadastroPet.html",
      },
      {
        texto: "SAIBA MAIS",
        href: "/saiba-mais.html",
      },
    ],
  };

  // ================= Não Mexer =================

  function nomeDaPessoa(usuario) {
    if (!usuario) return "";
    const meta = usuario.user_metadata || {};
    const nome =
      meta.full_name || meta.name || meta.nome || usuario.email || "";
    return String(nome).split(" ")[0]; // só o primeiro nome
  }

  function visivelPara(item, usuario) {
    if (item.visivel === "logado") return Boolean(usuario);
    if (item.visivel === "deslogado") return !usuario;
    return true;
  }

  function resolverItem(item, usuario) {
    return usuario && item.logado ? { ...item, ...item.logado } : item;
  }

  function criarItem(item, nome) {
    const a = document.createElement("a");
    a.href = item.href || "#";

    if (item.tipo === "logo") {
      a.className = "logo";
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "";
      a.appendChild(img);
      return a;
    }

    a.textContent = String(item.texto || "").replace("{nome}", nome);

    // marca a página atual
    try {
      const destino = new URL(a.href, window.location.origin);
      if (destino.pathname === window.location.pathname && !item.acao) {
        a.setAttribute("aria-current", "page");
      }
    } catch (_) {}

    if (item.acao === "sair") {
      a.href = "#";
      a.addEventListener("click", sair);
    }

    return a;
  }

  function desenhar(usuario) {
    const nome = nomeDaPessoa(usuario);

    document.querySelectorAll("[data-menu-site]").forEach((caixa) => {
      const nav = document.createElement("nav");
      nav.className = "menu";
      nav.setAttribute("aria-label", "Principal");

      MENU.itens
        .filter((item) => visivelPara(item, usuario))
        .map((item) => resolverItem(item, usuario))
        .forEach((item) => nav.appendChild(criarItem(item, nome)));

      caixa.replaceChildren(nav);
    });
  }

  // ---------- saber quem ta logado ----------

  let cliente = null;

  function pegarCliente() {
    if (cliente) return cliente;
    if (!window.supabase || typeof SUPABASE_URL === "undefined") return null;

    cliente = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { detectSessionInUrl: false },
    });
    return cliente;
  }

  function carregarScript(src) {
    return new Promise((ok, erro) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = ok;
      s.onerror = erro;
      document.head.appendChild(s);
    });
  }

  async function garantirDependencias() {
    if (!window.supabase) await carregarScript(MENU.supabaseCdn);
    if (typeof SUPABASE_URL === "undefined")
      await carregarScript(MENU.configPath);
  }

  async function sair(e) {
    e.preventDefault();
    try {
      await pegarCliente()?.auth.signOut();
    } catch (err) {
      console.error("Menu: erro ao sair.", err);
    }
    window.location.href = MENU.aposSair;
  }

  async function iniciar() {
    desenhar(null);

    try {
      await garantirDependencias();

      const c = pegarCliente();
      if (!c) return;

      const { data } = await c.auth.getSession();
      desenhar(data.session?.user ?? null);

      c.auth.onAuthStateChange((_evento, sessao) => {
        desenhar(sessao?.user ?? null);
      });
    } catch (err) {
      console.error("Menu: não foi possível checar o login.", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
