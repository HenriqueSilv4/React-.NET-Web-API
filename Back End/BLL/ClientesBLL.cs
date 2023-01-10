using App_Code;
using Back_End.Models;
using CrudEstudo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back_End.BLL
{
    public class ClientesBLL
    {
        private readonly DAO Context = new DAO();

        public Clientes[] Read()
        {
            return Context.Clientes.ToArray();
        }

        public ResponseResult Update(ClientesJSON json)
        {
            var response = new ResponseResult();

            response.Erros = ValidarCampos(json);

            try
            {
                if(response.Erros.Count != 0)
                {
                    throw new Exception();
                }

                var Cliente = Context.Clientes.Find(json.IdCliente);

                Cliente.Nome = json.Nome;

                Cliente.Celular = json.Celular;

                Context.Clientes.Update(Cliente);
               
                Context.SaveChanges();
                
                Context.Dispose();
                
                response.Sucesso = true;
            }
            catch(Exception ex)
            {
                response.Sucesso = false;
            }

            return response;
        }

        public List<ErroJSON> ValidarCampos(ClientesJSON json)
        {
            var Erros = new List<ErroJSON>();

            if(string.IsNullOrEmpty(json.Nome))
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "nome",
                    Mensagem = "O campo está vazio."
                });
            }

            if(json.Nome.Any(char.IsDigit))
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "nome",
                    Mensagem = "O campo não pode conter números."
                });
            }

            if(string.IsNullOrEmpty(json.Celular))
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "celular",
                    Mensagem = "O campo não pode estar vazio."
                });
            }

            if(json.Celular.Any(char.IsLetter))
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "celular",
                    Mensagem = "O campo não pode conter letras."
                });
            }

            if(!Context.Clientes.Any(x=> x.IdCliente.Equals(json.IdCliente)))
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "alerta",
                    Mensagem = "O cadastro desse cliente já foi deletado e não existe mais."
                });
            }

            return Erros;
        }
    }
}