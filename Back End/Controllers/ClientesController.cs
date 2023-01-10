using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using App_Code;
using Back_End.Models;
using Back_End.BLL;

namespace CrudEstudo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly ILogger<ClientesController> _logger;

        public ClientesController(ILogger<ClientesController> logger)
        {
            _logger = logger;
        }

        private ClientesBLL bll = new ClientesBLL();

        [HttpPost]
        [Route("Cadastrar")]
        public ResponseResult Create(ClientesJSON json)
        {
            return bll.Create(json);
        }

        [HttpGet]
        [Route("Selecionar")]
        public Clientes[] Read()
        {
            return bll.Read();
        }

        [HttpPut]
        [Route("Atualizar")]
        public ResponseResult Update(ClientesJSON json)
        {
            return bll.Update(json);
        }

        [HttpDelete]
        [Route("Deletar")]
        public ResponseResult Delete(ClientesJSON json)
        {
            return bll.Delete(json);
        }
    }
}