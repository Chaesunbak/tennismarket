const fs = require('fs');
const main_view = fs.readFileSync('./main.html', 'utf8');
const orderlist_view = fs.readFileSync('./orderlist.html', 'utf8');

const mariadb = require('./database/connect/mariadb');

function main(response) {

    console.log('main');

    mariadb.query("SELECT * FROM product", function(err, rows) {
        console.log(rows);
    });


    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(main_view);
    response.end();
}

function order(response, productId){

    console.log(productId);

    mariadb.query(`INSERT INTO orderlist VALUES (${productId}, '${new Date().toLocaleDateString()}');`, function(err, results) {
        if (err) {
            console.error("Database error:", err);
            response.writeHead(500, {'Content-Type': 'text/html'});
            response.end('Internal Server Error');
            return;
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('Order placed successfully');
        response.end();

    });
}

function orderlist(response){

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(orderlist_view);

    mariadb.query("SELECT * FROM orderlist", function(err, rows) {
        rows.forEach(row => {
            response.write(
                "<tr>"
                + "<td>" + row.product_id + "</td>"
                + "<td>" + row.order_date + "</td>"
                + "</tr>"
            );
        });

        response.write("</table>");
        response.write("</body>");
        response.write("</html>");
        response.end();
    });
}

function redRacket(response){
    fs.readFile('./img/redRacket.png', function(err,data){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}

function blueRacket(response){
    fs.readFile('./img/blueRacket.png', function(err,data){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}

function blackRacket(response){
    fs.readFile('./img/blackRacket.png', function(err,data){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}


let handle = {};
handle['/'] = main;
handle['/order'] = order;
handle['/orderlist'] = orderlist;


// Image directory

handle['/img/redRacket.png'] = redRacket;
handle['/img/blueRacket.png'] = blueRacket;
handle['/img/blackRacket.png'] = blackRacket;

exports.handle = handle;