---
slug: "typescript-mapping-non-null-values"
date: "2023-01-05"
title: "TypeScript: Properly filtering arrays for non-null"
category: Typescript
---

If you have used JavaScript and array operations for a while, there is a good chance you wanted to filter an array for non-null values. And if you are using TypeScript, there is a chance you ended up with something along the lines of that:

```ts
const array = ["Michael", "Dwight", undefined, "Pam", "Jim", undefined]
typeof array // (string | undefined)[]

console.log(array.map(value => value.includes("Mich")))
// error, value could be undefined
// I should filter for only defined values...

const filteredAttempt = array.filter(value => !!value)
typeof filteredAttempt // (string | undefined)[]
// Argh dang, TypeScript doesn't infer the filter logic, that didn't do anything...

// screw it
const filteredAttempt2 = array.filter(value => !!value) as any
typeof filteredAttempt2 // any, good enough..
console.log(filteredAttempt2.map(value => value.includes("Mich")))
```

You will quickly find that TypeScript doesn't actually check what the filter function does, so the returned array will be the same, and you will have to straighten the type manually to make it work, often relying on `any` which is always a bad idea.

However, this is really easy to do properly with type guards. A type guard function in TypeScript that takes a parameter `x` and returns a type of the form `x is T` with `T` being any type. Now, if code is called in a scope in which this type guard function was called and returned `true`, the type of `x` will be automatically narrowed down to `T` within that scope:

```ts
const isString = (v: any): v is string =>
    typeof v === "string"

const stringOrNumber = Math.random() > .5 ? "hello" : 42

if (isString(stringOrNumber)) {
    console.log(stringOrNumber.endsWith("lo")) // works
} else {
    console.log(stringOrNumber.toPrecision()) // works
}
```

Note that this technically is a type conversion, and you very much can do non sensical stuff with this:

```ts
const surelyAString = (v: any): v is string => true

const stringOrNumber = Math.random() > .9999 ? "hello" : 42

if (surelyAString(stringOrNumber)) {
    console.log(stringOrNumber.endsWith("lo")) 
    // works, but probably not during runtime
}
```

However, it allows you to encapsulate casting logic, which makes the code easier to read and understand which conversions are being made and how they work, thus reducing the likelihood of errors in that logic.

Returning to the original question: How can we leverage type guards to properly filter an array for non-undefined values?

```ts
const array = ["Michael", "Dwight", undefined, "Pam", "Jim", undefined]
typeof array // (string | undefined)[]

const isNotUndefined = <T>(value: T | undefined): value is T => 
    value !== undefined

const filteredArray = array.filter(isNotUndefined)
typeof filteredArray // string[]

console.log(filteredArray.map(value => value.includes("Mich"))) // works!
```

We define a type guard function `isNotUndefined` with generic type `T`, which takes a parameter of type `T | undefined`. If we now supply a value of type `string | undefined`, `T` is inferred to be `string`, and the type guard will narrow the type of the parameter down to `string` if it returns true. This can also be done for filtering out other types such as `null`.

```ts
const isNotNullish = <T>(value: T | null | undefined): value is T => 
    value !== undefined && value !== null
```