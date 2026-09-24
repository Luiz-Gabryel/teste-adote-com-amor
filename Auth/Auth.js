const telaLogin = document.getElementById("screen-login");
const telaCadastro = document.getElementById("screen-cadastro");

function mostrarLogin() {
  telaLogin.style.display = "flex";
  telaCadastro.style.display = "none";
}

function mostrarCadastro() {
  telaLogin.style.display = "none";
  telaCadastro.style.display = "flex";
}

document
  .querySelector(".link-to-cadastro")
  .addEventListener("click", mostrarCadastro);

document
  .querySelector(".link-to-login")
  .addEventListener("click", mostrarLogin);

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------- LOGIN ----------
const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-senha").value;
  // objeto do supabase para devolver somende o erro de data e error, await pra ele esperar receber esse dado
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Erro ao fazer login:", error.message);
    alert("Erro ao fazer login: " + error.message);
  } else {
    console.log("Login bem-sucedido:", data);
    alert("Login bem-sucedido!");
  }
});

// ---------- CADASTRO ----------
const formCadastro = document.getElementById("form-cadastro");

formCadastro.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nome = document.getElementById("cad-nome").value.trim();
  const email = document.getElementById("cad-email").value.trim();
  const senha = document.getElementById("cad-senha").value;
  const confirmaSenha = document.getElementById("cad-senha-confirma").value;

  if (senha !== confirmaSenha) {
    alert("As senhas não estão batendo.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: senha,
    options: { data: { nome: nome } },
  });

  if (error) {
    console.error("Cadastro falhou:", error.message);
    alert("Cadastro falhou: " + error.message);
  } else {
    console.log("Cadastro bem-sucedido:", data);
    alert("Cadastro criado!");
    mostrarLogin();
  }
});

const btnGoogle = document.getElementById("btn-google-login");
const msgLogin = document.getElementById("message-login");

btnGoogle.addEventListener("click", async () => {
  btnGoogle.disabled = true;
  msgLogin.textContent = "";

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: new URL("home.html", window.location.href).href,
    },
  });

  if (error) {
    msgLogin.textContent = "Erro ao entrar com Google: " + error.message;
    btnGoogle.disabled = false;
  }
  // Se deu certo, o navegador é redirecionado para o Google automaticamente.
});

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    console.log("Logado como:", session.user.email);
    window.location.href = "home.html"; // página que abre depois do login
  }
});
