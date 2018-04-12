// content of index.js
const http = require('http')
const port = 5000
var qs = require('querystring');
var fs = require('fs');

function handlePostData(postData) {
  var realjson = ""
  
  for(var prop in postData){
    realjson = prop
  }
  
  realjson = JSON.parse(realjson)

  request = realjson["request"]
  
  if(request["type"] == "LaunchRequest"){
    return;
  } else if(request["type"] == "IntentRequest"){
    var category = request["intent"]["name"]
    console.log(category)
    if(category == "meow")
      fs.writeFile("/home/ubuntu/message", "!meow");
    else if(category == "MimiPic")
      fs.writeFile("/home/ubuntu/message", "!mimi");
    else if(category == "MomoPic")
      fs.writeFile("/home/ubuntu/message", "!momo");
    else if (category == "bitcoin")
      fs.writeFile("/home/ubuntu/message", "$btc");
    else if (category == "claim")
      fs.writeFile("/home/ubuntu/message", "!claim");
    else if (category == "tip")
      fs.writeFile("/home/ubuntu/message", "!tip <@222144155604877322> 1");
  }
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
