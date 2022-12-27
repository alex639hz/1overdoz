
# project environment
- ubuntu 20.0
- nodejs
- mongodb
- redis pub/sub
- git 
- vs-code
- Postman
  
# missing
- typescript (see links section)
- docker (see links section)


## prerequisites  
- make sure redise running on default port 6379
- make sure mongoDB running on default port 27017

## install  
in a terminal shell run: 
> $ git clone https://github.com/alexzabo85/enso-exam.git

> $ cd ./enso-exam

> $ npm i

# How to run
In a terminanl (at ROOT folder run): 
> npm run dev 
 
# Swagger link 
> http://localhost:3000/api-docs/
 

## tested with
- Postman
- Jest 

in ROOT folder
> npm run test

Or

Use exported postman collection titled: ```postman_collection.json``` :
- auth/signup (make sure to include the credentials in requet body)
- auth/signin (make sure to include the credentials in requet body)
- image/list (make sure to include query parameters)
- deployment/create (make sure to include URL parameter) ```{{site}}/api/deployment/6138a23408f6eebaad3806fc```
- deployment/count 
- deployment/combi 


# links

## redis 
https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04

## docker
https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker-on-ubuntu-20-04



## typescript
https://developer.okta.com/blog/2018/11/15/node-express-typescript

## swagger
https://levelup.gitconnected.com/how-to-add-swagger-ui-to-existing-node-js-and-express-js-project-2c8bad9364ce

https://blog.logrocket.com/documenting-your-express-api-with-swagger/

https://medium.com/wolox/documenting-a-nodejs-rest-api-with-openapi-3-swagger-5deee9f50420

https://blog.cloudboost.io/adding-swagger-to-existing-node-js-project-92a6624b855b

https://www.section.io/engineering-education/documenting-node-js-rest-api-using-swagger/#documenting-api-general-information


## testing
https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

https://medium.com/bb-tutorials-and-thoughts/how-to-write-unit-tests-in-nodejs-with-jest-test-library-a201658829c7

https://github.com/visionmedia/supertest/blob/master/test/supertest.js

