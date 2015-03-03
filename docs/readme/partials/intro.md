Develop your web application with no dependencies on back end services by running a simple Express http server which can deliver mock responses. 

Responses can be JSON, XML,to simulate REST or SOAP services. Access-Control HTTP Headers are set by default to allow CORS requests. Mock services are configured in the [routes.json](./routes.json) file.

`Note`: This server can return other file types besides `xml` and `json` (PDFs, images, etc).  The appropriate response headers will be automatically set for different file types.  For a complete list of file types supported view the [mime types here](https://github.com/broofa/node-mime/blob/master/types/mime.types).
