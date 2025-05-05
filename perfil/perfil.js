document.addEventListener('DOMContentLoaded', function() {
    const ESTAGIOS = {
        SEMENTE: { min: 0, nome: 'semente' },
        PLANTADA: { min: 100, nome: 'plantada' },
        BROTO: { min: 300, nome: 'broto' },
        JOVEM: { min: 700, nome: 'jovem' },
        MADURA: { min: 1500, nome: 'madura' }
    };
    
    const TIPOS_ARVORE = {
        PAU_BRASIL: 'pau-brasil',
        CASTANHEIRA: 'castanheira',
        PEROBA_ROSA: 'peroba-rosa'
    };
    
    const MAX_ARVORES = 1500;
    const MARCOS = [0, 375, 750, 1500]; 

    let usuario = inicializarUsuario();
    console.log("Usuário inicializado:", usuario);
    
    carregarDados().then(dados => {
        if (dados && dados.usuarios && usuario.id) {
            const usuarioComplementar = dados.usuarios.find(u => u.id === usuario.id);
            if (usuarioComplementar) {
                console.log("Dados complementares encontrados:", usuarioComplementar);
                Object.keys(usuarioComplementar).forEach(key => {
                    if (!usuario[key] && usuarioComplementar[key]) {
                        usuario[key] = usuarioComplementar[key];
                    }
                });
                renderizarPerfil(usuario);
            }
        }
    }).catch(error => {
        console.error("Erro ao carregar JSON:", error);
    });
    
    renderizarPerfil(usuario);
    configurarEventos(usuario);

    async function carregarDados() {
        try {
            console.log("Tentando carregar JSON...");
            const response = await fetch('../data/usuarios.json');
            if (!response.ok) {
                console.error('Resposta não ok:', response.status);
                throw new Error('Erro ao carregar dados');
            }
            const dados = await response.json();
            console.log("JSON carregado com sucesso:", dados);
            return dados;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            try {
                console.log("Tentando caminho alternativo...");
                const altResponse = await fetch('./data/usuarios.json');
                if (altResponse.ok) {
                    const dados = await altResponse.json();
                    console.log("JSON carregado com sucesso (caminho alt):", dados);
                    return dados;
                }
            } catch (altError) {
                console.error('Erro no caminho alternativo:', altError);
            }
            return { usuarios: [], acoes: [] };
        }
    }

    function inicializarUsuario() {
        let usuarioPadrao = {
            nome: 'Usuário Exemplo',
            email: 'exemplo@email.com',
            usuario: 'usuario_exemplo',
            avatarArvore: localStorage.getItem('temaReflorestamento') || TIPOS_ARVORE.PAU_BRASIL,
            arvoresPlantadas: 0,
            bio: '',
            dataCadastro: new Date().toISOString()
        };

        const usuarioJSON = localStorage.getItem('usuarioReflorestamento');
        if (usuarioJSON) {
            const usuarioSalvo = JSON.parse(usuarioJSON);
            return {...usuarioPadrao, ...usuarioSalvo};
        }
        
        return usuarioPadrao;
    }
    
    function renderizarPerfil(usuario) {
        console.log("Renderizando perfil:", usuario);
        const nomeElement = document.getElementById('nome-usuario');
        const emailElement = document.getElementById('email-usuario');
        const arvoresElement = document.getElementById('arvores-plantadas');
        const dataCadastroElement = document.getElementById('data-cadastro');
        const bioAtualElement = document.getElementById('bio-atual');
        const bioInputElement = document.getElementById('bio-input');
        
        if (nomeElement) nomeElement.textContent = usuario.nome;
        if (emailElement) emailElement.textContent = usuario.email;
        if (arvoresElement) arvoresElement.textContent = usuario.arvoresPlantadas;
        
        if (dataCadastroElement) {
            const dataCadastro = new Date(usuario.dataCadastro);
            const dataFormatada = dataCadastro.toLocaleDateString('pt-BR');
            dataCadastroElement.textContent = dataFormatada;
        }
        
        if (usuario.bio) {
            if (bioAtualElement) bioAtualElement.textContent = usuario.bio;
            if (bioInputElement) bioInputElement.value = usuario.bio;
        }
        
        atualizarAvatarUsuario(usuario);
        atualizarBarraProgresso(usuario.arvoresPlantadas);
    }
    
    function configurarEventos(usuario) {
        const botaoSalvarBio = document.getElementById('salvar-bio');
        if (botaoSalvarBio) {
            botaoSalvarBio.addEventListener('click', function() {
                const novaBio = document.getElementById('bio-input').value;
                document.getElementById('bio-atual').textContent = novaBio;
                
                usuario.bio = novaBio;
                localStorage.setItem('usuarioReflorestamento', JSON.stringify(usuario));
                
                mostrarToast('Biografia atualizada com sucesso!', 'success', 3000);
            });
        }
    }
    
    function atualizarBarraProgresso(arvoresPlantadas) {
        console.log("Atualizando barra de progresso:", arvoresPlantadas);

        const v1 = arvoresPlantadas /  (MAX_ARVORES / 100);
        const porcentagem = Math.min(v1, MAX_ARVORES);
        console.log("Porcentagem calculada:", porcentagem + "%");

        const barraProgresso = document.getElementById('barra-progresso');
        if (barraProgresso) {
            barraProgresso.style.width = porcentagem + '%';
            console.log("Largura da barra definida:", barraProgresso.style.width);
        } else {
            console.error("Elemento da barra de progresso não encontrado!");
        }
        
        const progressoInfo = document.getElementById('progresso-info');
        if (progressoInfo) {
            progressoInfo.textContent = `${arvoresPlantadas} de ${MAX_ARVORES}+ árvores plantadas`;
        }

        atualizarMarcos(arvoresPlantadas);
    }
    
    function atualizarMarcos(arvoresPlantadas) {
        MARCOS.forEach(marco => {
            const elemento = document.getElementById(`milestone-${marco}`);
            if (elemento) {
                if (arvoresPlantadas >= marco) {
                    elemento.classList.add('reached');
                    console.log(`Marco ${marco} alcançado!`);
                } else {
                    elemento.classList.remove('reached');
                }
            } else {
                console.error(`Elemento para o marco ${marco} não encontrado!`);
            }
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
    
    function atualizarAvatarUsuario(usuario) {
        const avatarImg = document.getElementById('avatar-img');
        if (!avatarImg) {
            console.error("Elemento da imagem do avatar não encontrado!");
            return;
        }
        
        const estagio = determinarEstagio(usuario.arvoresPlantadas);
        console.log(`Estágio do avatar: ${estagio} (${usuario.arvoresPlantadas} árvores)`);
        
        let avatarSrc = '';
        if (usuario.avatarArvore) {
            avatarSrc = `../assets/${usuario.avatarArvore}-${estagio}.png`;
            console.log("Caminho do avatar:", avatarSrc);
            avatarImg.src = avatarSrc;
            avatarImg.alt = `Avatar ${usuario.avatarArvore} - Estágio: ${estagio}`;
        } else {
            console.error("Tipo de árvore do avatar não definido!");
        }
    }

    function mostrarToast(mensagem, tipo = 'success', duracao = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.error("Elemento toast não encontrado!");
            return;
        }
        
        const toastText = document.getElementById('toast-text');
        const toastIcon = document.getElementById('toast-icon');
        
        if (toastText) toastText.textContent = mensagem;
        
        toast.className = `toast toast-${tipo}`;
        
        if (toastIcon) toastIcon.textContent = tipo === 'success' ? '✓' : '⚠';
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => toast.classList.remove('show'), duracao);
    }
});