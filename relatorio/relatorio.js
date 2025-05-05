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
    const searchForm = document.getElementById('search-form');
    const resultsBody = document.getElementById('results-body');
    const resultsSummary = document.getElementById('results-summary');
    const noResults = document.getElementById('no-results');

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('acao_registrada') && urlParams.get('acao_registrada') === 'true') {
        mostrarToast('Ação de reflorestamento registrada com sucesso!', 'success', 3000);
        
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }

    carregarDados().then(dados => {
        inicializarRelatorios(dados);
    }).catch(error => {
        console.error("Erro ao carregar dados:", error);
        mostrarToast('Erro ao carregar dados. Verifique o console para mais detalhes.', 'error', 5000);
        inicializarRelatorios({ usuarios: [], acoes: [] });
    });

    async function carregarDados() {
        try {
            console.log('Tentando carregar dados do JSON...');
            const response = await fetch('../data/usuarios.json');
            if (!response.ok) {
                console.error('Resposta não ok:', response.status);
                throw new Error('Erro ao carregar dados');
            }
            const dados = await response.json();
            console.log('Dados carregados com sucesso:', dados);
            return dados;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            try {
                console.log('Tentando caminho alternativo...');
                const altResponse = await fetch('./data/usuarios.json');
                if (altResponse.ok) {
                    const dados = await altResponse.json();
                    console.log('Dados carregados com sucesso (caminho alternativo):', dados);
                    return dados;
                }
            } catch (altError) {
                console.error('Erro no caminho alternativo:', altError);
            }
            return { usuarios: [], acoes: [] };
        }
    }

    function inicializarRelatorios(dados) {
        console.log('Inicializando relatórios com dados:', dados);

        const acoesSalvasJSON = localStorage.getItem('acoesReflorestamento');
        console.log('Ações salvas no localStorage:', acoesSalvasJSON);
        
        const acoesSalvas = acoesSalvasJSON ? JSON.parse(acoesSalvasJSON) : [];
        
        let todasAcoes = [...(dados.acoes || [])];
        console.log('Ações do JSON:', todasAcoes);
        
        if (acoesSalvas.length > 0) {
            console.log('Processando ações do localStorage...');
            const acoesFormatadas = acoesSalvas.map(acao => {
                let especieFormatada = 'Desconhecida';
                
                switch(acao.especie) {
                    case 'ipe': especieFormatada = 'Ipê'; break;
                    case 'angico': especieFormatada = 'Angico'; break;
                    case 'aroeira': especieFormatada = 'Aroeira'; break;
                    case 'jequitiba': especieFormatada = 'Jequitibá'; break;
                    case 'peroba-campo': especieFormatada = 'Peroba do Campo'; break;
                }

                let nomeUsuario = 'Usuário';
                if (acao.idUsuario && dados.usuarios) {
                    const usuarioEncontrado = dados.usuarios.find(u => u.id === acao.idUsuario);
                    if (usuarioEncontrado) {
                        nomeUsuario = usuarioEncontrado.nome;
                    } else {
                        const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioReflorestamento')) || {};
                        nomeUsuario = usuarioSalvo.nome || 'Usuário';
                    }
                }
                
                return {...acao, especieFormatada, nomeUsuario};
            });
    
            todasAcoes = [...todasAcoes, ...acoesFormatadas];
            console.log('Total de ações após mesclar com localStorage:', todasAcoes.length);
        } else {
            console.log('Não há ações no localStorage');
            todasAcoes = todasAcoes.map(acao => {
                if (acao.idUsuario && dados.usuarios) {
                    const usuarioEncontrado = dados.usuarios.find(u => u.id === acao.idUsuario);
                    if (usuarioEncontrado) {
                        return {...acao, nomeUsuario: usuarioEncontrado.nome};
                    }
                }
                return acao;
            });
        }
        
        const especieSelect = document.getElementById('especie');
        if (especieSelect) {
            while (especieSelect.options.length > 1) {
                especieSelect.remove(1);
            }
            
            const especies = [...new Set(todasAcoes.map(acao => acao.especie).filter(Boolean))];
            especies.sort();
            
            especies.forEach(especie => {
                let especieFormatada = 'Desconhecida';
                switch(especie) {
                    case 'ipe': especieFormatada = 'Ipê'; break;
                    case 'angico': especieFormatada = 'Angico'; break;
                    case 'aroeira': especieFormatada = 'Aroeira'; break;
                    case 'jequitiba': especieFormatada = 'Jequitibá'; break;
                    case 'peroba-campo': especieFormatada = 'Peroba do Campo'; break;
                }
                
                const option = document.createElement('option');
                option.value = especie;
                option.textContent = especieFormatada;
                especieSelect.appendChild(option);
            });
        }
        
        mostrarResultados(todasAcoes, dados);
        
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
        
                const usuarioBusca = document.getElementById('usuario').value.toLowerCase();
                const especieBusca = document.getElementById('especie').value;
        
                const resultados = todasAcoes.filter(acao => {
                    const usuarioMatch = usuarioBusca === '' || 
                                      (acao.nomeUsuario && acao.nomeUsuario.toLowerCase().includes(usuarioBusca)) || 
                                      (acao.idUsuario && acao.idUsuario.toLowerCase().includes(usuarioBusca));
                    
                    const especieMatch = especieBusca === '' || acao.especie === especieBusca;
                    
                    return usuarioMatch && especieMatch;
                });
        
                mostrarResultados(resultados, dados);
            });
        } else {
            console.error('Elemento do formulário de busca não encontrado!');
        }
    }
    
    function mostrarResultados(resultados, dadosUsuarios) {
        console.log('Mostrando resultados:', resultados.length, 'registros');
        
        if (!resultsBody) {
            console.error('Elemento resultsBody não encontrado!');
            return;
        }
        
        resultsBody.innerHTML = '';
        
        if (resultados.length === 0) {
            if (noResults) {
                noResults.style.display = 'block';
            }
            if (resultsSummary) {
                resultsSummary.textContent = 'Nenhum resultado encontrado para os filtros selecionados.';
            }
            return;
        }
    
        if (noResults) {
            noResults.style.display = 'none';
        }
    
        resultados.forEach(acao => {
            const row = document.createElement('tr');
    
            const dataPlantio = new Date(acao.data);
            const dataFormatada = dataPlantio.toLocaleDateString('pt-BR');
            
            let nomeUsuarioMostrar = 'Usuário';
            
            if (acao.nomeUsuario && acao.nomeUsuario !== 'Usuário') {
                nomeUsuarioMostrar = acao.nomeUsuario;
            } 
            else if (acao.idUsuario && dadosUsuarios && dadosUsuarios.usuarios) {
                const usuarioEncontrado = dadosUsuarios.usuarios.find(u => u.id === acao.idUsuario);
                if (usuarioEncontrado) {
                    nomeUsuarioMostrar = usuarioEncontrado.nome;
                }
            }
            
            row.innerHTML = `
                <td>${nomeUsuarioMostrar}</td>
                <td>${acao.especieFormatada || 'Desconhecida'}</td>
                <td>${acao.quantidade}</td>
                <td>${acao.local || 'Não informado'}</td>
                <td>${dataFormatada}</td>
            `;
            
            resultsBody.appendChild(row);
        });
    
        if (resultsSummary) {
            const totalArvores = resultados.reduce((total, acao) => total + (acao.quantidade || 0), 0);
            resultsSummary.textContent = `Encontrados ${resultados.length} registros, totalizando ${totalArvores} árvores plantadas.`;
        }
    }
});