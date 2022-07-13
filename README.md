# Rao Conduct [Angular]

A Project management tool with user role allocation , task track, bug  report , issue create Functionality 
## Project Structure
```
Rao-Conduct-Angular#v0.0.1
├── src/                            #project root
|   ├── app/                        #application folder.
|   |   └──app-routing.module.ts    #app-routing 
|   |   └──app.component.html       #app component html
|   |   └──app.component.scss       #app component scss
|   |   └──app.component.ts         #app component ts.
|   |   └──app.module.ts            #app module.
|   |   ├── components/                 #Keep all components here. Create new components in this directory using `ng generate component`
|   |   ├── directives/                 #Keep all directives here (if any). Create new directives in this directory using `ng generate directive`.
|   |   ├── guards/                     #Keep all guards here. Create new guards in this directory using `ng generate guard`.
|   |   ├── models/                     #Keep all classes, interfaces, enums and models here. All application data models should reside here. 
|   |       └──classes/                 #Keep all data models and classes here. Create new classes here using `ng generate class`.                  
|   |       └──interfaces/              #Keep all interfaces here. Create new interfaces using `ng generate interface`.                  
|   |       └──enums/                   #Keep all enums here. Create new enums using `ng generate enum`.                  
|   ├── modules/                    #keep all modules here. Create new modules in this directory if required.
|   ├── pipes/                      #keep all pipes here (if any). Create new pipes in this directory if required.
|   ├── services/                   #keep all services here. Create new services in this directory if required.
|
|   ├── assets/                     #static assets for the project. Can include images, fonts, icons, logos etc.
|   |   └──images/                  #includes all the static image assets. Can include logos, background images and other images to be used in the project.
|   |   └──fonts/                   #includes all the static fonts assets if any. All font ttf, otf, svg, woff will reside here.
|   |   └──icons/                   #includes all the static icon assets if any. All icon jpeg, png and svg files will reside here.
│
│   ├── main.ts                     #angular bootstraps the application here.
|   ├── index.html                  #main html parent template. App root resides here. 
|   ├── polyfills.ts                #polyfills for our angular app. Loads before the app.
│   ├── styles.scss                 #global scss for the app
│   └── test.ts                     #global app test file. Finds all the test files throughout the project. Karma requires this file to run tests.
│
├── angular.json                    #angular structure config for the project. Keep default.
├── karma.conf.js                   #karma config for testing app.
├── tsconfig.app.json               #TypeScript compiler config for the project
├── tsconfig.json                   #TypeScript compiler config for the project
├── tsconfig.spec.json              #TypeScript compiler config for the project
├── .gitignore
├── package-lock.json
└── package.json
```

## Installation
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.4.

### Clone Repository

``` bash
# clone the repo (over ssh)
$ git clone https://bhushan-kalvani@bitbucket.org/old-projects-2k21/techx-angular.git

# go into app's directory
$ cd techx-angular

# install app's dependencies
$ npm install
```

### Basic Usage

``` bash
# dev server with hot reload at http://localhost:4200
$ ng serve
```
Runs the app in development mode.
Open [http://localhost:4200/](http://localhost:4200/) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Documentation

### Angular Documentation and further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

### Rao Conduct UI Design

The design for this project can be found in following formats:
* [Design PDF](https://drive.google.com/file/d/1MXQI8Ze_XdaNLb69puN1DPXKiYwJbKSW/view?usp=sharing)
