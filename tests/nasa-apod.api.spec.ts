import { test, expect, request } from '@playwright/test';


//Test de pruebas sobre la API publica de la NASA
//APOD: imagen astronómica del día
test('Verificación status de autenticacion', async ({ request }) => {

  const response = await request.get('/planetary/apod?api_key=YxAlnmSIWUbaO7xFvEYfBx0bZLzjM9JLXfuE3hWd');

  expect(response.status()).toBe(200); // valida que el codigo luego del get sea 200
  // es decir que esta ok la autenticación 
});

test ('Verificación autenticación fallida', async ({ request}) => {
  const response = await request.get('/planetary/apod?api_key=CLAVE_INVALIDA_O_EXPIRADA');
  expect(response.status()).toBe(403); //403 es el error mas comun cuando el usuario ingresa dato invalido 
  // y no se realiza la autenticación 
  console.log(`Status Code Recibido en falla: ${response.status()}`);
});

test('Verificar cantidad de imagenes al azar', async ({request}) => {
  const expectCount = 4;
  const response = await request.get('/planetary/apod', {
    params:{
      api_key: 'YxAlnmSIWUbaO7xFvEYfBx0bZLzjM9JLXfuE3hWd',
      count: expectCount,
  },
  });

  //Verifica el codigo que se obtiene al enviar el request 
  expect(response.status()).toBe(200);

  //Ahora verifico que la cantidad de imagenes corresponda a la que le pedí 
  const body = await response.json(); // obtengo en formato json la respuesta de la API
  expect(body.length).toBe(expectCount); //verifico la longitud del array

});

test('Verificar obtención de imagen con fecha válida', async ({request}) => {
  const fechaConocida = '2024-12-23'; 

  const response = await request.get('/planetary/apod', 
    {params: {
      api_key: 'YxAlnmSIWUbaO7xFvEYfBx0bZLzjM9JLXfuE3hWd',
      date: fechaConocida,
    },
  });

  expect(response.status()).toBe(200);
  //traigo la respuesta del request 
  const body = await response.json();
  expect(body.date).toBe(fechaConocida); //La respuesta contiene la fecha que se le pasó por parametro 
});

test('Verificar respuesta con fecha inválida', async ({request}) => {
  const fechaFutura = '2026-01-01';

  const response = await request.get('/planetary/apod', {params: {
    api_key: 'YxAlnmSIWUbaO7xFvEYfBx0bZLzjM9JLXfuE3hWd',
    date: fechaFutura,
  }, });

  expect(response.status()).toBe(400); // Se espera error de tipo 400, es decir el usuario ingresa un dato erroneo 

});

//----------- Prueba de latencia ----------- //

test('Verificar latencia menor a 500 ', async ({request}) => {
  const tiempoActual = Date.now(); //El tiempo al enviar la consulta 
  const response = await request.get('/planetary/apod?api_key=YxAlnmSIWUbaO7xFvEYfBx0bZLzjM9JLXfuE3hWd');
  const tiempoDEspues = Date.now(); //Tiempo luego de la ejecución

  const latencia = tiempoDEspues - tiempoActual;

  expect(response.status()).toBe(200);
  expect(latencia).toBeLessThan(500);

  console.log(`✅ Latencia de APOD para este ambiente: ${latencia}ms`);

});



