function Header() {
    return (
        <div className="d-flex flex-column gap-2 vertical-menu" style={{height:'100vh'}}>
            <h3 className="p-2 fs-5 text-light">CRUD Estudo</h3>
            <a className='order-1 p-2 text-decoration-none text-light' href="/">Início</a>
            <a className='order-2 p-2 text-decoration-none text-light' href="/clientes">Clientes</a>
            <a className='order-3 p-2 text-decoration-none text-light' href="/produtos">Produtos</a>
            <a className='order-4 p-2 text-decoration-none text-light' href="/configuracoes">Configurações</a>
        </div>
    );
}

export default Header;