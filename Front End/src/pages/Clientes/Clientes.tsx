import { PageStatus } from '../../enums/PageStatus'
import { TipoAlerta } from '../../enums/TipoAlerta'
import { useEffect, useState } from 'react'
import { ResponseResult } from '../../interfaces/ResponseResult'
import { Clientes } from '../../interfaces/Clientes'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function PaginaClientes() {

    const [data, setData] = useState<Clientes[]>()

    const [exception, setException] = useState<ResponseResult>()

    const [formCreateData, setFormCreateData] = useState<Clientes>({
        idCliente: '',
        cpf: '',
        nome: '',
        celular: ''
    })

    const [formUpdateData, setFormUpdateData] = useState<Clientes>({
        idCliente: '',
        cpf: '',
        nome: '',
        celular: ''
    })

    const [isFetching, setIsFetching] = useState(true)

    const [status, setPageStatus] = useState<PageStatus>()

    function Alerta(mensagem: string, Tipo: TipoAlerta) 
    {
        if (Tipo === TipoAlerta.SUCESSO)
            return (
                toast.success(mensagem, {
                    toastId: 1
                })
            )
        if (Tipo === TipoAlerta.ERRO) {
            return (
                toast.error(mensagem)
            )
        }
        if (Tipo === TipoAlerta.AVISO) {
            return (
                toast.warning(mensagem, {
                    toastId: 2
                })
            )
        }
    }

    function checarErrosCampo(campo: string) 
    {
        const Erro = exception?.erros.find((x) => x.campo == campo)

        const Campo = document.getElementById(campo)

        if (Erro !== undefined) 
        {
            Campo?.classList.add('is-invalid')
        }
        else
        {
            Campo?.classList.remove('is-invalid')
        }
        
        return (
            <div className='invalid-feedback'>
                {Erro?.mensagem}
            </div>
        )
    }
    
    function alimentarFormCreate(e: React.ChangeEvent<HTMLInputElement>) 
    {

        const { value, name } = e.target

        setFormCreateData((prevState) => ({
            ...prevState,
            [name]: value,
        }))

    }

    function alimentarFormUpdate(e: React.ChangeEvent<HTMLInputElement>) 
    {

        const { value, name } = e.target

        setFormUpdateData((prevState) => ({
            ...prevState,
            [name]: value,
        }))

    }

    function createData(e: React.FormEvent<HTMLFormElement>) 
    {

        e.preventDefault()

        axios.post<ResponseResult>('https://localhost:44398/api/Cliente/Cadastrar', formCreateData)
            .then(response => 
            {
                setException(response.data)
                if (response.data !== undefined) 
                {
                    if (response.data.sucesso === true) 
                    {
                        readData()
                        setPageStatus(PageStatus.INDEX)
                        Alerta('Cadastro criado com sucesso.', TipoAlerta.SUCESSO)
                    }
                }
            })
    }

    function readData() 
    {
        return (
            axios.get<Clientes[]>('https://localhost:44398/api/Cliente/Selecionar')
                .then(response => {
                    setIsFetching(false)
                    setData(response.data)
                })
                .finally(() => {
                    setPageStatus(PageStatus.INDEX)
                })
        )
    }

    function updateData(e: React.FormEvent<HTMLFormElement>) 
    {

        e.preventDefault()

        axios.put<ResponseResult>('https://localhost:44398/api/Cliente/Atualizar', formUpdateData)
            .then(response => 
            {
                setException(response.data)
                if(response.data !== undefined)
                {
                    if (response.data.sucesso === true) 
                    {
                        setPageStatus(PageStatus.INDEX)
                        Alerta('Registro atualizado com sucesso.', TipoAlerta.SUCESSO)
                    }
                }
            })
    }

    function deleteData(e: React.FormEvent<HTMLFormElement>) 
    {

        e.preventDefault()

        axios.delete<ResponseResult>('https://localhost:44398/api/Cliente/Deletar', { data: formUpdateData })
            .then(response => {
                setException(response.data)
                if (response.data.sucesso === true) {
                    setPageStatus(PageStatus.INDEX)
                    Alerta('Registro deletado com sucesso.', TipoAlerta.SUCESSO)
                }
                else {

                }
            })
    }

    useEffect(() => {
        readData()
    }, [])

    if (status === PageStatus.INDEX && !isFetching) 
    {
        return (
            <div className='container-fluid mt-2'>

                <ToastContainer
                    position='bottom-right'
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeButton={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                    theme='light'
                />
                
                <div className='d-flex justify-content-between'>

                    <h4>
                        Lista de Clientes
                    </h4>

                    <button onClick={() => setPageStatus(PageStatus.NEW)} className='btn btn-success p-2'>
                        Cadastrar
                    </button>

                </div>

                <table className='table table-striped table-hover mt-1'>
                    <caption>
                        Nº de Registros: {data?.length}
                    </caption>
                    <thead>
                        <tr>
                            <th scope='col'>Nome</th>
                            <th scope='col'>CPF</th>
                            <th scope='col'>Celular</th>
                            <th scope='col'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map(x =>
                                <tr key={x.idCliente}>
                                    <td className='align-middle'>{x.nome}</td>
                                    <td className='align-middle'>{x.cpf}</td>
                                    <td className='align-middle'>{x.celular}</td>
                                    <td><button className='btn btn-primary' onClick={() => { setPageStatus(PageStatus.EDIT); setFormUpdateData(x); }} value={x.idCliente}>Editar</button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    if (status === PageStatus.NEW) 
    {
        return (
            <div className='container-fluid mt-2'>

                <ToastContainer
                    position='bottom-right'
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeButton={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                    theme='light'
                />

                <div className='d-flex justify-content-between'>
                    <h4>
                        Cadastrar Cliente
                    </h4>
                    <button onClick={() => setPageStatus(PageStatus.INDEX)} className='btn btn-primary p-2'>
                        Voltar
                    </button>
                </div>

                <div className='shadow-lg rounded w-50 mx-auto mt-5'>
                    <form onSubmit={createData} className='d-grid gap-3 p-5'>
                        <div className='form-floating'>
                            <input onChange={alimentarFormCreate} value={formCreateData.cpf} type='text' placeholder='#' maxLength={11} autoComplete={'off'} className='form-control' id='cpf' name='cpf' />
                            <label htmlFor='cpf' className='text-dark'>CPF</label>
                            {checarErrosCampo('cpf')}
                        </div>
                        <div className='form-floating'>
                            <input onChange={alimentarFormCreate} value={formCreateData.nome} type='text' placeholder='#' maxLength={128} autoComplete={'off'} className='form-control' id='nome' name='nome' />
                            <label htmlFor='nome' className='text-dark'>Nome</label>
                            {checarErrosCampo('nome')}
                        </div>
                        <div className='form-floating'>
                            <input onChange={alimentarFormCreate} value={formCreateData.celular} type='text' placeholder='#' maxLength={32} autoComplete={'off'} className='form-control' id='celular' name='celular' />
                            <label htmlFor='celular' className='text-dark'>Celular</label>
                            {checarErrosCampo('celular')}
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type='submit' className='btn btn-success w-25'>Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    if (status === PageStatus.EDIT) 
    {
        return (
            <div className='container-fluid mt-2'>

                <ToastContainer
                    position='bottom-right'
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeButton={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                    theme='light'
                />

                <div className='d-flex justify-content-between'>
                    <h4>
                        Editar Cliente
                    </h4>
                    <button onClick={() => setPageStatus(PageStatus.INDEX)} className='btn btn-primary p-2'>
                        Voltar
                    </button>
                </div>
                                
                <form onSubmit={deleteData}>
                    <div className='float-end mt-2'>
                        <button type='submit' className='btn btn-danger'>Deletar</button>
                    </div>
                </form>

                <div className='shadow-lg rounded w-50 mx-auto mt-5'>

                    <form onSubmit={updateData} className='d-grid gap-3 p-5'>
                        <div className='form-floating'>
                            <input onChange={alimentarFormUpdate} value={formUpdateData?.cpf} type='text' disabled placeholder='#' maxLength={11} autoComplete={'off'} className='form-control' id='cpf' name='cpf' />
                            <label htmlFor='cpf' className='text-dark'>CPF</label>
                        </div>
                        <div className='form-floating'>
                            <input onChange={alimentarFormUpdate} value={formUpdateData?.nome} type='text' placeholder='#' maxLength={128} autoComplete={'off'} className='form-control' id='nome' name='nome' />
                            <label htmlFor='nome' className='text-dark'>Nome</label>
                            {checarErrosCampo('nome')}
                        </div>
                        <div className='form-floating'>
                            <input onChange={alimentarFormUpdate} value={formUpdateData?.celular} type='text' placeholder='#' maxLength={32} autoComplete={'off'} className='form-control' id='celular' name='celular' />
                            <label htmlFor='celular' className='text-dark'>Celular</label>
                            {checarErrosCampo('celular')}
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type='submit' className='btn btn-primary'>Salvar</button>
                        </div>
                    </form>
                </div>

            </div>
        )
    }

    return (
        <div className='mt-5'>
            <h4>Carregando página...</h4>
        </div>
    )
}