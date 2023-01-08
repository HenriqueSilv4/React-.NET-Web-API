using System.Data;
using Microsoft.Data.SqlClient;

namespace App_Code
{
    /// <summary>
    /// Executa e faz a comunicação com o banco
    /// </summary>
    public class BaseDAO
    {
        // Objeto de Conexão com o banco de dados
        public SqlConnection Conn = null;

        // Comando para utilizacao por quem herdar
        public SqlCommand Cmmd = null;

        public BaseDAO()
        {
            SetConn();
        }

        /// <summary>
        /// Construtor do Comando
        /// </summary>
        public void NovoCmmd(string NomeProcedure)
        {
            if (!string.IsNullOrEmpty(NomeProcedure) && NomeProcedure.IndexOf("dbo.") != 0)
                NomeProcedure = "dbo." + NomeProcedure;

            Cmmd = new SqlCommand(NomeProcedure, Conn)
            {
                CommandType = CommandType.StoredProcedure,
                CommandTimeout = 60
            };
        }

        private void SetConn()
        {
            // String de conexão com o banco de dados
            Conn = new SqlConnection("Server=LINEARNOTE255\\SQLEXPRESS;Database=Estudos;User Id=sa;Password=sa; TrustServerCertificate=True; Trusted_Connection=True;");
        }

        /// <summary>
        /// Abre a conexão com banco
        /// </summary>
        public void AbreConexao()
        {
            if (Conn.State == ConnectionState.Closed)
            {
                Conn.Open();
            }
        }

        /// <summary>
        /// Fecha a conexão
        /// </summary>
        public void FechaConexao()
        {
            if (Conn.State == ConnectionState.Open)
            {
                Conn.Close();
            }
        }

        /// <summary>
        /// Descartar comando
        /// </summary>
        public void DescartaComando()
        {
            Cmmd.Dispose();
        }

        /// <summary>
        /// Descartar comando
        /// </summary>
        public void DescartaConexao()
        {
            Conn.Dispose();
        }
    }
}