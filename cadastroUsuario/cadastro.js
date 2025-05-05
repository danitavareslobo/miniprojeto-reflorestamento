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
    const treeOptions = document.querySelectorAll('.tree-option');
    let selectedTree = null;
    let selectedTreeImageSrc = null;

    treeOptions.forEach(option => {
        option.addEventListener('click', function() {
            treeOptions.forEach(opt => opt.classList.remove('selected'));
            
            this.classList.add('selected');
            
            selectedTree = this.getAttribute('data-tree');

            const imgElement = this.querySelector('.tree-img');
            selectedTreeImageSrc = imgElement ? imgElement.src : null;
            
            document.body.className = selectedTree;
        });
    });

    const cadastroForm = document.getElementById('cadastroForm');
    
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedTree) {
            mostrarToast('Por favor, selecione uma árvore para seu avatar.', 'error', 3000);
            return;
        }
        
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        
        if (senha !== confirmarSenha) {
            mostrarToast('As senhas não coincidem. Por favor, verifique.', 'error', 3000);
            return;
        }
        
        const usuario = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            usuario: document.getElementById('usuario').value,
            senha: senha, 
            avatarArvore: selectedTree,
            avatarImagemSrc: selectedTreeImageSrc,
            arvoresPlantadas: 0, 
            bio: '', 
            dataCadastro: new Date().toISOString()
        };
        
        
        localStorage.setItem('usuarioReflorestamento', JSON.stringify(usuario));
        localStorage.setItem('temaReflorestamento', selectedTree);
        
        mostrarToast('Cadastro realizado com sucesso!', 'success', 3000);
        console.log('Objeto de usuário criado:', usuario);

        window.location.href = '../acoesReflorestamento/acoes.html?cadastro=true';        
    });
});