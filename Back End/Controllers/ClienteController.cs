using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Newtonsoft.Json;
using App_Code;

namespace CrudEstudo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {
        private readonly ILogger<ClienteController> _logger;

        public ClienteController(ILogger<ClienteController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Route("Cadastrar")]
        public ResponseResult Create(ClienteJSON json)
        {
            var response = new ResponseResult();
            try
            {
                Dictionary<string, object> parametros = new Dictionary<string, object>();
                parametros.Add("@CPF", json.CPF);
                parametros.Add("@Nome", json.Nome);
                parametros.Add("@Celular", json.Celular);
                new ManutencaoDAO().ExecutarProcedure("Clientes_Cadastrar", parametros);
                response.Sucesso = true;
            }
            catch(ErroExecucaoException e)
            {
                response.Sucesso = false;

                ExceptionProcedure _Exception = JsonConvert.DeserializeObject<ExceptionProcedure>(e.ListaErro[0]);

                response.Erros = _Exception.ExceptionStack;
            }
            return response;
        }

        [HttpGet]
        [Route("Selecionar")]
        public List<ClienteJSON> Read()
        {
            return new ManutencaoDAO().ExecutarProcedureList<ClienteJSON>("Clientes_Selecionar", null);
        }

        [HttpPut]
        [Route("Atualizar")]
        public ResponseResult Update(ClienteJSON json)
        {
            var response = new ResponseResult();
            try
            {
                Dictionary<string, object> parametros = new Dictionary<string, object>();
                parametros.Add("@IDCliente", json.IDCliente);
                parametros.Add("@Nome", json.Nome);
                parametros.Add("@Celular", json.Celular);
                new ManutencaoDAO().ExecutarProcedure("Clientes_Atualizar", parametros);
                response.Sucesso = true;
            }
            catch(ErroExecucaoException e)
            {
                response.Sucesso = false;

                ExceptionProcedure _Exception = JsonConvert.DeserializeObject<ExceptionProcedure>(e.ListaErro[0]);

                response.Erros = _Exception.ExceptionStack;
            }
            return response;
        }

        [HttpDelete]
        [Route("Deletar")]
        public ResponseResult Delete(ClienteJSON json)
        {
            var response = new ResponseResult();
            try
            {
                Dictionary<string, object> parametros = new Dictionary<string, object>();
                parametros.Add("@IDCliente", json.IDCliente);
                new ManutencaoDAO().ExecutarProcedure("Clientes_Deletar", parametros);
                response.Sucesso = true;
            }
            catch(ErroExecucaoException e)
            {
                response.Sucesso = false;

                ExceptionProcedure _Exception = JsonConvert.DeserializeObject<ExceptionProcedure>(e.ListaErro[0]);

                response.Erros = _Exception.ExceptionStack;
            }
            return response;
        }
    }
}