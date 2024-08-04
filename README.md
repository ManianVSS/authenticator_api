
![Logo](./NammaAuthenticator.png)
# Namma Authenticator

Namma Authenticator is an open-source web application designed to empower users with their own hosted authenticator app. This application provides a secure platform for generating time-based one-time passwords (OTPs) essential for two-factor authentication (2FA). Users can easily add secrets by uploading QR codes, streamlining the process of setting up 2FA for various services.

Namma Authenticator features comprehensive API documentation via Swagger, facilitating seamless automation and integration of 2FA into existing systems. This detailed API documentation ensures that developers can effortlessly implement and manage 2FA across their applications, enhancing security without compromising on usability.

By offering a self-hosted solution, Namma Authenticator ensures users have complete control over their authentication data, addressing privacy and security concerns inherent in third-party authenticator services. The combination of ease of use, robust security features, and thorough API support makes Namma Authenticator an ideal choice for individuals and organizations looking to enhance their digital security through two-factor authentication.




## License

[BSD 3-Clause License](./LICENSE)


## Installation

Check out this branch to your local or server where you want to host the application. 

Pre-requisites - We would need Python and pip running on the machine

For ubuntu
```bash
  cd authenticator_api/server
  pip install -r requirement.txt
  ./cleandb.sh
```

For windows
```bash
  cd authenticator_api/server
  pip install -r requirement.txt
  ./cleandb.bat
```
    
## Deployment

To deploy this project run

For ubuntu
```bash
  ./runserver.sh
```

For windows
```bash
  ./runserver.bat
```


## Documentation

Once the application is deployed successfully. Launch below URL on the browser to run the application

```http
  http://<serverip>:8000/
```
You can add Secrets by uploading the QR code and get OTP for multifactor authentication of your apps.

To maintain your user and authenticator application you can make use of adminstrator application by launching below URL.

```http
  http://<serverip>:8000/admin
```

To automate your multifactor workflow, you can make use of API which will give you OTP for your registered application. Lauch below URL for Swagger application which has details about all the APIs.

```http
  http://<serverip>:8000/swagger
```

Edit the runserver.sh for changing server port and dabatabse properties.