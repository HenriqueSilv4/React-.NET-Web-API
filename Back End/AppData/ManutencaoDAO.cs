using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Collections;

namespace App_Code
{ 
    public static class IsNullOrEmptyExtension
    {
        public static bool IsNullOrEmpty(this IEnumerable source)
        {
            if (source != null)
            {
                foreach (object obj in source)
                {
                    return false;
                }
            }
            return true;
        }

        public static bool IsNullOrEmpty<T>(this IEnumerable<T> source)
        {
            if (source != null)
            {
                foreach (T obj in source)
                {
                    return false;
                }
            }
            return true;
        }
    }

    /// <summary>
    /// Monta automaticamente o comando para execucao da stored procedure
    /// </summary>
    public class ManutencaoDAO : BaseDAO
    {
        //Executa uma procedure sem retorno
        public void ExecutarProcedure(string procedure, Dictionary<string, object> parametros)
        {
            Executar(procedure, parametros);
        }

        //Efetua uma consulta retornando um DataTable
        public DataTable ExecutarProcedureDT(string procedure, Dictionary<string, object> parametros)
        {
            return ExecutarDT(procedure, parametros);
        }

        /// <summary>
        /// Retorna o nome da procedure referente à ação
        /// </summary>
        /// 
        public void Executar(string procedure, Dictionary<string, object> parametros)
        {
            //Lista usada para gerenciar os erros de execução
            List<SqlError> erros = null;

            try
            {
                // cria um novo comando
                NovoCmmd(procedure);

                //seta a configuração para disparar um evento, quando acontecer um erro de baixa relevância na procedure
                Conn.FireInfoMessageEventOnUserErrors = true;

                //função lambda para tratar cada erro disparado pela procedure
                Conn.InfoMessage += new SqlInfoMessageEventHandler((object sender, SqlInfoMessageEventArgs e) =>
                {
                    //se a lista não estiver instanciada
                    if (erros == null)
                    {
                        //instância uma nova lista
                        erros = new List<SqlError>();
                    }

                    foreach (SqlError error in e.Errors)
                    {
                        // adiciona os erros na lista
                        erros.Add(error);
                    }
                });

                Dictionary<string, string> values = new Dictionary<string, string>();

                foreach (KeyValuePair<string, object> p in parametros)
                {
                    Cmmd.Parameters.AddWithValue(p.Key, p.Value);
                }

                AbreConexao();

                Cmmd.ExecuteNonQuery();

                // verifica se aconteceu algum erro
                if (erros != null)
                {
                    throw new ErroExecucaoException(erros);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            finally
            {
                DescartaComando();
                FechaConexao();
                DescartaConexao();
            }
        }

        public DataTable ExecutarDT(string procedure, Dictionary<string, object> parametros)
        {
            DataTable dt = null;
            SqlDataReader dr = null;

            try
            {
                NovoCmmd(procedure);

                foreach (KeyValuePair<string, object> p in parametros)
                {
                    Cmmd.Parameters.AddWithValue(p.Key, p.Value);
                }

                AbreConexao();

                dr = Cmmd.ExecuteReader();

                dt = new DataTable();
                dt.BeginLoadData();
                dt.Load(dr);
                dt.EndLoadData();
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }

                DescartaComando();
                FechaConexao();
            }

            return dt;
        }

        public DataSet ExecutarDS(string procedure, Dictionary<string, object> parametros)
        {
            SqlDataAdapter da = null;
            DataSet ds = null;

            try
            {
                NovoCmmd(procedure);

                foreach (KeyValuePair<string, object> p in parametros)
                {
                    Cmmd.Parameters.AddWithValue(p.Key, p.Value);
                }

                AbreConexao();
                da = new SqlDataAdapter(Cmmd);
                ds = new DataSet();
                da.Fill(ds);
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            finally
            {
                if (da != null)
                {
                    da.Dispose();
                }

                DescartaComando();
                FechaConexao();
                DescartaConexao();
            }

            return ds;
        }

        public T ExecutarProcedure<T>(string procedure, Dictionary<string, object> parametros)
        {
            return ExecutarProcedureList<T>(procedure, parametros).FirstOrDefault();
        }

        public List<T> ExecutarProcedureList<T>(string procedure, Dictionary<string, object> parametros)
        {
            return GetLista<T>(procedure, parametros);
        }

        public int GetColumnOrdinal(SqlDataReader dr, string columnName)
        {
            int ordinal = -1;

            for (int i = 0; i < dr.FieldCount; i++)
            {
                if (string.Equals(dr.GetName(i), columnName, StringComparison.OrdinalIgnoreCase))
                {
                    ordinal = i;
                    break;
                }
            }

            return ordinal;
        }

        public List<T> CriaLista<T>(SqlDataReader dr)
        {
            List<T> list = new List<T>();

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    var item = Activator.CreateInstance<T>();
                    foreach (var property in typeof(T).GetProperties())
                    {
                        string nomecoluna;

                        if (property.GetCustomAttribute<ColumnAttribute>() != null)
                        {
                            nomecoluna = property.GetCustomAttribute<ColumnAttribute>().Name;
                        }
                        else
                        {
                            nomecoluna = property.Name;
                        }

                        int i = GetColumnOrdinal(dr, nomecoluna);

                        // se não achar a coluna no datareader, continua o laço
                        if (i < 0) continue;

                        // se for DBNull, continua o laço
                        if (dr[nomecoluna] == DBNull.Value) continue;

                        if (property.PropertyType.IsEnum)
                        {
                            property.SetValue(item, Enum.Parse(property.PropertyType, dr[nomecoluna].ToString()));
                        }
                        else
                        {
                            Type convertTo = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType;
                            property.SetValue(item, Convert.ChangeType(dr[nomecoluna], convertTo), null);
                        }
                    }
                    list.Add(item);
                }
            }
            return list;
        }

        public List<T> GetLista<T>(string procedure, Dictionary<string, object> parametros)
        {
            List<T> list = null;
            SqlDataReader dr = null;

            //Lista usada para gerenciar os erros de execução
            List<SqlError> ListaErro = null;

            try
            {
                NovoCmmd(procedure);

                if (parametros != null)
                {
                    foreach (KeyValuePair<string, object> p in parametros)
                    {
                        Cmmd.Parameters.AddWithValue(p.Key, p.Value);
                    }
                }

                //seta a configuração para disparar um evento, quando acontecer um erro de baixa relevância na procedure
                Conn.FireInfoMessageEventOnUserErrors = true;

                //função lambda para tratar cada erro disparado pela procedure
                Conn.InfoMessage += new SqlInfoMessageEventHandler((object sender, SqlInfoMessageEventArgs e) =>
                {
                    //se a lista não estiver instanciada
                    if (ListaErro == null)
                    {
                        //instância uma nova lista
                        ListaErro = new List<SqlError>();
                    }

                    foreach (SqlError error in e.Errors)
                    {
                        // adiciona os erros na lista
                        ListaErro.Add(error);
                    }
                });

                AbreConexao();

                dr = Cmmd.ExecuteReader();

                // verifica se aconteceu algum erro
                if (ListaErro != null)
                {
                    throw new ErroExecucaoException(ListaErro);
                }

                list = CriaLista<T>(dr);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // Liberar memória DataReader
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }

                DescartaComando();
                FechaConexao();
                DescartaConexao();
            }

            return list;
        }
    }
}