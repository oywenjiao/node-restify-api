# node-restify-api
Restful API based on Restify module.

Interface Call Concept: Single Entry.

## Installation tutorial

### 1.Related plug-in installation
run <code>npm install</code> command.

### 2.Relevant Configuration Item Files
copy <code>app->config</code> Directory <code>env.example</code> by <code>env.json</code>

### 3.MySQL connection profile
copy <code>app->database</code> Directory <code>db.xxx.js</code>

## Directory specification
### 1.directory structure

### <code>app:</code> Project core
- #### <code>config:</code> project configuration
- #### <code>database:</code> database configuration
- #### <code>module:</code> custom module
- #### <code>tool:</code> tool library
- #### <code>version:</code> Interface file version iteration

~~~
In the version directory, each application has its own model operation file, which is named model.
The model operation files in the model directory use the sequelize database operation framework
~~~

## <font color=#f00>note:</font>

There are two types of database configuration files in the database directory.
- Native SQL configuration for files named db.*
- Sequelize framework configuration for files named config.*

### 1-1.<code>version</code> Iterative sample specification:
- Create the first version <code>v1</code> directory.
- Operating interfaces of different applications are stored in corresponding directories with the same name.
- Storage of interface files by directory according to function points under application directory.

### 1-2.<code>version</code> Directory file description
- <code>login.js</code> Token login registration file.
- <code>verify.js</code> Token information validation file.

## Interface example
### 1.Examples of native SQL operations:
Target path:<code>app->version->v1->daily->user</code>
