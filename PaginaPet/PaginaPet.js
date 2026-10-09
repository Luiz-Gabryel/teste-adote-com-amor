// Página do pet: aceita ID do catálogo estático ou do Supabase.
// Endereços: PaginaPet.html?id=caes-cacau
//            PaginaPet.html?doacao=123

const parametros = new URLSearchParams(window.location.search);
const idPet = parametros.get("id") ?? parametros.get("doacao");

const PASTA_PETS = "/assets/img/pets/";
const CHAVE_RETORNO_CATALOGO = "audote-voltar-catalogo";
const CHAVE_SCROLL_CATALOGO = "audote-scroll-catalogo";

// Recupera a página do catálogo para o botão voltar.
function recuperarDestinoCatalogo() {
  const destino = sessionStorage.getItem(CHAVE_RETORNO_CATALOGO);

  if (destino && destino.startsWith("/")) {
    return destino;
  }

  return "/adote.html";
}

function configurarBotaoVoltar() {
  const botao = document.getElementById("voltarCatalogo");
  if (!botao) return;

  const destino = recuperarDestinoCatalogo();
  botao.href = destino;

  botao.addEventListener("click", (evento) => {
    evento.preventDefault();
    window.location.href = destino;
  });
}

// Escapa conteúdo antes de inserir no HTML.
function esc(texto) {
  return String(texto ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function padronizarTexto(valor, fallback = "Não informado") {
  const texto = String(valor ?? "").trim();
  return texto || fallback;
}

// Busca o pet no catálogo estático e aproveita as imagens
// dos outros pets da mesma categoria para as miniaturas.
function encontrarPetEstatico(id) {
  if (!id || !window.PETS) return null;

  for (const [chave, categoria] of Object.entries(window.PETS)) {
    const pet = categoria?.itens?.find(
      (item) => String(item.id) === String(id),
    );

    if (!pet) continue;

    const outrosPets = (categoria.itens || []).filter(
      (item) => String(item.id) !== String(pet.id) && item.img,
    );

    const fotos = [pet.img, ...outrosPets.map((item) => item.img)]
      .filter(Boolean)
      .slice(0, 4)
      .map((src) => `${PASTA_PETS}${src}`);

    return {
      id: pet.id,
      nome: pet.nome,
      especie: padronizarTexto(categoria.titulo || chave, "Pet"),
      raca: padronizarTexto(pet.raca || "SRD", "SRD"),
      sexo: padronizarTexto(pet.sexo || pet.extra || "Não informado"),
      idade: padronizarTexto(pet.nasc || pet.idade),
      cor: padronizarTexto(pet.cor),
      historia: padronizarTexto(
        pet.historia ||
          pet.txt ||
          "Este pet está esperando uma família amorosa.",
      ),
      cuidados: padronizarTexto(
        pet.cuidados ||
          "Ofereça ambiente seguro, alimentação adequada, cuidado diário e muito carinho.",
      ),
      fotos,
      img: fotos[0] || "",
      caracteristicas:
        Array.isArray(pet.caracteristicas) && pet.caracteristicas.length
          ? pet.caracteristicas
          : ["Carinhoso", "Curioso", "Esperança"],
      textoResumo: padronizarTexto(
        pet.txt || pet.historia,
        "Este pet está esperando uma família amorosa.",
      ),
    };
  }

  return null;
}

// Busca uma doação no Supabase.
async function encontrarPetDoSupabase(id) {
  if (
    !id ||
    !window.supabase ||
    typeof SUPABASE_URL === "undefined" ||
    typeof SUPABASE_KEY === "undefined"
  ) {
    return null;
  }

  try {
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data, error } = await client
      .from("doacoes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("Erro ao buscar doação:", error);
      return null;
    }

    const fotos = Array.isArray(data.fotos) ? data.fotos.filter(Boolean) : [];

    const fotosNorm = fotos.length ? fotos : data.img ? [data.img] : [];

    return {
      id: data.id,
      nome: padronizarTexto(data.nome, "Pet"),
      especie: padronizarTexto(data.especie, "Pet"),
      raca: padronizarTexto(data.raca),
      sexo: padronizarTexto(data.sexo),
      idade: padronizarTexto(data.idade),
      cor: padronizarTexto(data.cor),
      historia: padronizarTexto(
        data.historia ||
          data.descricao ||
          "Este pet está esperando uma família amorosa.",
      ),
      cuidados: padronizarTexto(
        data.cuidados ||
          "Ofereça ambiente seguro, alimentação adequada, cuidado diário e muito carinho.",
      ),
      fotos: fotosNorm,
      img: fotosNorm[0] || "",
      caracteristicas:
        Array.isArray(data.caracteristicas) && data.caracteristicas.length
          ? data.caracteristicas
          : ["Carinhoso", "Curioso", "Esperança"],
      textoResumo: padronizarTexto(
        data.historia || data.descricao,
        "Este pet está esperando uma família amorosa.",
      ),
    };
  } catch (err) {
    console.error("Erro ao buscar pet no Supabase:", err);
    return null;
  }
}

async function acharPet(id) {
  if (!id) return null;

  const petEstatico = encontrarPetEstatico(id);
  if (petEstatico) return petEstatico;

  return encontrarPetDoSupabase(id);
}

// Monta a página do pet.
function mostrarPet(pet) {
  document.title = `${pet.nome} – Audote Com Amor`;

  const imagem = document.getElementById("petImagem");
  const miniaturas = document.getElementById("petMiniaturas");

  const fotos = Array.isArray(pet.fotos)
    ? pet.fotos.filter((foto) => typeof foto === "string" && foto.trim() !== "")
    : [];

  const fotoPrincipal = fotos[0] || pet.img || "";

  imagem.src = fotoPrincipal;
  imagem.alt = padronizarTexto(pet.nome, "Pet");

  const historia = padronizarTexto(pet.historia);
  const resumo =
    historia.length > 220 ? historia.slice(0, 217).trimEnd() + "..." : historia;

  document.getElementById("petNome").textContent = pet.nome;

  const especieTexto = [pet.especie, pet.raca].filter(Boolean).join(", ");

  document.getElementById("petRaca").textContent = especieTexto || "Pet";
  document.getElementById("petDescricao").textContent = resumo;
  document.getElementById("petSobre").textContent = historia;
  document.getElementById("petCuidados").textContent = pet.cuidados;

  // Define a cor da etiqueta de sexo.
  const sexo = String(pet.sexo || "").toLowerCase();

  const classeSexo = sexo.includes("macho")
    ? "macho"
    : sexo.includes("fêmea") || sexo.includes("femea")
      ? "femea"
      : sexo.includes("casal")
        ? "casal"
        : "escuro";

  const tags = [
    { classe: classeSexo, label: `Sexo: ${pet.sexo}` },
    { classe: "claro", label: `Idade: ${pet.idade}` },
    { classe: "azul", label: `Cor: ${pet.cor}` },
  ];

  document.getElementById("petTags").innerHTML = tags
    .map((tag) => `<span class="tag ${tag.classe}">${esc(tag.label)}</span>`)
    .join("");

  // Cria as três miniaturas com imagens diferentes.
  // No catálogo estático, usa as fotos dos outros pets da categoria.
  // No Supabase, usa as fotos adicionais cadastradas na doação.
  let fotosAdicionais = fotos.slice(1, 4);

  // Cria os espaços restantes se houver menos de três fotos adicionais.
  // Quando não houver outra foto disponível, usa a foto principal.
  while (fotosAdicionais.length < 3 && fotoPrincipal) {
    const indice = fotosAdicionais.length % fotos.length;
    fotosAdicionais.push(fotos[indice] || fotoPrincipal);
  }

  miniaturas.innerHTML = fotosAdicionais
    .slice(0, 3)
    .map(
      (src, i) => `
        <img
          src="${esc(src)}"
          alt="${esc(pet.nome)}, foto adicional ${i + 1}"
          tabindex="0"
        >
      `,
    )
    .join("");

  // Clicar ou usar Enter/Espaço troca a foto principal.
  miniaturas.querySelectorAll("img").forEach((mini) => {
    mini.style.cursor = "pointer";

    const trocarFoto = () => {
      imagem.src = mini.src;
      imagem.alt = mini.alt;
    };

    mini.addEventListener("click", trocarFoto);

    mini.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        trocarFoto();
      }
    });
  });
}

function naoEncontrado() {
  const principal = document.querySelector("main");
  if (!principal) return;

  const destino = recuperarDestinoCatalogo();

  principal.innerHTML = `
    <div class="pet__voltar">
      <a class="btn btn--voltar" href="${esc(destino)}">
        ← Voltar ao catálogo
      </a>
    </div>

    <div>
      <h1>Pet não encontrado</h1>
      <p>O pet solicitado não está mais disponível ou o link está incompleto.</p>
      <a class="btn" href="${esc(destino)}">Voltar para adoção</a>
    </div>
  `;
}

// Aplica a textura e limita o fundo à área do main.
function configurarFundoMain() {
  const main = document.querySelector("main");
  if (!main) return;

  main.style.width = "min(1100px, 90%)";
  main.style.margin = "30px auto";
  main.style.padding = "30px";
  main.style.boxSizing = "border-box";
  main.style.backgroundImage = 'url("../assets/img/fundos/fundo-textura.png")';
  main.style.backgroundRepeat = "repeat";
  main.style.backgroundSize = "260px";
  main.style.borderRadius = "20px";
}

async function iniciar() {
  configurarBotaoVoltar();
  configurarFundoMain();

  const pet = await acharPet(idPet);

  if (!pet) {
    naoEncontrado();
    return;
  }

  mostrarPet(pet);
}

iniciar();
