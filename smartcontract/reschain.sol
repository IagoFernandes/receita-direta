pragma solidity ^0.5.1;

contract reschain {

    address public proprietario;    
    
    struct Dados{
        string receitaId;
        string medicoId;
        string pacienteId;
        string dhc;
        string posologia_id;
    }
    
    mapping (string => Dados) private Registros;     
    
    constructor() public {
        proprietario = msg.sender;
    }
    
    function incluirRegistro(string memory _codigo, string memory _receitaId, string memory _pacienteId, string memory _medicoId, string memory _dhc, string memory _posologiaId) public returns (string memory) {
        require(msg.sender == proprietario, "Error: apenas o proprietario do contrato pode executar essa função");
        Registros[_codigo] = Dados(_receitaId, _medicoId, _pacienteId, _dhc, _posologiaId);
        return "SUCESSO: Registro Incluído!";
    }
    
    function recuperarRegistro(string memory _codigo) public view returns ( string memory, string memory, string memory, string memory, string memory) {
        return (Registros[_codigo].receitaId, Registros[_codigo].medicoId, Registros[_codigo].pacienteId, Registros[_codigo].dhc, Registros[_codigo].posologia_id);
    }
    
    function mudarProprietario(address novoProprietario) public returns (string memory) {
        if (msg.sender != proprietario) return "ERRO: Somente o proprietário pode executar essa função!";
        proprietario = novoProprietario;
        return "SUCESSO: Proprietário alterado!";
    }
}
