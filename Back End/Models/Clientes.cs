using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Back_End.Models
{
    [Index(nameof(CPF), Name = "IX_Clientes", IsUnique = true)]
    public partial class Clientes
    {
        [Key]
        public int IDCliente { get; set; }
        [Required]
        [StringLength(128)]
        public string Nome { get; set; }
        [Required]
        [StringLength(128)]
        public string CPF { get; set; }
        [Required]
        [StringLength(128)]
        public string Celular { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DataDoCadastro { get; set; }
    }
}
