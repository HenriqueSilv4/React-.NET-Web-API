import { useEffect, useState } from 'react'
import { ResponseResult } from '../../interfaces/ResponseResult'
import { Clientes } from '../../interfaces/Clientes'
import axios from 'axios'
import { Button, Input, Space, Table, Modal, Form, notification, Popconfirm, Row, Col } from 'antd'
import { ColumnsType, ColumnType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { FilterConfirmProps } from 'antd/es/table/interface'
import React from 'react'

interface DadosForm {
    name: string | number | (string | number)[]
    value?: any
    validating?: boolean
    errors?: string[]
}

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export default function PaginaClientes() {

    type DataIndex = keyof Clientes;

    const [formEditar] = Form.useForm()
    const [modalEditar, setModalEditarAberto] = useState(false)

    const [formCadastro] = Form.useForm()
    const [modalCadastro, setModalCadastroAberto] = useState(false)

    const [toaster, Notificacoes] = notification.useNotification()

    const [listaClientes, setListaClientes] = useState<Clientes[]>()

    const Alerta = (mensagem: string, descricao: string, type: NotificationType) => {
        toaster[type]({
            message: mensagem,
            description: descricao,
            duration: 2.0,
            key: 'feedback'
        })
    }

    const filtrarPesquisa = (confirm: (param?: FilterConfirmProps) => void) => {
        confirm()
    }

    const filtrarResultado = (dataIndex: DataIndex): ColumnType<Clientes> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => filtrarPesquisa(confirm)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => filtrarPesquisa(confirm)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => {
                            setSelectedKeys([])
                            confirm({ closeDropdown: true })
                        }}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Limpar
                    </Button>
                    <Button
                        type='link'
                        size='small'
                        onClick={() => {
                            close();
                        }}
                    >
                        Fechar
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
    });

    const colunasCliente: ColumnsType<Clientes> = [
        {
            title: null,
            dataIndex: 'editar',
            width: '10%',
            render: (_, record) =>
                <span style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <a onClick={() => {
                        setModalEditarAberto(true)
                        formEditar.setFieldsValue(record)
                    }}
                    >
                        <EditOutlined />
                    </a>
                    <a>
                        <Popconfirm
                            title='Aviso'
                            description='Deseja deletar esse registro ?'
                            onConfirm={() => deletarCliente(record)}
                            okText='Sim'
                            cancelText='Não'
                        >
                            <DeleteOutlined />
                        </Popconfirm>
                    </a>
                </span>
        },
        {
            title: 'Nome',
            dataIndex: 'nome',
            ...filtrarResultado('nome'),
            width: '20%'
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            ...filtrarResultado('cpf'),
            width: '20%'
        },
        {
            title: 'Celular',
            dataIndex: 'celular',
            ...filtrarResultado('celular'),
            width: '20%'
        },
        {
            title: 'Data do Cadastro',
            dataIndex: 'dataDoCadastro',
            width: '20%'
        },
    ];

    const cadastrarCliente = (values: any) => {
        axios.post<ResponseResult>('https://localhost:44398/api/Clientes/Cadastrar', values).then(response => {
            if (response.data !== undefined) {
                if (response.data.sucesso === true) {
                    setModalCadastroAberto(false)
                    formCadastro.resetFields()
                    Alerta('Sucesso', 'Cadastro criado com sucesso.', 'success')
                    carregarClientes()
                }
                else {

                    Alerta('Erro', 'Não foi possível realizar o cadastro.', 'error')

                    let listaErros: DadosForm[] = [];

                    response.data.erros.map((e) => {
                        listaErros.push({ name: e.campo, value: e.valor, validating: true, errors: [e.mensagem] })
                    })

                    formCadastro.setFields(listaErros)
                }
            }
        })
    }

    const carregarClientes = () => {
        return (
            axios.get<Clientes[]>('https://localhost:44398/api/Clientes/Selecionar').then(response => {
                response.data.map(x => x.key = x.idCliente)
                setListaClientes(response.data)
            })
        )
    }

    const editarCliente = (values: any) => {
        axios.put<ResponseResult>('https://localhost:44398/api/Clientes/Atualizar', values).then(response => {
            if (response.data !== undefined) {
                if (response.data.sucesso === true) {
                    Alerta('Sucesso', 'Cadastro criado com sucesso.', 'success')
                    formEditar.resetFields()
                    setModalEditarAberto(false)
                    carregarClientes()
                }
                else {
                    Alerta('Erro', 'Não foi possível realizar o cadastro.', 'error')

                    let listaErros: DadosForm[] = [];

                    response.data.erros.map((e) => {
                        listaErros.push({ name: e.campo, value: e.valor, validating: true, errors: [e.mensagem] })
                    })

                    formEditar.setFields(listaErros)
                }
            }
        })
    }

    const deletarCliente = (values: any) => {
        axios.delete<ResponseResult>('https://localhost:44398/api/Clientes/Deletar', { data: values }).then(response => {
            if (response.data.sucesso === true) {
                carregarClientes()
                Alerta('Sucesso', 'Registro deletado com sucesso.', 'success')
            }
            else {

            }
        })
    }

    useEffect(() => {
        carregarClientes()
    }, [])

    return (
        <Row>
            <Col span={24}>
                {Notificacoes}

                <Button type='primary' icon={<PlusCircleOutlined />} style={{ float: 'right' }} onClick={() => { setModalCadastroAberto(true) }}>
                    Cadastrar Cliente
                </Button>

                <Modal title='Cadastrar Cliente'
                    open={modalCadastro}
                    okText='Cadastrar'
                    cancelText='Cancelar'
                    onCancel={() => {
                        formCadastro.resetFields()
                        setModalCadastroAberto(false)
                    }}
                    onOk={() => {
                        formCadastro.submit()
                    }}
                >

                    <Form form={formCadastro} name='formCadastro' layout='vertical' autoComplete='off' onFinish={cadastrarCliente}>
                        <Form.Item name='nome' label='Nome'>
                            <Input type='textarea' maxLength={128} showCount={true} />
                        </Form.Item>

                        <Form.Item name='cpf' label='CPF'>
                            <Input type='textarea' maxLength={11} showCount={true} />
                        </Form.Item>

                        <Form.Item name='celular' label='Celular'>
                            <Input type='textarea' maxLength={128} showCount={true} />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title='Editar Cliente'
                    open={modalEditar}
                    okText='Atualizar'
                    cancelText='Cancelar'
                    onCancel={() => {
                        formEditar.resetFields()
                        setModalEditarAberto(false)
                    }}
                    onOk={() => {
                        formEditar.submit()
                    }}
                >

                    <Form form={formEditar} name='formEditar' layout='vertical' autoComplete='off' onFinish={editarCliente}>
                        <Form.Item name='idCliente' label='ID Cliente' hidden={true}>
                            <Input type='textarea' maxLength={128} showCount={true} disabled={true} />
                        </Form.Item>

                        <Form.Item name='nome' label='Nome'>
                            <Input type='textarea' maxLength={128} showCount={true} />
                        </Form.Item>

                        <Form.Item name='cpf' label='CPF'>
                            <Input type='textarea' maxLength={11} showCount={true} />
                        </Form.Item>

                        <Form.Item name='celular' label='Celular'>
                            <Input type='textarea' maxLength={128} showCount={true} />
                        </Form.Item>
                    </Form>
                </Modal>

                <Table key={'Lista De Clientes'} columns={colunasCliente} dataSource={listaClientes} />
            </Col>
        </Row>
    )
}