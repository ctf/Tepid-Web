# Tepid Web

## Redux Workflow

The general design is formatted around [typesafe-actions](https://github.com/piotrwitek/typesafe-actions)

### Structure

* Models and services (ie the api) are located in the `api` folder. 
This is largely independent from react, and simply interacts with tepid server
* Redux components are located in the `features` folder.
This includes everything from `actions`, `epics`, `reducers`, and `selectors`.
* All the components are then combined into a single store, located in the `store` folder.

### Creating a component

* Create the models and services. 
This is essentially a copy of whatever you are accessing from tepid server.
At this point, it will also be useful to create the mock components in our json server. More on that later.
* Create a new folder in `features`.
* Create actions. 
Actions are simply a collection of requests that can be executed, resulting in effects.
Each action is associated with a unique key, which must be added in `TepidActions`.
For the most part, actions within tepid will be asynchronous, so the underlying execution is handled in epics.
* Create epics. 
Assuming there are async actions, create an epic for each action to map each key with the respective service call.
It is a bit complicated, but you can refer to existing epics as examples.
* Create reducers.
Reducers are what update the states when a new event is received. 
Here, you will first create a type for your component's state, 
followed by a reducer that updates each key based on certain events.
Note that you can filter actions by their type and only handle relevant payloads.
* Create selectors.
This is optional; selectors aid in fetching data from your state.
* Create an `index.ts` to export your actions and reducers for convenience.
* Add your component to the root store. See `store/root-*.ts` for examples.

### Testing

Component testing happens at the reducer level. For each `reducer.ts`, create a `reducer.spec.ts`.
Create an empty store, mock the relevant service (api) calls, then verify that the epic returns what we want.

When testing tepid in general, with the react components, we rely on our mock server.
This is written with [json-server](https://github.com/typicode/json-server), 
which serves to emulate data from the same endpoints as our actual server.
For this to work, any time the service is updated, the associated contents should also be mocked in the db generator.

### Points to note

While this process is complicated, it makes building actual react components much easier.
The use of TypeScript should also help ensure that improper data handling is avoided.

Note that most models in this process are read only.
State updates is typically one way, prompted by event dispatches and mutated with reducers.
The mutation also must create new data, and does not actually modify the old states.

The way events are dispatched should also be completely handled within these feature components.
For instance, a common part of tepid is to avoid querying too often, as data isn't immediately stale.
Rather than relying on the service (api) or the react components to conditionally send dispatch events,
the dispatch events can simply avoid calling the service if all expected conditions aren't met.