import { PageStatus } from '../../enums/PageStatus'
import { TipoAlerta } from '../../enums/TipoAlerta'
import { useEffect, useRef, useState } from 'react'
import { ResponseResult } from '../../interfaces/ResponseResult'
import { Clientes } from '../../interfaces/Clientes'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button, Input, InputRef, Space, Table } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { title } from 'process'

export default function PaginaClientes() {

    const [data, setData] = useState<Clientes[]>()
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };

    type DataIndex = keyof Clientes;

    const filtrarResultado = (dataIndex: DataIndex): ColumnType<Clientes> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Resetar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                        }}
                    >
                        Filtrar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const colunas: ColumnsType<Clientes> = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            ...filtrarResultado('nome'),
            width: '25%'
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            ...filtrarResultado('cpf'),
            width: '25%'
        },
        {
            title: 'Celular',
            dataIndex: 'celular',
            ...filtrarResultado('celular'),
            width: '25%'
        },
        {
            title: 'Data do Cadastro',
            dataIndex: 'dataDoCadastro',
            width: '25%'
        },
    ];

    const [exception, setException] = useState<ResponseResult>()

    const [formCreateData, setFormCreateData] = useState<Clientes>({
        idCliente: '0',
        cpf: '',
        nome: '',
        celular: '',
        dataDoCadastro: ''
    })

    const [formUpdateData, setFormUpdateData] = useState<Clientes>({
        idCliente: '',
        cpf: '',
        nome: '',
        celular: '',
        dataDoCadastro: ''
    })

    const [isFetching, setIsFetching] = useState(true)

    const [status, setPageStatus] = useState<PageStatus>()

    function Alerta(mensagem: string, Tipo: TipoAlerta) {
        switch (Tipo) {
            case TipoAlerta.SUCESSO: {
                return (
                    toast.success(mensagem)
                )
            }
            case TipoAlerta.ERRO: {
                return (
                    toast.error(mensagem)
                )
            }
            case TipoAlerta.AVISO: {
                return (
                    toast.warning(mensagem)
                )
            }
        }
    }

    function validarCampo(campo: string) {
        const listaErros = exception?.erros.filter((x) => x.campo === campo).map(item =>
            <div className='invalid-feedback'>
                {item.mensagem}
            </div>
        )

        const Campo = document.getElementById(campo)

        if (listaErros !== undefined && listaErros?.length > 0) {
            Campo?.classList.add('is-invalid')
        }
        else {
            Campo?.classList.remove('is-invalid')
        }

        return listaErros
    }

    function alimentarFormCreate(e: React.ChangeEvent<HTMLInputElement>) {

        const { value, name } = e.target

        setFormCreateData((prevState) => ({
            ...prevState,
            [name]: value,
        }))

    }

    function alimentarFormUpdate(e: React.ChangeEvent<HTMLInputElement>) {

        const { value, name } = e.target

        setFormUpdateData((prevState) => ({
            ...prevState,
            [name]: value,
        }))

    }

    function createData(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault()

        axios.post<ResponseResult>('https://localhost:44398/api/Clientes/Cadastrar', formCreateData)
            .then(response => {
                setException(response.data)
                if (response.data !== undefined) {
                    if (response.data.sucesso === true) {
                        readData()
                        setPageStatus(PageStatus.INDEX)
                        Alerta('Cadastro criado com sucesso.', TipoAlerta.SUCESSO)
                    }
                }
            })
    }

    function readData() {
        return (
            axios.get<Clientes[]>('https://localhost:44398/api/Clientes/Selecionar')
                .then(response => {
                    setIsFetching(false)
                    setData(response.data)
                })
                .finally(() => {
                    setPageStatus(PageStatus.INDEX)
                })
        )
    }

    function updateData(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault()

        axios.put<ResponseResult>('https://localhost:44398/api/Clientes/Atualizar', formUpdateData)
            .then(response => {
                setException(response.data)
                if (response.data !== undefined) {
                    if (response.data.sucesso === true) {
                        readData()
                        setPageStatus(PageStatus.INDEX)
                        Alerta('Registro atualizado com sucesso.', TipoAlerta.SUCESSO)
                    }
                }
            })
    }

    function deleteData(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault()

        axios.delete<ResponseResult>('https://localhost:44398/api/Clientes/Deletar', { data: formUpdateData })
            .then(response => {
                setException(response.data)
                if (response.data.sucesso === true) {
                    readData()
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

    if (status === PageStatus.INDEX && !isFetching) {
        return (
            <div className='container-fluid mt-2'>

                <div className='d-flex justify-content-between'>

                    <button onClick={() => setPageStatus(PageStatus.NEW)} className='btn btn-success p-2'>
                        Cadastrar
                    </button>

                </div>

                <Table columns={colunas} dataSource={data} />

            </div>
        )
    }

    if (status === PageStatus.NEW) {
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
                            <input onChange={alimentarFormCreate} value={formCreateData.cpf} type='text' placeholder='#' minLength={11} maxLength={11} autoComplete={'off'} className='form-control' id='cpf' name='cpf' />
                            <label htmlFor='cpf' className='text-dark'>CPF</label>
                            {validarCampo('cpf')}
                        </div>
                        <div className='form-floating'>
                            <input onChange={alimentarFormCreate} value={formCreateData.nome} type='text' placeholder='#' maxLength={128} autoComplete={'off'} className='form-control' id='nome' name='nome' />
                            <label htmlFor='nome' className='text-dark'>Nome</label>
                            {validarCampo('nome')}
                        </div>
                        <div className='form-floating'>
                            <input onChange={alimentarFormCreate} value={formCreateData.celular} type='text' placeholder='#' maxLength={32} autoComplete={'off'} className='form-control' id='celular' name='celular' />
                            <label htmlFor='celular' className='text-dark'>Celular</label>
                            {validarCampo('celular')}
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type='submit' className='btn btn-success w-25'>Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    if (status === PageStatus.EDIT) {
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
                            {validarCampo('nome')}
                        </div>
                        <div className='form-floating'>
                            <input onChange={alimentarFormUpdate} value={formUpdateData?.celular} type='text' placeholder='#' maxLength={32} autoComplete={'off'} className='form-control' id='celular' name='celular' />
                            <label htmlFor='celular' className='text-dark'>Celular</label>
                            {validarCampo('celular')}
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