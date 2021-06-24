# NUStats

<a href="https://drive.google.com/file/d/1IqatGDD48L9kQP54YiurZlCv4GjSoW3g/view?usp=sharing">Link to detailed README file</a>

![NUStats Logo](src/graphics/logo.png)

# Motivation

There are always numerous messages on unofficial NUS telegram chat groups asking for people
to participate in their polls for their projects. Survey requesters will not be able to validate
whether the people who has done their survey are NUS students or not. Should there be an
imposter, the requesters would have to make do with erroneous data. Sometimes, you may
also wonder “On average, how much sleep does an average NUS Computer Science freshman
get?” or “Where is the best Mala hotpot stall in NUS?”. It is hard to get answers to such questions
on social media as many who are not the targeted population would reply and skew the
responses.

More often than not, most surveys will ask the same standard questions about you. This
includes “faculty”, “gender”, “age” and “nationality”. You want to help your peers by completing
their surveys but it is cumbersome to key in all of these particulars every single time.
Furthermore, there are usually little to no benefits when completing these surveys and you
most likely will not be able to see the survey results.

Also, survey requesters may not have learnt software that can help them analyse the data. A
simple table will not be enough to illustrate the data they have gotten. Wouldn’t it be better
to have an all-in-one data collection and analysis platform?

# Aim

We hope to make the data collection and analysis process **quick, easy and engaging** for both pollers and respondents via the use of a web application.

# User Stories

1. As a **student** who requires detailed statistics for use in my essay assignments, I want to be able to retrieve existing data from a repository.

2. As a **student** who is working on my final year thesis, I want to be able to conduct a survey from a sample of the NUS population in order to back up my research.

3. As a fellow **student**, I want to be able to help other students with their surveys without the need to fill in some of the particulars so that I can do more surveys.

4. As a **teaching assistant** or **professor** who wishes to help my students, I want to be able to collect valuable feedback about my teaching pace, style and if any, some of the doubts that students may have.

5. As a **member of the school administration**, in order to better understand the school population, I may wish to conduct surveys via the application from time to time.

# Features

## Account Verification

- Ensures that the person doing the polls is from NUS, or a chosen demographic
- Implemented via the use of email verification
- Prevents the problem of noisy data that is common in polling and surveying applications

## Survey Studio

- A customisable workspace for creators to create and edit their polls with ease

## Dashboard

- A dashboard where users can view selected polls at a glance, acting as a homepage

## Statistic Analyser

- Allows users to utilise and visualise data collected without the need for any other external software

## Stats Repository

- Gives easy access to statistics from past surveys, while keeping individual data points anonymous

# Differences from other platforms

## Google Forms

- NUStats will be more social media like with all of the polls in one place, showing the most recent polls, and polls with the most responses
- In Google Forms, the permissions for the forms are “Anyone with the link” (Public),
  or just by invitation only (Private). NUStats will check whether you have the relevant attributes / permissions before allowing you to submit your response, effectively removing the myriad of questions asked by surveys
- The data from NUStats can be viewed by all as it is crafted to be more social media-like

## Kahoot / PollEverywhere

- Similar to the points mentioned in Google Forms.
- This is not a quiz platform and hence there is no correct or wrong answer. This is even if someone using NUStats submitted a poll that has correct / wrong answers
  instead of a normal opinion-getting poll.
- The results from the poll will persist instead of being a one-time poll

## Telegram Polls

- Similar to the points mentioned in Google Forms
- Prevents non-NUS members from answering polls in NUS Telegram Group Chats /
  Module Group Chats as Telegram public channels do not have relevant restrictions

# Program Flow

![Program Flow](src/graphics/program_flow.jpg)

# Timeline

### Done as of Milestone 1

1. Google Account Verification
2. Creating Poll with variable number of options and auto-save feature (options and questions
   are editable)
3. Having a global list of submitted polls by all users
4. Able to do a poll and automatically filters out whether you have done the polls or not

### Milestone 2

| Week | Date Period | Agenda                                                                                                                 |
| ---- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1    | 1 - 7 Jun   | <ul><li>Solving the issues from Milestone 1</li></ul>                                                                  |
| 2    | 8 - 14 Jun  | <ul><li>Completion of Survey Studio</li><li>Completion of Account Verification</li></ul>                               |
| 3    | 15 - 21 Jun | <ul><li>Showing the results of responses</li><li>Adding search feature that will lead up to Stats Repository</li></ul> |
| 4    | 22 - 28 Jun | <ul><li>Completion of Statistic Analyser</li></ul>                                                                     |

</br>

### Milestone 3

| Week | Date Period    | Agenda                                                                                                        |
| ---- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| 1    | 29 Jun - 5 Jul | <ul><li>Solving the issues from Milestone 2                                                                   |
| 2    | 6 - 12 Jul     | <ul><li>Completion of Stats Repository                                                                        |
| 3    | 13 - 19 Jul    | <ul><li>Completion of Survey Dashboard</li><li>Completion of Gamification System/targeted surveying</li></ul> |
| 4    | 20 - 26 Jul    | <ul><li>Adding pre-defined permissions for targeted surveying</li></ul>                                       |

# Issues

As of Milestone 1:

- Data gets erased after logging out and logging in again
- The need to refresh the web app to update the text field values when submitting and deleting polls

# Tech Stack

Front-End: HTML/CSS, ReactJS

Back-End: Google Firebase
