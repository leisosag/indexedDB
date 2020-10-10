(function() {
    let DB;
    const formulario = document.getElementById('formulario');

    document.addEventListener('DOMContentLoaded', ()=> {
        conectarDB();
        formulario.addEventListener('submit', validarCliente);
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.log('hubo un error');
        };
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        };
    }

    function validarCliente(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const empresa = document.getElementById('empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        }

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.add(cliente);

        transaction.onerror = () => {
            imprimirAlerta('Error al cargar los datos', 'error');
        }

        transaction.oncomplete = () => {
            imprimirAlerta('Agregado correctamente');

            setInterval(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    function imprimirAlerta(mensaje, tipo) {
        const alerta = document.querySelector('.alerta');
        
        if(!alerta) {
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

            if(tipo === 'error') {
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }

            divMensaje.textContent = mensaje;
            formulario.appendChild(divMensaje);

            setTimeout(() => {
                divMensaje.remove();
            }, 2000);
        }
        
    }
})();