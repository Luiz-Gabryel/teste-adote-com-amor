// pagina do pet só mostra pets doados (tabela "doacoes" do Supabase).
// Endereço: PaginaPet.html?doacao=ID
const parametros = new URLSearchParams(window.location.search);
const idDoacao = parametros.get("doacao");

// HTML Escaping
function esc(texto) {
  return String(texto ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

async function acharPet(id) {
  if (!id || !/^\d+$/.test(id)) return null;

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
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function mostrarPet(pet) {
  document.title = `${pet.nome} – Audote Com Amor`;

  const imagem = document.getElementById("petImagem");
  imagem.src = pet.fotos[0];
  imagem.alt = pet.nome;

  const resumo =
    pet.historia.length > 220
      ? pet.historia.slice(0, 217).trimEnd() + "..."
      : pet.historia;

  document.getElementById("petNome").textContent = pet.nome;
  document.getElementById("petRaca").textContent = `${pet.especie}, ${pet.sexo}`;
  document.getElementById("petDescricao").textContent = resumo;
  document.getElementById("petSobre").textContent = pet.historia;
  document.getElementById("petCuidados").textContent = pet.cuidados;

  // cor da etiqueta de sexo
  const sexo = String(pet.sexo || "");
  const classeSexo = sexo.startsWith("Macho")
    ? "macho"
    : sexo.startsWith("Fêmea")
      ? "femea"
      : "casal";

  document.getElementById("petTags").innerHTML = `
    <span class="tag ${classeSexo}">Sexo: ${esc(pet.sexo)}</span>
    <span class="tag claro">Idade: ${esc(pet.idade)}</span>
    <span class="tag azul">Cor: ${esc(pet.cor)}</span>
  `;

  document.getElementById("petMiniaturas").innerHTML = pet.fotos
    .map((src, i) => `<img src="${esc(src)}" alt="${esc(pet.nome)}, foto ${i + 1}">`)
    .join("");

  // clicar numa miniatura troca a foto principal
  document.querySelectorAll("#petMiniaturas img").forEach((mini) => {
    mini.style.cursor = "pointer";
    mini.addEventListener("click", () => {
      imagem.src = mini.src;
    });
  });
}

function naoEncontrado() {
  document.querySelector("main").innerHTML = `
    <h1>Pet não encontrado</h1>

    <a class="btn" href="/Catalogo-Geral/home.html#adote">
      Voltar para adoção
    </a>
  `;
}

async function iniciar() {
  const pet = await acharPet(idDoacao);

  if (!pet) {
    naoEncontrado();
    return;
  }

  mostrarPet(pet);
}

iniciar();