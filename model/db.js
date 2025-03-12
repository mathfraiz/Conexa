/*async function connect(){ //exemplo de conexão com o banco de dados

    if(global.connection && global.connection.state != 'disconnected' ){
        return global.connection;
    }

    const mysql = require('mysql2/promise');
    const connection =  await mysql.createConnection("mysql://root:admin@localhost:3306/bdconexa"); // mudar pro nosso banco de dados
 

    console.log("Conectou no MYSQL!");
    global.connection = connection;
    
 
    return connection;

}

connect();

// apos isso são as funções de manipulação do banco de dados
*/