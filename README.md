<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url] -->
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <!-- <a href="https://github.com/othneildrew/Best-README-Template"> -->
  <a href="https://www.myApp.com/">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Backend Template:</h3>
  <a href="https://www.myApp.com/">
     <div  align="center">  Example</div>
  </a>

  <p align="center">
    For an awesome company :
    <br />
    <a href="https://www.myApp.com/"><strong>www.myApp.com »</strong></a>
    <br />
    <br />
    <!-- <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a> -->
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <!-- <li><a href="#usage">Usage</a></li> -->
    <!-- <li><a href="#roadmap">Roadmap</a></li> -->
    <!-- <li><a href="#contributing">Contributing</a></li> -->
    <!-- <li><a href="#license">License</a></li> -->
    <!-- <li><a href="#contact">Contact</a></li> -->
    <!-- <li><a href="#acknowledgements">Acknowledgements</a></li> -->
    <li><a href="#links">Links</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- add Photo and a link to app -->
<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

The project consists of 2 services:
* main application
* Asyncronouse notification service 

CRUD resources:
  * user 
  * keywords  
  * community  
  * posts  

Features: (tested with Jest)
  * Swagger documentation 
  * Signup and signin (using JWT)  
  * Add new keywords 
  * List exsiting keywords 
  * Create new community 
  * List community 
  * Block posting request for non-members 
  * Request membership to join a community 
  * Approve membership request to join community (by moderator or super-moderator)
  * Creat pending post in a community  
  * Alert about detected keywords in pending post using asynchronose notification service.
  * Approve pending post in a community (by moderator or super-moderator)
  * List posts in a feed using below sorting:
    * All Posts must be from user registered communities 
    * Posts from same country (user vs author) is displayed first sorted by a numeric score system  
    * Posts NOT from same origin country is displayed last sorted by a numeric score system
      * score [0..100] is calculated using 80% likes + 20% post length


### Built With

Major frameworks used in the project. Add-ons/plugins described in acknowledgements section.
* [Express](https://expressjs.com/) - back end web application framework for Node.js
* [MongoDB](https://mongodb.com) - Non relation DB
* [Redis](https://redis.io) - Asynchronose communication between services
* [Git](https://git-scm.com/) - source contrl system
* [Github](https://github.com) - remote repository

Tools,libs:
* Redis Pub/Sub ( ).  
* [Jest](https://jest.com) - unit testing and e2e
* Postman (e2e)
* MongooseJS (MongoDB interface)
* Swagger (documentation)



<!-- GETTING STARTED -->
## Getting Started

run development server locally. In root folder run: 
  ```sh
  npm run dev
  ```

run automated test. In root folder run: 
  ```sh
  npm run test
  ```

run automated test. In root folder run: 
  ```sh
  npm run test:notification
  ```

run in production. In root folder run: 
  ```sh
  npm run start
  ```


### Prerequisites

* NodeJS + NPM 
* MongoDB
* Redis
* Git
 

### Installation

<!-- 0. Get a free API Key at [https://example.com](https://example.com) -->

1. Clone the repo <>
   ```sh
   git clone https://github.com/alex639hz/myApp.git
   ```
   change directory to root folder 
   ```sh
   cd myApp
   ```

3. Install NPM packages
   ```sh
   npm install
   ```
4. Testing without notification service
   ```sh
   npm run test
   ```
5. Testing with notification service
   ```sh
   npm run test_notification
   ```

<!-- 4. Enter your API in `config.js`
   ```JS
   const API_KEY = 'ENTER YOUR API';
   ``` -->



<!-- USAGE EXAMPLES -->
<!-- ## Usage -->
<!-- Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources. -->
<!-- _For more examples, please refer to the [Documentation](https://example.com)_ -->



<!-- ROADMAP -->
<!-- ## Roadmap -->
<!-- See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a list of proposed features (and known issues). -->



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
<!-- ## License -->
<!-- Distributed under the MIT License. See `LICENSE` for more information. -->

<!-- CONTACT -->
<!-- ## Contact -->
<!-- Alex Zvuluny - [@your_twitter](https://twitter.com/your_username) - email@example.com -->
<!-- Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name) -->

<!-- ACKNOWLEDGEMENTS -->
<!-- ## Acknowledgements -->
<!-- * [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet) -->
<!-- * [Img Shields](https://shields.io) -->
<!-- * [Choose an Open Source License](https://choosealicense.com) -->
<!-- * [GitHub Pages](https://pages.github.com) -->
<!-- * [Animate.css](https://daneden.github.io/animate.css) -->
<!-- * [Loaders.css](https://connoratherton.com/loaders) -->
<!-- * [Slick Carousel](https://kenwheeler.github.io/slick) -->
<!-- * [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll) -->
<!-- * [Sticky Kit](http://leafo.net/sticky-kit) -->
<!-- * [JVectorMap](http://jvectormap.com) -->
<!-- * [Font Awesome](https://fontawesome.com) -->



<!-- Links -->
## Links
* [Adding Typescript to Nodejs/Express](https://blog.logrocket.com/typescript-with-node-js-and-express/)
* [Adding Docker to Nodejs/Express](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker-on-ubuntu-20-04)
* [Adding Docker to Nodejs/Express](https://avishwakarma.medium.com/getting-started-with-docker-for-nodejs-mongodb-and-redis-b97188d33559)
* [Mongodb for banking system](https://www.mongodb.com/blog/post/next-generation-mobile-bank-current-using-mongodb-atlas-google-cloud-make-financial-services-accessible-affordable-all)
* [Mongodb in financial systems](https://www.slideshare.net/mongodb/how-financial-services-organizations-use-mongodb)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/alexzvuluny/
[product-screenshot]: images/screenshot.png

