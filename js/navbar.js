/*
  Navbar: menu mobile + efeito de rolagem.
  A barra NÃO é fixa: ela rola junto com a página e, enquanto sai de vista,
  desliza para cima, encolhe levemente e desaparece (fade) conforme a rolagem.
*/
(() => {
  const barra = document.querySelector(".nav");
  if (!barra) return;

  /* Menu mobile */
  const botao = barra.querySelector(".nav__toggle");
  botao?.addEventListener("click", () => {
    const aberto = barra.classList.toggle("nav--aberto");
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  /* Efeito de rolagem */
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DISTANCIA = 180; /* px de rolagem até a barra sumir por completo */
  let aguardando = false;

  const atualizar = () => {
    aguardando = false;
    if (reduzirMovimento.matches) return;

    const progresso = Math.min(window.scrollY / DISTANCIA, 1);
    barra.style.opacity = String(1 - progresso);
    barra.style.transform = `translateY(${-progresso * 28}px) scale(${1 - progresso * 0.06})`;
    barra.style.pointerEvents = progresso >= 1 ? "none" : "";
  };

  window.addEventListener(
    "scroll",
    () => {
      if (aguardando) return;
      aguardando = true;
      window.requestAnimationFrame(atualizar);
    },
    { passive: true }
  );

  atualizar();
})();
