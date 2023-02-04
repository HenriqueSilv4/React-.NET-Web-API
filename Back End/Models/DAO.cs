using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace Back_End.Models
{
    public partial class DAO : DbContext
    {
        public DAO()
        {
        }

        public DAO(DbContextOptions<DAO> options)
            : base(options)
        {
        }

        public virtual DbSet<Clientes> Clientes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=LINEARNOTE255;Initial Catalog=Estudos;Persist Security Info=True;User ID=sa;Password=linear");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Latin1_General_CI_AS");

            modelBuilder.Entity<Clientes>(entity =>
            {
                entity.Property(e => e.CPF).IsUnicode(false);

                entity.Property(e => e.Celular).IsUnicode(false);

                entity.Property(e => e.Nome).IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
