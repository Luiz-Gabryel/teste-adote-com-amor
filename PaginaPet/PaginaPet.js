// pagina do pet aceita tanto o ID do catálogo estático quanto o ID do Supabase.
// Endereço esperado: PaginaPet.html?id=123 ou PaginaPet.html?doacao=123
const parametros = new URLSearchParams(window.location.search);
const idPet = parametros.get("id") ?? parametros.get("doacao");

const PASTA_PETS = "/assets/img/pets/";
const CHAVE_RETORNO_CATALOGO = "audote-voltar-catalogo";
const CHAVE_SCROLL_CATALOGO = "audote-scroll-catalogo";

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

function esc(texto) {
  return String(texto ?? "").replace(
    /[&<>\"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

function padronizarTexto(valor, fallback = "Não informado") {
  const texto = String(valor ?? "").trim();
  return texto || fallback;
}

function encontrarPetEstatico(id) {
  if (!id || !window.PETS) return null;

  for (const [chave, categoria] of Object.entries(window.PETS)) {
    const pet = categoria?.itens?.find((item) => String(item.id) === String(id));
    if (!pet) continue;

    const fotos = [pet.img].filter(Boolean).map((src) => `${PASTA_PETS}${src}`);
    return {
      id: pet.id,
      nome: pet.nome,
      especie: padronizarTexto(categoria.titulo || chave, "Pet"),
      raca: padronizarTexto(pet.raca || "SRD", "SRD"),
      sexo: padronizarTexto(pet.sexo || pet.extra || "Não informado", "Não informado"),
      idade: padronizarTexto(pet.nasc || pet.idade || "Não informado", "Não informado"),
      cor: padronizarTexto(pet.cor || "Não informado", "Não informado"),
      historia: padronizarTexto(pet.historia || pet.txt || "Este pet está esperando uma família amorosa.", "Este pet está esperando uma família amorosa."),
      cuidados: padronizarTexto(
        pet.cuidados || "Ofereça ambiente seguro, alimentação adequada, cuidado diário e muito carinho.",
        "Ofereça ambiente seguro, alimentação adequada, cuidado diário e muito carinho.",
      ),
      fotos,
      img: fotos[0] || "",
      caracteristicas: Array.isArray(pet.caracteristicas) && pet.caracteristicas.length
        ? pet.caracteristicas
        : ["Carinhoso", "Curioso", "Esperança"],
      textoResumo: padronizarTexto(pet.txt || pet.historia, "Este pet está esperando uma família amorosa."),
    };
  }

  return null;
}

async function encontrarPetDoSupabase(id) {
  if (!id || !window.supabase || typeof SUPABASE_URL === "undefined" || typeof SUPABASE_KEY === "undefined") {
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

    if (error || !data) return null;

    const fotos = Array.isArray(data.fotos) ? data.fotos.filter(Boolean) : [];
    const fotosNorm = fotos.length ? fotos : data.img ? [data.img] : [];

    return {
      id: data.id,
      nome: padronizarTexto(data.nome, "Pet"),
      especie: padronizarTexto(data.especie || "Pet", "Pet"),
      raca: padronizarTexto(data.raca || "Não informado", "Não informado"),
      sexo: padronizarTexto(data.sexo || "Não informado", "Não informado"),
      idade: padronizarTexto(data.idade || "Não informado", "Não informado"),
      cor: padronizarTexto(data.cor || "Não informado", "Não informado"),
      historia: padronizarTexto(data.historia || data.descricao || "Este pet está esperando uma família amorosa.", "Este pet está esperando uma família amorosa."),
      cuidados: padronizarTexto(data.cuidados || "Ofereça ambiente seguro, alimentação adequada, cuidado diário e muito carinho.", "Ofereça ambiente seguro, alimentação adequada, cuidado diário e muito carinho."),
      fotos: fotosNorm,
      img: fotosNorm[0] || "",
      caracteristicas: Array.isArray(data.caracteristicas) && data.caracteristicas.length ? data.caracteristicas : ["Carinhoso", "Curioso", "Esperança"],
      textoResumo: padronizarTexto(data.historia || data.descricao, "Este pet está esperando uma família amorosa."),
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

function mostrarPet(pet) {
  document.title = `${pet.nome} – Audote Com Amor`;

  const imagem = document.getElementById("petImagem");
  const fotos = Array.isArray(pet.fotos) && pet.fotos.length ? pet.fotos : [pet.img].filter(Boolean);
  const fotoPrincipal = fotos[0] || "";

  imagem.src = fotoPrincipal;
  imagem.alt = padronizarTexto(pet.nome, "Pet");

  const resumo =
    pet.historia.length > 220
      ? pet.historia.slice(0, 217).trimEnd() + "..."
      : pet.historia;

  document.getElementById("petNome").textContent = pet.nome;
  const especieTexto = [pet.especie, pet.raca].filter(Boolean).join(", ");
  document.getElementById("petRaca").textContent = especieTexto || "Pet";
  document.getElementById("petDescricao").textContent = resumo;
  document.getElementById("petSobre").textContent = pet.historia;
  document.getElementById("petCuidados").textContent = pet.cuidados;

  const sexo = String(pet.sexo || "");
  const classeSexo = sexo.toLowerCase().includes("macho")
    ? "macho"
    : sexo.toLowerCase().includes("fêmea") || sexo.toLowerCase().includes("femea")
      ? "femea"
      : sexo.toLowerCase().includes("casal")
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

  document.getElementById("petMiniaturas").innerHTML = fotos
    .map((src, i) => `<img src="${esc(src)}" alt="${esc(pet.nome)}, foto ${i + 1}">`)
    .join("");

  document.querySelectorAll("#petMiniaturas img").forEach((mini) => {
    mini.style.cursor = "pointer";
    mini.addEventListener("click", () => {
      imagem.src = mini.src;
    });
  });
}

function naoEncontrado() {
  const principal = document.querySelector("main");
  if (!principal) return;

  principal.innerHTML = `
    <div class="pet__voltar">
      <a class="btn btn--voltar" href="${recuperarDestinoCatalogo()}">← Voltar ao catálogo</a>
    </div>
    <div>
      <h1>Pet não encontrado</h1>
      <p>O pet solicitado não está mais disponível ou o link está incompleto.</p>
      <a class="btn" href="${recuperarDestinoCatalogo()}">Voltar para adoção</a>
    </div>
  `;

  const botao = principal.querySelector(".btn--voltar");
  if (botao) {
    botao.addEventListener("click", (evento) => {
      evento.preventDefault();
      window.location.href = botao.getAttribute("href");
    });
  }
}

async function iniciar() {
  configurarBotaoVoltar();

  const pet = await acharPet(idPet);

  if (!pet) {
    naoEncontrado();
    return;
  }

  mostrarPet(pet);
}

iniciar();