# user-status

Implémentation de la démo de [meteor-user-status](https://github.com/mizzao/meteor-user-status)

## Installation

```sh
$ git clone https://github.com/srault95/meteor-user-status.git packages/meteor-user-status

$ meteor add srault95:user-status
```

## Usage

Dans un template:

```
{{> status}}

OU

{{> status userStatus}}

OU

{{> statusPanel}}
```

## SimpleSchema


```js
App.Schemas.User = new SimpleSchema({
  //...
  status: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  //...
});
```


## TODO

* Utilisation d'un évènement clavier pour afficher la page de status avec [keyboardjs](https://atmospherejs.com/keyboardjs/keyboardjs)


