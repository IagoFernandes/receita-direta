const HDWalletProvider = require('truffle-hdwallet-provider');
const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const config = require('./contract.json');
var cors = require('cors');

const provider = new HDWalletProvider(
  (process.env.mnemonic || config.mnemonic),
  (process.env.endpoint || config.endpoint)
);

const web3 = new Web3(provider);
const reschainAddress = config.reschainAddress;
const reschainAbi = config.reschainAbi;
const reschainContract = new web3.eth.Contract(reschainAbi, reschainAddress);
const reschainProprietario = config.walletAddress;

const app = express();
const port = 3004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/recuperarRegistro', async function (req, res) {
  if(req.body.id != ''){
    try {
      const dado = await reschainContract.methods.recuperarRegistro(req.body.id).call();
      return res.send({ registro: dado });  
    } catch (error) {
      return res.send({ message: error.message });
    }
  }else{
    console.log('Existem campos não preenchidos na requisição')
    return res.status(400).send({ message: 'Existem campos não preenchidos na requisição' });
  }
  
  
});

app.post('/incluirRegistro', async function (req, res) {
  console.log(req.body)
  if (req.body.id != ''
    && req.body.receitaId != ''
    && req.body.pacienteId != ''
    && req.body.medicoId != ''
    && req.body.dhc != ''
    && req.body.posologia != ''
  ) {

    try{
      
      console.log(`Status: init blockchain for id: ${req.body.id}`);
      registroBlockchain = await reschainContract.methods.recuperarRegistro(req.body.id).call();

      if (registroBlockchain[0] != "") {
        console.log('Id já utilizado!')
        return res.send({ message: 'Id já utilizado!' });
      }

      var regist = await reschainContract.methods.incluirRegistro(
        req.body.id,
        req.body.receitaId,
        req.body.pacienteId,
        req.body.medicoId,
        req.body.dhc,
        req.body.posologia).send({
        from: reschainProprietario,
        gas: '1000000'
      });
      return res.send({ message: 'Registro adicionado' });
    } catch (error) {
      console.log(error)
      return res.send({ message: error.message });
    }
  }else{
    console.log('Existem campos não preenchidos na requisição')
    return res.status(400).send({ message: 'Existem campos não preenchidos na requisição' });
  }

});


app.post('/mudarProprietario', async function (req, res) {
  if (req.body.address != '') {
    var codigo = await reschainContract.methods.mudarProprietario(req.body.address).send({
      from: reschainProprietario,
      gas: '1000000'
    });
    return res.send({ message: 'Proprietario alterado!' });
  } else {
    return res.status(400).send({ message: 'Existem Campos inválidos' });
  }
});

app.listen(port, () => console.log(`API server running on port ${port}`));
