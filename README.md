# My Survey Companion

Real simple, yet modern questionnaire application.

# Highlighted Features

These are the functionalities of the application by design, which has been powered by CI/CD Automations.
In this project, Jenkins will be used to integrate and deploy the application to the production level output.

## CI/CD Steps

![image](https://user-images.githubusercontent.com/45738683/163292172-6fee5bb7-23b4-4941-8869-6f4465051c12.png)

From the very first step, which is "Checkout SCM" until "Send Notification" are included in this section.
Developers are tended to be notified whether the integration, deployment process has been conducted successfully or not.
All development step detail can be shown with its terminal / bash standard output.

![image](https://user-images.githubusercontent.com/45738683/163292317-0fac2c84-b87e-4c11-83b9-072c53bebbbc.png)

## Docker Containerization

![image](https://user-images.githubusercontent.com/45738683/163292414-1c282ed5-a478-42cc-b629-347925c43da8.png)

Using docker has never been easier before, with the adoption of Docker Socket and Compose, the deployment of application can be done in an instance.
By starting the *docker-compose.yml* and *docker=compose_service.yml* automatically starts each container dependencies: mysql, jenkins-service, and the full-stack application itself.
In usual way, each back-end and front-end of the application will be served as *dockerfile* that needs to be build and uploaded to the docker hub.
Thanks to the CI/CD methods, all of those works have been handled by Jenkins without need of worry.

## UI/UX Design

![image](https://user-images.githubusercontent.com/45738683/163294046-e8d7a4b3-c77b-4670-9b0e-e9539f565c67.png)

Simpler design has been implemented by using card-shaped items for the creation of questionnaire.
User can slide to the next or previous items by sliding the container, access the item directly, reducing the waiting time.

## Faster Data Load

![image](https://user-images.githubusercontent.com/45738683/163294339-9809b71d-2db2-4fc5-929e-d54972c36de5.png)

REST-API is used to perform GET and POST request to the application. Loaded the data for the form list, current form, invitation, to the data visualization faster.

## Better Customization

Design your questionnaire in the way you are. Users are enabled to change the background image and color theme for the questionnaire to suits the *requirements* of the questionnaire creators.

## Easy Share

![image](https://user-images.githubusercontent.com/45738683/163295029-c610aa75-4117-4b46-97f4-fa4bcd203c18.png)

Implementing the questionnaire system to the index database, powers its users to invite others as respondents to the current questionnaire.
As creator, tracking systems can help you to identify the progress of completion by your own respondents.

## Feedback System

Not only create, but also responds to your respondents. This way, not only to assist respondents to understand the way questionnaire requirements,
but also aid the creator to fulfill the data needs in accurate way.

## Admin Page

As developer side, the application provides some informations to configure the system, receive suggestions from its users to maintain the application development.
