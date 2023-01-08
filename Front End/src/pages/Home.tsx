import { ToastContainer } from "react-toastify";

export default function Home() {
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
                    Login
                </h4>
            </div>

            <div className='shadow-lg rounded w-50 mx-auto mt-5'>
                <form className='d-grid gap-3 p-5'>
                    <div className='form-floating'>
                        <input type='text' placeholder='#' autoComplete={'off'} className='form-control' id='cpf' name='cpf' />
                        <label htmlFor='cpf' className='text-dark'>Usuário</label>
                    </div>
                    <div className='form-floating'>
                        <input type='text' placeholder='#' autoComplete={'off'} className='form-control' id='nome' name='nome' />
                        <label htmlFor='nome' className='text-dark'>Senha</label>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button type='submit' className='btn btn-primary'>Login</button>
                    </div>
                </form>
            </div>

        </div>
    )
}