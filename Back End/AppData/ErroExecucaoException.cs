using System;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;

namespace App_Code
{
    /// <summary>
    /// Summary description for ErroExecucaoException
    /// </summary>
    public class ErroExecucaoException : Exception
    {
        public List<dynamic> ListaErro;

        public ErroExecucaoException(List<SqlError> _ListaErro)
        {
            ListaErro = new List<dynamic>();

            foreach (SqlError item in _ListaErro)
            {
                ListaErro.Add(item.Message);
            }
        }
    }
}