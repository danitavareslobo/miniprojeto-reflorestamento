document.addEventListener('DOMContentLoaded', function() {
    const ESTAGIOS = {
        SEMENTE: { min: 0, nome: 'semente' },
        PLANTADA: { min: 100, nome: 'plantada' },
        BROTO: { min: 300, nome: 'broto' },
        JOVEM: { min: 700, nome: 'jovem' },
        MADURA: { min: 1500, nome: 'madura' }
    };

    carregarDados().then(dados => {
        inicializarDestaques(dados);
    });

    async function carregarDados() {
        try {
            const response = await fetch('../data/usuarios.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar dados');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return { usuarios: [], acoes: [] };
        }
    }

    function inicializarDestaques(dados) {
        let todosUsuarios = [...dados.usuarios];
        
        const usuarioJSON = localStorage.getItem('usuarioReflorestamento');
        if (usuarioJSON) {
            const usuarioSalvo = JSON.parse(usuarioJSON);
            if (usuarioSalvo.arvoresPlantadas > 0) {
                const usuarioExistente = todosUsuarios.findIndex(u => u.id === usuarioSalvo.id);
                if (usuarioExistente >= 0) {
                    todosUsuarios[usuarioExistente] = {...todosUsuarios[usuarioExistente], ...usuarioSalvo};
                } else {
                    todosUsuarios.push(usuarioSalvo);
                }
            }
        }
        
        const acoesSalvas = JSON.parse(localStorage.getItem('acoesReflorestamento')) || [];
        
        if (acoesSalvas.length > 0) {
            acoesSalvas.forEach(acao => {
                if (acao.idUsuario) {
                    const usuarioIndex = todosUsuarios.findIndex(u => u.id === acao.idUsuario);
                    
                    if (usuarioIndex >= 0) {
                        todosUsuarios[usuarioIndex].arvoresPlantadas += acao.quantidade;
                    } else {
                        const usuarioJSON = dados.usuarios.find(u => u.id === acao.idUsuario);
                        let avatarArvore = 'pau-brasil';
                        
                        if (usuarioJSON) {
                            avatarArvore = usuarioJSON.avatarArvore;
                        }
                        
                        const novoUsuario = {
                            id: acao.idUsuario,
                            nome: acao.nomeUsuario || acao.idUsuario,
                            avatarArvore: avatarArvore,
                            arvoresPlantadas: acao.quantidade,
                            dataCadastro: acao.dataCadastro || acao.data
                        };
                        todosUsuarios.push(novoUsuario);
                    }
                }
            });
        }
        
        dados.acoes.forEach(acao => {
            if (acao.idUsuario) {
                const usuarioIndex = todosUsuarios.findIndex(u => u.id === acao.idUsuario);
                if (usuarioIndex >= 0) {
                    const acaoJaContabilizada = acoesSalvas.some(
                        a => a.idUsuario === acao.idUsuario && 
                             a.data === acao.data && 
                             a.quantidade === acao.quantidade && 
                             a.especie === acao.especie
                    );
                    
                    if (!acaoJaContabilizada) {
                        todosUsuarios[usuarioIndex].arvoresPlantadas += acao.quantidade;
                    }
                }
            }
        });
    
        todosUsuarios.sort((a, b) => b.arvoresPlantadas - a.arvoresPlantadas);
    
        const destaques = todosUsuarios.slice(0, 3);
    
        const destaquesContainer = document.getElementById('destaques-container');
        destaquesContainer.innerHTML = '';
        
        destaques.forEach(usuario => {
            const estagio = determinarEstagio(usuario.arvoresPlantadas);
    
            const card = document.createElement('div');
            card.className = 'destaque-card';
    
            const dataInicio = new Date(usuario.dataCadastro);
            const dataFormatada = dataInicio.toLocaleDateString('pt-BR');

            const avatarSrc = `../assets/${usuario.avatarArvore}-${estagio}.png`;
            
            card.innerHTML = `
                <div class="avatar-container">
                    <img src="${avatarSrc}" alt="Avatar de ${usuario.nome}" class="avatar-img">
                </div>
                <div class="destaque-nome">${usuario.nome}</div>
                <div class="destaque-info">
                    <div class="arvores-plantadas">${usuario.arvoresPlantadas} árvores plantadas</div>
                    <div>Membro desde ${dataFormatada}</div>
                    <div class="badge">Árvore: ${usuario.avatarArvore} - ${estagio}</div>
                </div>
            `;
            
            destaquesContainer.appendChild(card);
        });
    }
    
    function determinarEstagio(arvoresPlantadas) {
        if (arvoresPlantadas >= ESTAGIOS.MADURA.min) {
            return ESTAGIOS.MADURA.nome;
        } else if (arvoresPlantadas >= ESTAGIOS.JOVEM.min) {
            return ESTAGIOS.JOVEM.nome;
        } else if (arvoresPlantadas >= ESTAGIOS.BROTO.min) {
            return ESTAGIOS.BROTO.nome;
        } else if (arvoresPlantadas >= ESTAGIOS.PLANTADA.min) {
            return ESTAGIOS.PLANTADA.nome;
        } else {
            return ESTAGIOS.SEMENTE.nome;
        }
    }
});