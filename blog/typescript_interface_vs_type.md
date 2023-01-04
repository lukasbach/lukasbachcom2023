---
slug: "typescript-interfaces-vs-types"
date: "2023-01-04"
title: "TypeScript: Interfaces vs. Types - What to use?"
category: typescript
---

In TypeScript, there are two easy ways to define type definitions to type runtime values with: Interfaces and Types. At first glance, interfaces seem more appropriate for typing objects and classes, while types only bring the benefit of supporting more complex structures like unions, but that is not the case. Let's explore the differences, and see which ones are more appropriate to use in which circumstances.


## Types and Interfaces at a glance

In many projects, interfaces seem to be used more often for simple data structures. Most people are more used to the syntax of interfaces since they also appear in many other programming languages like Java, which at the same time lack a `type` keyword or the ability to construct pure types like in TypeScript.

Many simple projects only really need objects to be typed, and are fine with non-complex type definitions, which make interfaces feel more appropriate. Also, many web projects are react apps that use custom types almost exclusively to type component props, which is just an object anyways. Interfaces can do that very easily in a very intuitive way:

```ts
interface MyComponentProps {
    value: string
    count: number
}
```

Types can be used for more complex type definitions, like unions, intersections, functions or other types.

```ts
type Intersection = string | number
type Union = { a: string } & { b: string }
type Func = (param1: string, param2: number) => void
type Tuple = [string, number]
```

Note that, types can also be embedded in other types. Properties of interfaces can also be complex types:

```ts
interface MyInterface {
    intersection: string | number
    union: { a: string } & { b: string }
    func: (param1: string, param2: number) => void
    tuple: [string, number]
}
```

## Using Interfaces like Types

While it is true that types can do things that interfaces cannot, many of those things can also be achieved with interfaces. For example, an interface can, in addition to properties, also define function signatures. It can even define more than one signature, allowing you to define multiple ways of invocating the function. While that is not necessarily best-practice, it makes it possible to type and document older libraries that often implemented different kinds of handling depending on the types of parameters.

```ts
interface Func {
    (a: number): string
    (a: number, b: number): number
    prop: number
}

declare const f: Func

const a = f(1) // return type is string
const b = f(1, 2) // return type is number
const prop = f.prop // type is number
```

This would be the equivalent of the following type definition:

```ts
type Func2 = 
  & { prop: number }
  & ((a: number) => string)
  & ((a: number, b: number) => number)
```

Type unions can be achieved with interfaces using the `extends` keyword. Both type unions and interfaces extensions can use other types and interfaces interchangably:

```ts
interface A extends B {
  x: string
}

type A = B & { x: string }
```

## The hidden pitfall of interfaces

It sounds like interfaces are great to use for typing objects like props or API responses, whereas `type` is only needed for more complex type definitions. There is however a pitfall with interfaces that is not immediately obvious. Let's take a look at the following code.

```ts
interface Node {
  type: string
}

function logType(node: Node) {
    console.log(node.nodeType)
}
```

You can test this code yourself in a (playground)[https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgHIHsAmKDeBYAKGWTAE8AHCALmQGcwpQBzQgX0MJgFcQExh0IZABt0TACoUIAChBZqaeQEpk+IsWQJBtdMIgA6UU1nz9c7JMpK2QA]. This compiles with no errors, except that it will likely end with runtime errors depending on where the `node` value comes from. This clearly looks like it should cause a type error, since type interface `Node` only defines a `type` property, but the function `logType` uses a property called `nodeType`. When we invesigate the possible properties of `node` that our IDE suggest, we see all sorts of possible values: `cloneNode`, `contains`, `dispatchEvent`...

So what is going on here exactly? The source of this comes from a TypeScript feature called "Declaration Merging". If two interfaces are defined within one scope with the same name, instead of complaining, TypeScript will merge both interfaces together and act like they were defined as one. This simpler example demonstrates this quite well:

```ts
interface MyInterface {
    a: string
}

interface MyInterface {
    b: number
}

/**
 * Results in
 * interface MyInterface {
 *   a: string
 *   b: string
 * }
 */
```

Note that TypeScript does a shallow merge and forbids type conflicts between individual properties. So the second interface declaration could include a property `a: string`, but if that would deviate from the original interface definition, such as `a: number`, a type error would be thrown.

TypeScript also supports declaration merging for namespaces and classes. This allows developers to patch or extend types of external or third-party modules. While this does sound like a very bad anti-pattern, it makes sense to exist considering the history of TypeScript, a language that was built to extend an existing ecosystem rather than introduce its own. With the Definitely Typed repository, it used to by the default case that type declarations for packages were not maintained by the same people that maintained the package itself, and it took some time for package maintainers to maintain their own declarations as part of their packages themselves. It allows developers to more easily control the types of third-party packages and fix issues themselves.

Another reason for it is the ability to monkey-patch external code. Again something that is very much considered an anti-pattern, but was used quite a bit in the past nevertheless. The (TypeScript documentation pages on declaration merging)[https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation] give an example for that:

```ts
import { Observable } from "./observable";

declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}

Observable.prototype.map = function (f) {
  // ...
};
```

In this example, the overwriting interface is defined in the scope of the external module. Let's go back to the original example:

```ts
interface Node {
  type: string
}

function logType(node: Node) {
    console.log(node.nodeType)
}
```

Here, the original definition of the `Node` type comes from the DOM library which is globally defined in the JavaScript Browser runtime, and as such is globally pulled in by TypeScript. It is defined in `lib.dom.d.ts` as part of the TS standard typings. Whether or not it is pulled in globally actually depends on the `compilerOptions.lib` property in your `tsconfig.json`, which, for web projects, most likely contains `dom` and some EcmaScript standard library definitions like `esnext`. All types defined in those libraries are pulled in globally by TypeScript (since they exist globally in the runtime as well), and can merge with your own types if their names collide.

Notably, declaration merging is not happening for `type` definitions, so defining a type without using `interface` is safe from being merged with colliding symbols.

```ts
type A {
    a: string
}
type A { // error, already defined
    b: string
}
```

## Useful applications of declaration merging

I just mentioned some ways how declaration merging can be used to patch external libraries to fix typing issues or monkey patch third-party symbols. While both cases border the area of bad-practice or are already a few steps beyond that border, there is at least one very useful application for declaration merging that I found.

If you ever wanted to use cutting-edge browser functionality that is still part of a working draft but already implemented by some browsers, there is a chance that the functions you want to use are not yet part of the official type declarations for the browser libraries, but already supported to be used in some runtimes. If you want to use that code, you often end up with ugly workarounds like this:

```ts
navigator.mediaDevices.getUserMedia({video: true})
  .then((mediaStream) => {
    const track = mediaStream.getVideoTracks()[0]
    // global ImageCapture is supported in some browsers, but not
    // yet part of official typings
    const imageCapture = new (window as any).ImageCapture(track)
    imageCapture.takePhoto() // no type support, imageCapture is any
  })
```

Instead, you can extend the types in the global scope and add what you expect is defined:

```ts
declare global {
    class ImageCapture {
        constructor(track: MediaStreamTrack)
        takePhoto(): Promise<Blob>
    }
}

navigator.mediaDevices.getUserMedia({video: true})
  .then((mediaStream) => {
    const track = mediaStream.getVideoTracks()[0]
    const imageCapture = new ImageCapture(track)
    imageCapture.takePhoto() // imageCapture is typed
  })
```

If you extend existing objects with new properties, you might also want to mark them as potentially undefined to get type alerts in cases where you do not check whether the property exists in the current runtime or not.

Another similar use case is explicitly typing when you add custom properties to the `window` object. While that might not always be the best solution, it is not uncommon to communicate though the `window` object in cases where two modules do not have any other way of communicating. Example are micro-frontends where individual components want to exchange information, a standard library that is injected into the global context by an underlying framework or external libraries loaded from CDNs that just inject the library code as global variable.

```ts
interface Window {
  __MY_CUSTOMLIB: {
    log: () => void;
  }
}

window.__MY_CUSTOMLIB.log()
```

## Conclusion

So, what should we use in real projects, interfaces or types? There definitely has been some voices in the past suggesting to not use the `interface` keyword at all and rely on `type`s entirely to avoid the risk of unintended declaration merging.

However, it can also be difficult and potentially not worth it to change large code bases in that regard, which already are using interfaces. In my opinion, it is okay to use interfaces as long as you keep the pitfalls it comes with in mind and be alert of when a collision might be happening. More specific interface names can help with that. There also exists an eslint rule `no-unsafe-declaration-merging`, however that only disallows declaration merging of classes and interfaces, not declaration merging altogether.

In new projects, or generally if you have a choice, I would still recommend to use `type` rather than `interface` since there are no real benefits of `interface` in normal circumstances. And if you need to extend types from third-party libraries or any standard library, you can use `interface` to adjust the type to what you expect, and continue to use the library with proper type inference and no need to use `any` as unsafe workarounds.