# AS-Bracket
**Bracket notation for AssemblyScript**

## Installation Process

```bash
~ npm i as-bracket
or 
~ yarn add as-bracket
```

## Installing the Transform

Choose one of the following options to apply the transform

Via `asconfig.json`

```json
{
  ...
  "options": {
+   "transform": "as-bracket"
  }
}
```

Via CLI argument

```
asc ... --transform as-bracket
```

## Usage

Just use it like normal JS :)
The only difference is that it will throw an error if you try to access a property that does not exist or assign a different type

## Contributing
Just fork, clone, and install
Make sure to comment your code where it needs and keep your code clean and generally performant.
To run, use the three scripts provided in `package.json`. Its quite straightforward

## Todo
- Work on nested class accesses
- Optimize where it can
- Only enable brackets on classes where its relevant to do so
- Get a testing framework. If Aspect isn't ready, then manually test
- Work on bracket assignment and support all binary operators