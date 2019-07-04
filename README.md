# @studiohyperdrive/lb-task-checker v1.0.0 #
Helper for running tasks loadbalanced.


# Table of contents #

* [Setup](#setup)
    * [Install](#install)
    * [usage](#usage)
* [Code Contribution](#code-contribution)
    * [Guidelines](#guidelines)
    * [Branches](#branches)
* [Project Context](#project-context)
    * [Details](#details)
    * [Team](#team)



## Setup ##

### Install ###

`npm install git+https://github.com/JvJefke/lb-task-checker.git`

### Usage ###

```js
const LbTaskChecker = require("@studiohyperdrive/lb-task-checker");

lbTaskCheckerInstance.registerTask({
    key: "SCHEDULE_PUBLISHING",
    instance: process.pid
});

lbTaskCheckerInstance.reserve("SCHEDULE_PUBLISHING", new Date(new Date().getTime() + 10000), process.pid)
    .then((runTask) => runTask ? [run task here] : null);
```

## Code Contribution ##

### Guidelines ###


### Branches ###

We follow these naming conventions:

* **master**: Production-ready code.
* **release/***: Snapshot of a release.
* **feature/***: For developing new features.
* **bugfix/***: For bugs that are logged during testing.
* **hotfix/***: Only for hotfixing critical bugs from the `master`-branch.


## Project Context ##

This project is a Studio Hyperdrive team effort.

### Details ###

* **Client**: Studio Hyperdrive
* **Start**: 12/10/2017
* **Jira Board**: https://www.studiohyperdrive.be
* **Drive Folder**: https://www.studiohyperdrive.be
* **Project Sheet**: https://www.studiohyperdrive.be

### Team ###

List the team that has worked on this project, including the duration e.g.:

* [Jeroen Valcke - Studio Hyperdrive](developer-1@studiohyperdrive.be)
    * **Function**: Javascript developer
    * **Period**: september 2018
