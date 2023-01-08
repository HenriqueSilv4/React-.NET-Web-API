using CrudEstudo;
using System.Collections.Generic;

namespace App_Code
{
    public class ResponseResult
    {
        public bool Sucesso { get; set; }
        public List<ErroJSON> Erros { get; set; } = new();
    }   
}