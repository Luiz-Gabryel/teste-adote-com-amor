// Cria a  estrutura HTML do VLibras dinamicamente no topo do body
document.body.insertAdjacentHTML('afterbegin', `
  <div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  </div>
`);

// Carrega o script oficial do governo
const script = document.createElement('script');
script.src = 'https://vlibras.gov.br';
script.onload = () => {
    new window.VLibras.Widget('https://vlibras.gov.br');
};
document.body.appendChild(script);
