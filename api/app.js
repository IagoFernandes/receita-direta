
var incluirRegistro = document.getElementById('incluirRegistro');
var incluirResposta = document.getElementById('incluirResposta');
var recuperarRegistro = document.getElementById('recuperarRegistro');
var recuperarResposta = document.getElementById('recuperarResposta');
var mudarProprietario = document.getElementById('mudarProprietario');
var proprietarioResposta = document.getElementById('proprietarioResposta');

incluirRegistro.addEventListener('submit', function(e){
    e.preventDefault();
    var dados = new FormData(incluirRegistro);
    console.log(dados.get('id'));
    incluirResposta.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${'Aguarde, registro em andamento!'}
        </div>
        `
    $("#botaoRegistro").prop("disabled",true);
    //$(".load").append('<div class="loader"></div>');
    $.ajax({
        url: 'http://localhost:3004/incluirRegistro',
        contentType: 'application/json',
        cache: false,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            id: dados.get('id'),
            receitaId: dados.get('receitaId'),
            pacienteId: dados.get('pacienteId'),
            medicoId: dados.get('medicoId'),
            dhc: dados.get('dhc'),
            posologia: dados.get('posologia')
        }),
        success: function(data) {
            console.log(data);
             $("#botaoRegistro").prop("disabled",false);
            //$('.loader').remove();
            if(data.message == 'Id já utilizado!'){
                incluirResposta.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${data.message}
                </div>
                `    
            }else{
                incluirResposta.innerHTML = `
                <div class="alert alert-primary" role="alert">
                ${data.message}
                </div>
                `
            }
        }, 
        error: function (request, status, error) {
            alert('Erro ao enviar requisição!');
            $("#botaoRegistro").prop("disabled",false);
            $('.loader').remove();
            incluirResposta.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${data.message}
            </div>
            `
        }
    });

});

recuperarRegistro.addEventListener('submit', async function(e){
    e.preventDefault();
    var dados = new FormData(recuperarRegistro);
    console.log(dados.get('id'));
    $("#botaoRecuperar").prop("disabled",true);
    $.ajax({
        url: 'http://localhost:3004/recuperarRegistro',
        contentType: 'application/json',
        cache: false,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            id: dados.get('id')
        }),
        success: function(data) {
            console.log(data.registro);
            $("#botaoRecuperar").prop("disabled",false);
            recuperarResposta.innerHTML = `
            <div class="alert alert-primary" role="alert">
                ${'receitaId: ' + data.registro[0] + ', pacienteId: ' + data.registro[1] + ', medicoId: ' + data.registro[2] + ', dhc: ' + data.registro[3] + ', posologia: ' + data.registro[4]}
            </div>
            `
        }, 
        error: function (request, status, error) {
            alert('Erro ao enviar requisição!');
            $("#botaoRecuperar").prop("disabled",false);
            recuperarResposta.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${data.message}
            </div>
            `
        }
    });

});

mudarProprietario.addEventListener('submit', function(e){
    e.preventDefault();
    var dados = new FormData(mudarProprietario);
    console.log(dados.get('address'));
    $("#botaoProprietario").prop("disabled",true);
    $.ajax({
        url: 'http://localhost:3004/mudarProprietario',
        contentType: 'application/json',
        cache: false,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            address: dados.get('address')
        }),
        success: function(data) {
            console.log(data.registro);
            $("#botaoProprietario").prop("disabled",false);
            proprietarioResposta.innerHTML = `
            <div class="alert alert-primary" role="alert">
                ${data.message}
            </div>
            `
        }, 
        error: function (request, status, error) {
            alert('Erro ao enviar requisição!');
            $("#botaoProprietario").prop("disabled",false);
            proprietarioResposta.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${data.message}
            </div>
            `
        }
    });

});