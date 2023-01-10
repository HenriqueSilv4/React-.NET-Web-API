using System;
using System.Collections.Generic;

#nullable disable

namespace Back_End.Models
{
    public partial class Clientes
    {
        public int IdCliente { get; set; }
        public string CPF { get; set; }
        public string Nome { get; set; }
        public string Celular { get; set; }
        public DateTime DataDoCadastro { get; set; }
    }
}
