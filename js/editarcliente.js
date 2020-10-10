(function() {
    let DB;
    let idCliente;

    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const empresaInput = document.getElementById('empresa');
    const formulario = document.getElementById('formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', actualizarCliente);

        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 1000);
        };
    });

    function actualizarCliente(e) {
        e.preventDefault();
        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        };

        const clienteActualizado = {
            nombre: nombre.value,
            email: email.value,
            telefono: telefono.value,
            empresa: empresa.value,
            id: Number(idCliente)
        };

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
        transaction.onerror = () => {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
        }

    };

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = e => {
            const cursor = e.target.result;
            if(cursor) {
                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                };
                cursor.continue();
            };
        };
    };

    function llenarFormulario(datosCliente) {
        const {nombre, email, telefono, empresa} = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    };

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
        };
    };

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () => {
            console.log('hubo un error');
        };
        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result;
        };
    };

})();