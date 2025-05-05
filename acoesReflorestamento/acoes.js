function mostrarToast(mensagem, tipo = 'success', duracao = 3000) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');
    
    toastText.textContent = mensagem;
    
    toast.className = `toast toast-${tipo}`;
    
    toastIcon.textContent = tipo === 'success' ? '✓' : '⚠';
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duracao);
}

function fecharToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const cadastroRealizado = urlParams.get('cadastro');
    
    if (cadastroRealizado === 'true') {
        const usuarioJSON = localStorage.getItem('usuarioReflorestamento');
        if (usuarioJSON) {
            const usuario = JSON.parse(usuarioJSON);
            mostrarToast(`Bem-vindo(a), ${usuario.nome.split(' ')[0]}! Seu cadastro foi realizado com sucesso.`, 'success', 4000);
        } else {
            mostrarToast('Cadastro realizado com sucesso!', 'success', 4000);
        }

        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const acaoForm = document.getElementById('acaoForm');
    const confirmacao = document.getElementById('confirmacao');
    
    acaoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuarioJSON = localStorage.getItem('usuarioReflorestamento');
        let idUsuario = null;
        
        if (usuarioJSON) {
            const usuario = JSON.parse(usuarioJSON);
            idUsuario = usuario.usuario;

            usuario.arvoresPlantadas += parseInt(document.getElementById('quantidade').value);
            localStorage.setItem('usuarioReflorestamento', JSON.stringify(usuario));
        }

        const acao = {
            idUsuario: idUsuario, 
            quantidade: parseInt(document.getElementById('quantidade').value),
            especie: document.getElementById('especie').value,
            data: document.getElementById('data').value,
            local: document.getElementById('local').value,
            dataCadastro: new Date().toISOString()
        };

        let acoes = JSON.parse(localStorage.getItem('acoesReflorestamento')) || [];
        acoes.push(acao);

        localStorage.setItem('acoesReflorestamento', JSON.stringify(acoes));
    });
});