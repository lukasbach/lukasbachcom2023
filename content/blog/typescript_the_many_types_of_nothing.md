---
slug: "blog/typescript-the-many-types-of-nothing"
kind: blog
date: "2023-01-05"
title: "TypeScript: The many types of nothing"
category: Typescript
---

Almost all programming languages have a special value that can be used to denote that a variable is uninitialized, not yet defined or was set in the context of a corner case. Perl calls it undef, Python calls it None, but most languages refer to it as null. If you've worked with JavaScript before, you know its apparent ambiguity of having two different kinds of this value: null and undefined. TypeScript doesn't necessarily help in clearing up confusion here by introducing three more special types related to type corner cases: never, void, and unknown. Let's explore those types to understand how they work and what they can be used for.

## null and undefined during runtime

Null and undefined are the only items of the aforementioned that actually are values that can exist during runtime, the others are only types that exist during compile time and are thrown away by the TypeScript compiler. 

We get some interesting insights into those two values by looking at how they interact in terms of equality, notably that both are strictly equal to itself, but only equal to itself with a type conversion, which is what the double-equal operator does:

```ts
undefined === undefined; // true
null === null; // true
undefined === null; // false
undefined == null; // true
```

Using the typeof operator also provides some insights:

```ts
typeof undefined; // "undefined"
typeof abc; // "undefined"
typeof null; // "object"
```

Here, we see that the value `undefined` is internally used by JS in some cases, in this instance variables that are not defined ("abc") will be equivalent to the value `undefined`, and a typeof check returns the string "undefined" accordingly. Checking the type of `null` is not as intuitive by returning "object", a quirk that the book "Professional JS for Web Developers" by Wrox provides some more details on:

> You may wonder why the typeof operator returns 'object' for a value that is null. This was actually an error in the original JavaScript implementation that was then copied in ECMAScript. Today, it is rationalized that null is considered a placeholder for an object, even though, technically, it is a primitive value.

In practice, **likely the most important difference is that the JS runtime commonly uses `undefined` in many places to denote that something does not exist; `null` on the other hand is never used automatically**. This gives developers a way of distinguishing between something that does not exist due to never being defined, or something that was intentionally set to `null` because it denotes an "empty" case. However, this is up to the developer since `undefined` can very much be assigned manually as well.

There is another oddity of `undefined`, which allows developers to assign a variable with the name "undefined" and use it sucessfully, something that is not possible with "null", however this is something that should not affect realistic code unless one would actively try to break things.

```ts
(() => {
  // Need to use scope, since `undefined` already is defined in the global scope. 
  // Don't think about it too hard...
  const undefined = "hello";
  // const null = "hello"; // would through a ReferenceError
  console.log(undefined); // logs "hello"
})();
```

## undefined and null during compile time

We just looked at how undefined and null behave during runtime. Now let us look at how they are interpreted during compile time by the typescript compiler. This will be a rather short investigation, since typescript defines the respective types "undefined" and "null" and has them behave the same way:

```ts
const nullValue = null; // type: null
const undefinedValue = undefined; // type: undefined

function maybeUndefined() {
    return Math.random() > .5 ? null : "hello";
}

const nullOrString = maybeUndefined(); // type: null | "hello"
```

## The type "never"

`never` is, in my opinion, one of the more interesting types in this list. It is mostly used internally by TypeScripts evaluation rules, but can be very powerful in complex type rules. The TypeScript handbook defines it as the following:

> The never type is a subtype of, and assignable to, every type; however, no type is a subtype of, or assignable to, never (except never itself). Even any isn't assignable to never.

TypeScript uses it as an inferred return value of a function which does not return. A function does not return if it either always throws an error:

```ts
const neverReturns = () => {
    throw Error("goodbye")
}
// inferred type is "const neverReturns: () => never" even without explicit types
```

This is also the case if it calls a method that never returns. Note that, in the following example, the return value of `neverReturns` is not directly used or returned, yet the TypeScript compiler knows that some never-returning function is called during the execution of `alsoNeverReturns`, and thus `alsoNeverReturns` is inferred to also never return either.

```ts
const neverReturns = () => {
    throw Error("goodbye")
}
const alsoNeverReturns = () => {
    neverReturns()
    return "something"
}
// inferred type is "const alsoNeverReturns: () => void"
```

Note that, if there is a chance of returning something, a function will not have the return value of `never`, so just because a function does not have that return type, it is not a guarantee that the function cannot throw.

```ts
const maybeReturns = () => {
    if (Math.random() > .5) {
        throw Error("goodbye")
    } 
    return "something"
}
// inferred type is "const maybeReturns: () => string"
```

Functions that run an endless loop also never return, which the TypeScript compiler correctly infers based on static code analysis, but again a function not returning `never` is not a guarantee that no endless loop happens.

```ts
const neverReturns = () => {
    while(true) {}
}
// inferred type is "const neverReturns : () => never"

const maybe = Math.random() > .5 // type boolean
const maybeReturns = () => {
    while(maybe) {}
}
// inferred type is "const maybeReturns : () => void"
```


## Leveraging `never` for complex types

I mentioned before that I find `never` to be one of the more useful types when it comes to writing complex types. What is beneficial here is that `never` is pulled through nested type evaluations in a transitive way just as it is in transitive function invocations.

Let's say we have a type `MailHostOf<T>` which infers the host of a particular email address in a string value, so we want `MailHostOf<"john@outlook.com">` to evalaute to `"outlook"`. This is very easy to do with the `infer`-keyword in TypeScript. However, we also need to handle the case where types are passed that are no valid emails. Let's say we just map the mail host to `null` in those cases:

```ts
type MailHostOf<T> = T extends `${string}@${infer H}.com` ? H : null

type Domain = MailHostOf<"contact@lukasbach.com"> // type is "lukasbach"
type InvalidMail = MailHostOf<"this is no valid email"> // type is null

type AlternativeMail = `noreply@${Domain}.com` // type is "noreply@lukasbach.com"
type InvalidAlternative = `noreply@${InvalidMail}.com` // type is "noreply@null.com"
```

This generally works fine, but as you can see, the type `InvalidAlternative` evaluates to "noreply@null.com" which is not what we want in this case. Type evaluation works different if we choose `never` as the returned type in those cases where a non-valid email is passed:

```ts
type MailHostOf<T> = T extends `${string}@${infer H}.com` ? H : never

type Domain = MailHostOf<"contact@lukasbach.com"> // type is "lukasbach"
type InvalidMail = MailHostOf<"this is no valid email"> // type is never

type AlternativeMail = `noreply@${Domain}.com` // type is "noreply@lukasbach.com"
type InvalidAlternative = `noreply@${InvalidMail}.com` // type is never
```

This is more appropriate to what we expect. 

Let's recall what the TypeScript handbook said about never: `never` is assignable to every type, but no other type is assignable to `never`. This is important here:

* `never` being assignable to every type means that we can continue to refer to a type that potentially evaluates to never even further down the road of our complex type definitions. 
* no type being assignable to `never` means that, once we narrow down the type by providing values for generics and thus producing a certain `never`-type, the compiler will correctly alert us that a type was produced that cannot be used.

So even though for now our code is valid and no errors were produced, we will encounter errors once the types are used:

```ts
const validMail: AlternativeMail = "noreply@lukasbach.com"
// works

const invalidMail: InvalidAlternative = "" as any
// Compiler error: "Type 'any' is not assignable to type 'never'."
// nothing can be assigned here, not even any
```

## The type `void`

Whereas `never` is a type that is really useful for custom types, `void` is a type that is rather unlikely to be useful in many instances. It is the inferred return type of a function which returns nothing. This sounds very much like the definition of `never`, but recall that `never` is the return type of a function that literally never returns, i.e. an exception is thrown or the function is stuck in a loop, whereas `void` is the return type of a function which very much returns, it just does not return any value. You probably know the term from other programming languages like Java, where you are required to type a function to `void` in that case.

```ts
const neverFunc = () => {
    // type: () => never
    throw Error()
}
const voidFunc = () => {
    // type: () => void
}
```

In JavaScript, the return value of a function that doesn't return anything is evaluated as `undefined`. As such, `undefined` is the only valid value that can be assigned to the type `void` (although, with `strictNullChecks` enabled, `null` can also be assigned):

```ts
const a: void = undefined // works
const b: void = true // type error
```

However, `void` is special in one aspect: A function of type `() => void` can also return other things than `undefined`, even functions that never return are valid assignments.

```ts
type voidFunc = () => void
const returnsUndefined: voidFunc = () => undefined
const returnsTrue: voidFunc = () => true
const returnsString: voidFunc = () => "hello"
const neverReturns: voidFunc = () => {
    throw Error("sorry")
}
// All work, no type errors here
```

If a function is typed as `() => void`, it is just that its return type is evaluated to `void` and thus cannot be used:

```ts
type voidFunc = () => void
const returnsString: voidFunc = () => "hello"
const returnValue = returnsString() // evaluates to "void"
```

This very much looks counter intuitive at first glance - Why have that type in the first place it does not enforce the return type to be undefined? In practice, the useful implication of this is the ability to type a function such that its return type *does not matter*, and, more importantly, use a function with a specific return type in a situation where its return type is unimportant.

Common use cases are the ability to provide callbacks that do return a value to library functions that want a function without a return value.

```ts
const array = []
typeof array.push // (...items: any[]) => number
typeof array.forEach // (callbackfn: (value: any, ...) => void, thisArg?: any) => void
[1, 2, 3].forEach(num => array.push(num))
```

In the final line, we have an inline `forEach` loop that calls the `array.push` function for every item in the `[1, 2, 3]` array. However, `forEach` requires callbacks with `void` as return value, whereas `array.push` returns a number (the length of the new array). So intuitively we would have a type clash here, but the final line is valid in JavaScript and works expected, so the `void` type is defined with this workaround in mind so that those cases are still valid.


## The type `unknown`

Finally, we have the type `unknown`. It behaves similar to `any` as in it being assignable to every other type, except that the compiler forbids you to do anything with something that is `unknown` before (safely) casting it to something more specific. It serves as a safer alternative to `any`, which is okay to use in production (which is something not generally the case with `any`), even though some additional checks are necessary in this case.

```ts
const value: unknown = { user: "Lukas" }
// let's assume this comes from a REST call where we
// don't know the value at compile time

console.log(value.user) // error

if (typeof value === "object" && value !== null && "user" in value) {
    // the if-clause made an implicit cast
    console.log(value.user) // safe, no error
}
```

Explicit casts can also be used with user-defined type guards:

```ts
type T = { user: string }
const isT = (val: any): val is T 
    => typeof value === "object" && value !== null && "user" in value

const value: unknown = { user: "Lukas" }

if (isT(value)) {
    console.log(value.user) // safe, no error
}
```

Note that `unknown` and `any` are also the only legal explicit types for exceptions in catch-clauses, and again `unknown` is the safer way to use here:

```ts
// unsafe catch
try {
    maybeThrows()
} catch (e: any) {
    console.log(e.message)
}

// safe catch
try {
    maybeThrows()
} catch(e: unknown) {
    console.log(e.message)
    // error, e could be anything

    if (e instanceof Error) {
        console.log(e.message)
        // valid
    }
}
```