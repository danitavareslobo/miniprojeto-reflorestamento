function carregarMenu() {
    const menuContainer = document.getElementById('menu-container');
    
    if (!menuContainer) {
        console.error('Elemento com ID "menu-container" não encontrado na página');
        return;
    }
    
    fetch('../menuComponente/menuComponente.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o menu de navegação');
            }
            return response.text();
        })
        .then(html => {
            menuContainer.innerHTML = html;

            inicializarMenu();
        })
        .catch(error => {
            console.error('Erro ao carregar menu:', error);
            menuContainer.innerHTML = '<p>Erro ao carregar o menu de navegação</p>';
        });
}

function inicializarMenu() {
    aplicarTema();
    configurarMenuHamburger();
    marcarLinkAtivo();
    carregarDadosUsuario();
    configurarBotaoSair()
}

function configurarBotaoSair() {
    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); 

                localStorage.removeItem('usuarioReflorestamento');
                localStorage.removeItem('temaReflorestamento');
                localStorage.removeItem('acoesReflorestamento');

                window.location.href = '../cadastroUsuario/cadastro.html?logout=true';
        });
    }
}

function aplicarTema() {
    const temaArmazenado = localStorage.getItem('temaReflorestamento');
    if (temaArmazenado) {
        document.body.className = temaArmazenado;
    }
}

function configurarMenuHamburger() {
    const hamburger = document.getElementById('hamburger-menu');
    const menuList = document.getElementById('menu-list');
    
    if (hamburger && menuList) {
        hamburger.addEventListener('click', function() {
            menuList.classList.toggle('active');
        });
    }
}

function marcarLinkAtivo() {
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

function carregarDadosUsuario() {
    const navUserName = document.getElementById('nav-user-name');
    const navAvatar = document.getElementById('nav-avatar');
    
    if (navUserName && navAvatar) {
        const usuarioJSON = localStorage.getItem('usuarioReflorestamento');
        if (usuarioJSON) {
            const usuario = JSON.parse(usuarioJSON);

            navUserName.textContent = usuario.nome.split(' ')[0]; 

            if (usuario.avatarImagemSrc) {
                navAvatar.src = usuario.avatarImagemSrc;
            } else {
                if (usuario.avatarArvore === 'pau-brasil') {
                    navAvatar.src = 'pau-brasil-madura.png';
                } else if (usuario.avatarArvore === 'castanheira') {
                    navAvatar.src = 'castanheira-madura.png';
                } else if (usuario.avatarArvore === 'peroba-rosa') {
                    navAvatar.src = 'peroba-rosa-madura.png';
                }
            }
            
            navAvatar.alt = `Avatar de ${usuario.nome}`;
        }
    }
}


function verificarUsuarioLogado() {
    const usuarioJSON = localStorage.getItem('usuarioReflorestamento');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

function salvarUsuario(usuario) {
    localStorage.setItem('usuarioReflorestamento', JSON.stringify(usuario));

    if (usuario.avatarArvore) {
        localStorage.setItem('temaReflorestamento', usuario.avatarArvore);
    }
}

function salvarTema(tema) {
    localStorage.setItem('temaReflorestamento', tema);
    document.body.className = tema;
}

function atualizarContagemArvores(quantidade) {
    const usuario = verificarUsuarioLogado();
    if (usuario) {
        usuario.arvoresPlantadas += parseInt(quantidade);
        salvarUsuario(usuario);
        return usuario.arvoresPlantadas;
    }
    return 0;
}

document.addEventListener('DOMContentLoaded', carregarMenu);