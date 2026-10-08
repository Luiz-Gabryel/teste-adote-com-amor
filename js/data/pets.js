/*
  Dados do catálogo.
  Para adicionar um pet: inclua um objeto em `itens` e salve a foto em assets/img/pets/.
  `avaliacao` é a imagem decorativa (recorte) exibida ao lado das avaliações da categoria,
  salva em assets/img/avaliacoes/. Se o arquivo não existir, a imagem simplesmente não aparece.
*/
window.PETS = {
  caes: {
    titulo: "Cães",
    campo: "Sexo",
    avaliacao: "avaliacao-caes.png",
    avaliacaoAlt: "Filhote de golden retriever deitado",
    itens: [
      {
        nome: "Cacau",
        nasc: "02/2023",
        extra: "Fêmea",
        img: "cacau.jpg",
        txt: "Tem um coração enorme e só está esperando alguém para compartilhar todo esse amor. Ela merece uma família que cuide, proteja e esteja ao seu lado em todos os momentos. Que tal ser você a pessoa que vai mudar a história dela?"
      },
      {
        nome: "Chefão",
        nasc: "07/2025",
        extra: "Macho",
        img: "chefao.jpg",
        txt: "Prepare-se para ganhar um companheiro cheio de alegria! Ele adora brincar, receber carinho e transformar qualquer dia comum em um momento especial. Só falta uma coisa para ele ficar completo: uma família para chamar de sua."
      },
      {
        nome: "Mel",
        nasc: "01/2026",
        extra: "Fêmea",
        img: "mel.jpg",
        txt: "Por trás desse olhar existe uma cadelinha cheia de amor para dar e uma esperança enorme de encontrar um lar. Talvez o próximo capítulo da história dela possa ser ao seu lado."
      }
    ]
  },

  gatos: {
    titulo: "Gatos",
    campo: "Sexo",
    avaliacao: "avaliacao-gatos.png",
    avaliacaoAlt: "Gato listrado em pé",
    itens: [
      {
        nome: "Pirata",
        nasc: "08/2026",
        extra: "Macho",
        img: "pirata.jpg",
        txt: "Ser diferente não diminui todo o amor que ele tem para oferecer. Com os cuidados e adaptações necessários, ele pode ser um companheiro incrível. Tudo o que precisa é de uma família que enxergue seu coração."
      },
      {
        nome: "Luna",
        nasc: "07/2025",
        extra: "Fêmea",
        img: "luna.jpg",
        txt: "Uma pequena exploradora em busca de um lar para chamar de seu! Curiosa, encantadora e cheia de personalidade, ela está pronta para conquistar uma família com muito carinho e ronronadas. Será que o próximo lar dela pode ser o seu?"
      },
      {
        nome: "Bolota",
        nasc: "08/2026",
        extra: "Fêmea",
        img: "bolota.jpg",
        txt: "Delicada, carinhosa e cheia de charme! Ela está esperando uma família que possa oferecer muito amor, cuidado e um cantinho para chamar de lar. Que tal deixar essa fofura fazer parte da sua vida?"
      }
    ]
  },

  coelhos: {
    titulo: "Coelhos",
    campo: "Cor",
    avaliacao: "avaliacao-coelhos.png",
    avaliacaoAlt: "Dois coelhos lado a lado",
    itens: [
      {
        nome: "Pompom",
        nasc: "12/2025",
        extra: "Castanho claro",
        img: "pompom.jpg",
        txt: "Esse pequeno chegou até nós precisando de carinho e de uma nova chance. Aos poucos, foi mostrando seu jeitinho doce e curioso. Agora, está pronto para encontrar uma família que possa continuar escrevendo uma história cheia de amor ao seu lado."
      },
      {
        nome: "Bolinho e Beijinho",
        nasc: "09/2026",
        extra: "Branco",
        img: "bolinho.jpg",
        txt: "Esses dois coelhinhos ainda são filhotinhos e estão começando a descobrir o mundo juntos. Sempre pertinho um do outro, eles são uma duplinha cheia de fofura, curiosidade e muito carinho."
      },
      {
        nome: "Pulinho",
        nasc: "06/2025",
        extra: "Creme",
        img: "pulinho.jpg",
        txt: "Esse fofinho também está esperando pela sua segunda chance. Com seu jeitinho único e encantador, conquistou todos ao seu redor. Agora, seu maior desejo é encontrar uma família responsável onde possa viver feliz, amado e cuidado para sempre."
      }
    ]
  },

  calopsitas: {
    titulo: "Calopsitas",
    campo: null,
    avaliacao: "avaliacao-calopsitas.png",
    avaliacaoAlt: "Calopsita de crista amarela",
    itens: [
      {
        nome: "Raven",
        nasc: "03/2024",
        img: "raven.jpg",
        txt: "Pequena no tamanho, mas enorme no coração, essa calopsita sonha com um lar para chamar de seu. Ela merece uma família que enxergue todo o encanto que existe nela e esteja disposta a oferecer amor, paciência e muitos cuidados."
      },
      {
        nome: "Flash",
        nasc: "06/2025",
        img: "flash.jpg",
        txt: "Flash ama passear pela tarde, um ótimo companheiro para ouvir músicas, ama plantas e canta muito! Ele é um pet super dócil que apenas quer uma família nova para ser amado."
      },
      {
        nome: "Fantoche",
        nasc: "01/2025",
        img: "fantoche.jpg",
        txt: "Chegou a hora desse pequeno encontrar seu lugar no mundo. Com seu jeitinho especial, ele tem muito amor para receber e também para oferecer. Ama andar de skate!"
      }
    ]
  }
};
