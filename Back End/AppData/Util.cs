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
    public class Util
    {
        
        public static string ChecaNulo(string Campo)
        {
            if (string.IsNullOrEmpty(Campo))
            {
                return null;
            }
            else
            {
                return Campo.Trim();
            }
        }

        /* Caracteres para montagem de data e hora
           dd - dia
           MM - M�s
           yyyy - Ano
           HH - Hora
           mm - Minuto
           ss - segundos
           ver refer�ncia da func�o String.Format para outros poss�veis formatos
           */
        public static string FormataData(string qData, string formato)
        {
            DateTime Data;
            string data_str = "";
            string p_formato = "{0:" + formato + "}";

            try
            {
                Data = DateTime.Parse(qData);
                data_str = String.Format(p_formato, Data);
            }
            catch { }
            return data_str;
        }

        public static string RetornaMesExtenso(string Mes)
        {
            if (Mes.Length < 2)
            {
                Mes = "0" + Mes;
            }

            string MesExtenso = Mes switch
            {
                "01" => "Janeiro",
                "02" => "Fevereiro",
                "03" => "Março",
                "04" => "Abril",
                "05" => "Maio",
                "06" => "Junho",
                "07" => "Julho",
                "08" => "Agosto",
                "09" => "Setembro",
                "10" => "Outubro",
                "11" => "Novembro",
                "12" => "Dezembro",
                _ => "",
            };
            return MesExtenso;
        }

        public static string FormatarData(string str, int style)
        {
            if (!string.IsNullOrEmpty(str))
            {
                if (DateTime.TryParse(str, out DateTime dt))
                {
                    return FormatarData(dt, style);
                }
            }

            return string.Empty;
        }

        public static string FormatarData(DateTime dt, int style)
        {
            switch (style)
            {
                case 120:
                    return dt.ToString("yyyy-MM-dd HH:mm:ss");

                case 126:
                    return dt.ToString("yyyy-MM-ddTHH:mm:ss");

                case 103:
                    return dt.ToString("dd/MM/yyyy");

                case 23:
                    return dt.ToString("yyyy-MM-dd");

                case 108:
                    return dt.ToString("HH:mm:ss");

                case 200:
                    return dt.ToString("dd/MM/yyyy HH:mm:ss");

                case 201:
                    return dt.ToString("dd/MM/yyyy") + " às " + dt.ToString("HH:mm:ss");

                default:
                    break;
            }

            return string.Empty;
        }
    }
}