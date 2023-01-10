﻿using App_Code;
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
        public ResponseResult Create(ClientesJSON json)
        {
            var response = new ResponseResult();

            response.Erros = ValidarCampos(json);

            try
            {
                if(response.Erros.Count != 0)
                {
                    throw new Exception();
                }

                if(Context.Clientes.Any(x => x.CPF.Equals(json.CPF)))
                {
                    response.Erros.Add(new ErroJSON
                    {
                        Campo = "alerta",
                        Mensagem = "Não foi possível realizar o cadastro.\nO CPF informado já está cadastrado no sistema."
                    });

                    throw new Exception();
                }

                var Cliente = new Clientes();

                Cliente.CPF = json.CPF;

                Cliente.Nome = json.Nome;

                Cliente.Celular = json.Celular;

                Cliente.DataDoCadastro = DateTime.Now.Date;

                Context.Clientes.Add(Cliente);
               
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

                if(!Context.Clientes.Any(x => x.IdCliente.Equals(json.IdCliente)))
                {
                    response.Erros.Add(new ErroJSON
                    {
                        Campo = "alerta",
                        Mensagem = "O cadastro desse cliente já foi deletado e não existe mais."
                    });
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

        public ResponseResult Delete(ClientesJSON json)
        {
            var response = new ResponseResult();

            try
            {

                if(!Context.Clientes.Any(x => x.IdCliente.Equals(json.IdCliente)))
                {
                    response.Erros.Add(new ErroJSON
                    {
                        Campo = "alerta",
                        Mensagem = "O cadastro desse cliente já foi deletado e não existe mais."
                    });
                }

                var Cliente = Context.Clientes.Find(json.IdCliente);

                Context.Clientes.Remove(Cliente);
               
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

            if(string.IsNullOrEmpty(json.CPF) || string.IsNullOrWhiteSpace(json.CPF))
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "cpf",
                    Mensagem = "O campo não pode estar vazio."
                });
            }

            if(json.CPF.Any(char.IsLetter))
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "cpf",
                    Mensagem = "O campo não pode conter letras."
                });
            }

            if(json.CPF.Length != 11)
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "cpf",
                    Mensagem = "Digite todos os 11 caracteres para validar o CPF."
                });
            }

            if(string.IsNullOrEmpty(json.Nome) || string.IsNullOrWhiteSpace(json.Nome))
            {
                Erros.Add(new ErroJSON
                {
                    Campo = "nome",
                    Mensagem = "O campo não pode estar vazio."
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

            if(string.IsNullOrEmpty(json.Celular) || string.IsNullOrWhiteSpace(json.Celular))
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

            return Erros;
        }
    }
}