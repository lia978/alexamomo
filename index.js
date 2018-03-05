// content of index.js
const http = require('http')
const port = 5000
var qs = require('querystring');
var fs = require('fs');

function handlePostData(postData) {
  console.log(postData);
  fs.writeFile("/home/ubuntu/message", "!momo");
}

const answer = (title, message) => {
    return {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "type": "PlainText",
          "text": message
        },
        "card": {
          "content": message,
          "title": title,
          "type": "Simple"
        },
        "shouldEndSession": true
      },
      "sessionAttributes": {}
    }
}

const requestHandler = (request, response) => {
  //console.log(request)
  response.end(JSON.stringify(answer('message','message received')));

    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            handlePostData(post);
            // use post['blah'], etc.
        });
    }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
